"use server";

import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  getGDriveClientConfig,
  getGDriveCredentials,
  listGoogleDriveFolders,
  createGoogleDriveFolder,
  listGoogleDriveFilesInFolder,
  uploadFileToGoogleDrive,
} from "@/lib/services/gdrive";
import { saveSystemConfigAction } from "./config";
import { logAction } from "@/lib/logger";

interface BaseFolderSettings {
  baseFolderId: string;
  baseFolderName: string;
}

/**
 * Saves Google Client ID and Secret in database.
 */
export async function saveGoogleDriveClientConfigAction(clientId: string, clientSecret: string) {
  try {
    const config = { clientId: clientId.trim(), clientSecret: clientSecret.trim() };
    await saveSystemConfigAction("gdrive_client_config", config);

    await logAction("gdrive_client_config", "SYSTEM", {
      actionName: "UPDATE_GDRIVE_CLIENT_CONFIG",
      actor: "System Admin",
      description: "Updated Google Drive OAuth client configurations.",
      time: new Date().toISOString(),
      previousValue: null,
      newValue: { clientId: config.clientId }, // hide client secret in logs
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save Google Drive client config server action:", error);
    return { success: false, error: error.message || "Failed to save configurations." };
  }
}

/**
 * Checks connection and configuration status of Google Drive integration
 */
export async function getGoogleDriveStatusAction() {
  try {
    const clientConfig = await getGDriveClientConfig();
    const credentials = await getGDriveCredentials();

    // Check base folder settings
    const settingsRecord = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "gdrive_settings"))
      .limit(1);

    const baseFolder =
      settingsRecord.length > 0 ? (settingsRecord[0].value as BaseFolderSettings) : null;

    const isConnected = !!credentials && !!credentials.accessToken;

    return {
      success: true,
      hasConfig: !!clientConfig && !!clientConfig.clientId && !!clientConfig.clientSecret,
      isConnected,
      baseFolder,
      clientId: clientConfig?.clientId || "",
    };
  } catch (error: any) {
    console.error("Failed to check Google Drive integration status:", error);
    return { success: false, error: error.message || "Failed to check integration status." };
  }
}

/**
 * Generates OAuth2 consent URL for the stored client ID.
 */
export async function getGoogleDriveAuthUrlAction(origin: string) {
  try {
    const clientConfig = await getGDriveClientConfig();
    if (!clientConfig || !clientConfig.clientId) {
      throw new Error("Google Client ID is missing. Please configure credentials first.");
    }

    const redirectUri = `${origin}/api/auth/callback/google-drive`;
    const scopes = [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: clientConfig.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      prompt: "consent",
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return { success: true, url };
  } catch (error: any) {
    console.error("Failed to generate Google auth URL:", error);
    return { success: false, error: error.message || "Failed to generate connection link." };
  }
}

/**
 * Disconnects Google Drive integration and purges stored credentials & base folder configurations.
 */
export async function disconnectGoogleDriveAction() {
  try {
    // Delete credentials and settings records from database
    await db.delete(systemConfig).where(eq(systemConfig.key, "gdrive_credentials"));
    await db.delete(systemConfig).where(eq(systemConfig.key, "gdrive_settings"));

    await logAction("gdrive_integration", "SYSTEM", {
      actionName: "DISCONNECT_GDRIVE",
      actor: "System Admin",
      description: "Disconnected Google Drive integration and purged credentials.",
      time: new Date().toISOString(),
      previousValue: null,
      newValue: null,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to disconnect Google Drive integration:", error);
    return { success: false, error: error.message || "Failed to disconnect integration." };
  }
}

/**
 * Lists available folders in user's root Google Drive for Base Folder selection.
 */
export async function listBaseFolderOptionsAction() {
  try {
    const folders = await listGoogleDriveFolders();
    return { success: true, folders };
  } catch (error: any) {
    console.error("Failed to retrieve Google Drive folders list:", error);
    return { success: false, error: error.message || "Failed to load folders from Google Drive." };
  }
}

/**
 * Configures the Base Folder in Google Drive settings.
 */
export async function saveBaseFolderSettingsAction(folderId: string, folderName: string) {
  try {
    const settings: BaseFolderSettings = {
      baseFolderId: folderId,
      baseFolderName: folderName,
    };
    await saveSystemConfigAction("gdrive_settings", settings);

    await logAction("gdrive_settings", "SYSTEM", {
      actionName: "UPDATE_GDRIVE_BASE_FOLDER",
      actor: "System Admin",
      description: `Saved Google Drive base sync folder: '${folderName}' (${folderId})`,
      time: new Date().toISOString(),
      previousValue: null,
      newValue: settings,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save base folder settings:", error);
    return { success: false, error: error.message || "Failed to save folder settings." };
  }
}

/**
 * Creates a brand new Base Folder at Google Drive root and sets it active.
 */
export async function createBaseFolderAction(folderName: string) {
  try {
    const folder = await createGoogleDriveFolder(folderName.trim());
    await saveBaseFolderSettingsAction(folder.id, folder.name);

    return { success: true, folderId: folder.id, folderName: folder.name };
  } catch (error: any) {
    console.error("Failed to create brand new Google Drive folder:", error);
    return { success: false, error: error.message || "Failed to create folder." };
  }
}

/**
 * Resolves project specific subfolder or creates one if not existing.
 */
async function getOrCreateProjectSubfolder(projectId: string, baseFolderId: string): Promise<string> {
  const folders = await listGoogleDriveFolders(baseFolderId);
  const targetName = `Project-${projectId}`;
  const existingFolder = folders.find((f: any) => f.name === targetName);

  if (existingFolder) {
    return existingFolder.id;
  }

  // Create subfolder dynamically
  console.log(`Creating project subfolder dynamically: ${targetName} under parent: ${baseFolderId}`);
  const newFolder = await createGoogleDriveFolder(targetName, baseFolderId);
  return newFolder.id;
}

/**
 * Lists all files inside the project's subfolder under the Base Folder.
 */
export async function getProjectDocumentsAction(projectId: string) {
  try {
    const status = await getGoogleDriveStatusAction();
    if (!status.success || !status.isConnected || !status.baseFolder) {
      return { success: false, notIntegrated: true, files: [] };
    }

    const baseFolderId = status.baseFolder.baseFolderId;

    // Retrieve active subfolder
    const projectFolderId = await getOrCreateProjectSubfolder(projectId, baseFolderId);

    // List files
    const gDriveFiles = await listGoogleDriveFilesInFolder(projectFolderId);

    // Map to UI expectations
    const files = gDriveFiles.map((file: any) => ({
      id: file.id,
      name: file.name,
      type: getFriendlyMimeType(file.mimeType),
      size: formatBytes(Number(file.size || 0)),
      status: "Approved" as const,
      updatedAt: new Date(file.createdTime).toISOString().split("T")[0],
    }));

    return { success: true, files, projectFolderId };
  } catch (error: any) {
    console.error(`Failed to load Google Drive documents for project ${projectId}:`, error);
    return { success: false, error: error.message || "Failed to fetch cloud documents." };
  }
}

/**
 * Uploads a document directly to the project subfolder.
 */
export async function uploadProjectDocumentAction(projectId: string, formData: FormData) {
  try {
    const status = await getGoogleDriveStatusAction();
    if (!status.success || !status.isConnected || !status.baseFolder) {
      throw new Error("Google Drive integration is not active.");
    }

    const baseFolderId = status.baseFolder.baseFolderId;
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file payload found in the upload form.");
    }

    // Resolve or create project specific folder
    const projectFolderId = await getOrCreateProjectSubfolder(projectId, baseFolderId);

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();

    // Perform upload
    const uploaded = await uploadFileToGoogleDrive(
      file.name,
      file.type || "application/octet-stream",
      arrayBuffer,
      projectFolderId
    );

    // Revalidate paths to trigger fresh renders
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true, fileId: uploaded.id, fileName: uploaded.name };
  } catch (error: any) {
    console.error(`Failed to upload project document for ${projectId}:`, error);
    return { success: false, error: error.message || "Failed to upload file to Google Drive." };
  }
}

/**
 * Maps standard Google mimeTypes to readable UI formats
 */
function getFriendlyMimeType(mimeType: string): string {
  if (mimeType === "application/pdf") return "PDF Document";
  if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessing")) return "Word Document";
  if (mimeType.includes("excel") || mimeType.includes("officedocument.spreadsheet")) return "Spreadsheet";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint") || mimeType.includes("officedocument.presentation")) return "Presentation";
  if (mimeType.startsWith("image/")) return "Image Asset";
  if (mimeType.includes("json")) return "JSON Config";
  if (mimeType.includes("markdown") || mimeType === "text/markdown" || mimeType === "text/x-markdown") return "Markdown";
  if (mimeType.startsWith("text/")) return "Text Document";
  return "Digital Asset";
}

/**
 * Formats size in bytes to a human-readable string.
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
