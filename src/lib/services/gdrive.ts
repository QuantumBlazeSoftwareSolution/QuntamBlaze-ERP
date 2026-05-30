import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { saveSystemConfigAction } from "@/app/actions/config";

interface GDriveCredentials {
  accessToken: string;
  refreshToken: string;
  expiryDate: number; // timestamp in ms
}

interface GDriveClientConfig {
  clientId: string;
  clientSecret: string;
}

/**
 * Retrieves client OAuth configurations from database
 */
export async function getGDriveClientConfig(): Promise<GDriveClientConfig | null> {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "gdrive_client_config"))
      .limit(1);

    if (record.length === 0) return null;
    return record[0].value as GDriveClientConfig;
  } catch (error) {
    console.error("Error fetching Google Drive client config:", error);
    return null;
  }
}

/**
 * Retrieves token credentials from database
 */
export async function getGDriveCredentials(): Promise<GDriveCredentials | null> {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "gdrive_credentials"))
      .limit(1);

    if (record.length === 0) return null;
    return record[0].value as GDriveCredentials;
  } catch (error) {
    console.error("Error fetching Google Drive token credentials:", error);
    return null;
  }
}

/**
 * Ensures access token is fresh, automatically refreshing it if expired.
 */
export async function getFreshAccessToken(): Promise<string | null> {
  const credentials = await getGDriveCredentials();
  if (!credentials) return null;

  const clientConfig = await getGDriveClientConfig();
  if (!clientConfig) return null;

  const now = Date.now();
  // Refresh token if it's expired or about to expire in the next 60 seconds
  if (credentials.expiryDate - now < 60000) {
    console.log("Google Drive access token expired or expiring soon, refreshing...");
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientConfig.clientId,
          client_secret: clientConfig.clientSecret,
          refresh_token: credentials.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to refresh Google Drive token:", errorData);
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.access_token;
      const expiresIn = data.expires_in || 3600; // default 1 hour
      const newExpiryDate = Date.now() + expiresIn * 1000;

      // Update credentials in database
      const updatedCreds = {
        ...credentials,
        accessToken: newAccessToken,
        expiryDate: newExpiryDate,
      };

      await saveSystemConfigAction("gdrive_credentials", updatedCreds);
      console.log("Google Drive access token successfully refreshed and stored.");
      return newAccessToken;
    } catch (err) {
      console.error("Error requesting token refresh from Google:", err);
      return null;
    }
  }

  return credentials.accessToken;
}

/**
 * Lists all folders inside a specific parent folder in Google Drive.
 */
export async function listGoogleDriveFolders(parentId?: string) {
  const token = await getFreshAccessToken();
  if (!token) throw new Error("Google Drive is not authenticated.");

  let query = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name)&orderBy=name`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Google API Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Creates a folder inside a specified parent in Google Drive
 */
export async function createGoogleDriveFolder(
  folderName: string,
  parentId?: string
): Promise<{ id: string; name: string }> {
  const token = await getFreshAccessToken();
  if (!token) throw new Error("Google Drive is not authenticated.");

  const url = "https://www.googleapis.com/drive/v3/files";
  const body: any = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentId) {
    body.parents = [parentId];
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Failed to create folder: ${err.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Lists files within a project specific Google Drive folder.
 */
export async function listGoogleDriveFilesInFolder(folderId: string) {
  const token = await getFreshAccessToken();
  if (!token) throw new Error("Google Drive is not authenticated.");

  const query = `'${folderId}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,size,createdTime)&orderBy=createdTime desc`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Failed to list files: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Uploads a file buffer directly to a specific Google Drive folder.
 */
export async function uploadFileToGoogleDrive(
  fileName: string,
  mimeType: string,
  buffer: ArrayBuffer,
  folderId: string
): Promise<{ id: string; name: string }> {
  const token = await getFreshAccessToken();
  if (!token) throw new Error("Google Drive is not authenticated.");

  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", new Blob([buffer], { type: mimeType }));

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Upload failed: ${err.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Grants "Anyone with the link can view" permission to a file in Google Drive.
 */
export async function grantAnyoneWithLinkPermission(fileId: string): Promise<void> {
  const token = await getFreshAccessToken();
  if (!token) throw new Error("Google Drive is not authenticated.");

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "reader",
      type: "anyone",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Failed to grant 'Anyone with link' permission:", err);
    throw new Error(`Permission grant failed: ${err.error?.message || response.statusText}`);
  }
}
