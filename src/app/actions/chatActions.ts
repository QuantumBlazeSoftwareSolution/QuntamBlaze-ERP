"use server";

import { db } from "@/lib/db";
import { chatMessages, users, roles } from "@/lib/db/schema";
import { getPusherInstance } from "@/lib/pusher/server";
import { getGoogleDriveStatusAction } from "./gdriveActions";
import { getSession } from "@/lib/session";
import { uploadFileToGoogleDrive, listGoogleDriveFolders, createGoogleDriveFolder, grantAnyoneWithLinkPermission } from "@/lib/services/gdrive";
import { eq, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

/**
 * Helper to recursively list folders and find/create subfolder by name.
 */
async function getOrCreateSubfolderByName(name: string, parentId: string): Promise<string> {
  const folders = await listGoogleDriveFolders(parentId);
  const existingFolder = folders.find((f: any) => f.name === name);
  if (existingFolder) {
    return existingFolder.id;
  }
  const newFolder = await createGoogleDriveFolder(name, parentId);
  return newFolder.id;
}

/**
 * Retrieves chat history for a project, joined with user profile info.
 */
export async function getChatMessagesAction(projectId: string) {
  try {
    const messages = await db
      .select({
        id: chatMessages.id,
        projectId: chatMessages.projectId,
        senderId: chatMessages.senderId,
        messageText: chatMessages.messageText,
        attachments: chatMessages.attachments,
        createdAt: chatMessages.createdAt,
        senderName: users.name,
        senderAvatar: users.avatar,
        roleName: roles.name,
        roleColor: roles.color,
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.senderId, users.id))
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(chatMessages.projectId, projectId))
      .orderBy(asc(chatMessages.createdAt));

    return { success: true, messages };
  } catch (error: any) {
    console.error("Failed to load chat messages:", error);
    return { success: false, error: error.message || "Failed to load chat messages." };
  }
}

/**
 * Saves a chat message and triggers Pusher real-time broadcast.
 */
export async function sendChatMessageAction(
  projectId: string,
  messageText: string,
  attachments: any[] = []
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const senderId = session.userId;
    const messageId = `MSG-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Insert message into Postgres DB
    await db.insert(chatMessages).values({
      id: messageId,
      projectId,
      senderId,
      messageText,
      attachments: attachments,
    });

    // Query sender details for broadcasting enriched payload
    const userDetails = await db
      .select({
        name: users.name,
        avatar: users.avatar,
        roleName: roles.name,
        roleColor: roles.color,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, senderId))
      .limit(1);

    const sender = userDetails[0] || {
      name: session.name || "Unknown User",
      avatar: null,
      roleName: session.roleName || "Member",
      roleColor: session.roleColor || "#10B981",
    };

    const messagePayload = {
      id: messageId,
      projectId,
      senderId,
      messageText,
      attachments,
      createdAt: new Date().toISOString(),
      senderName: sender.name,
      senderAvatar: sender.avatar,
      roleName: sender.roleName,
      roleColor: sender.roleColor,
    };

    // Trigger Pusher channels broadcast
    const pusher = await getPusherInstance();
    if (pusher) {
      try {
        await pusher.trigger(`project-${projectId}`, "new-message", messagePayload);
      } catch (pusherErr) {
        console.error("Pusher broadcast failed:", pusherErr);
      }
    }

    return { success: true, message: messagePayload };
  } catch (error: any) {
    console.error("Failed to send chat message:", error);
    return { success: false, error: error.message || "Failed to send message." };
  }
}

/**
 * Uploads a chat attachment directly to Google Drive in chat/[projectId] subfolder.
 */
export async function uploadChatAttachmentAction(projectId: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error("Unauthorized. Please log in.");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file payload found.");
    }

    // 10MB limit enforcement
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error("File size exceeds the 10MB upload limit.");
    }

    // Resolve Google Drive base folder setup
    const driveStatus = await getGoogleDriveStatusAction();
    if (!driveStatus.success || !driveStatus.isConnected || !driveStatus.baseFolder) {
      throw new Error("Google Drive integration is not configured or connected.");
    }

    const baseFolderId = driveStatus.baseFolder.baseFolderId;

    // 1. Get or Create "chat" folder inside the Base Folder
    const chatFolderId = await getOrCreateSubfolderByName("chat", baseFolderId);

    // 2. Get or Create "[projectId]" folder inside the "chat" folder
    const projectFolderId = await getOrCreateSubfolderByName(projectId, chatFolderId);

    // 3. Convert file into ArrayBuffer and execute Google Drive upload
    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await uploadFileToGoogleDrive(
      file.name,
      file.type || "application/octet-stream",
      arrayBuffer,
      projectFolderId
    );

    // 4. Grant "Anyone with the link" access so other users can view it inline
    await grantAnyoneWithLinkPermission(uploaded.id);

    return {
      success: true,
      attachment: {
        id: uploaded.id,
        name: uploaded.name,
        link: `https://drive.google.com/open?id=${uploaded.id}`,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      },
    };
  } catch (error: any) {
    console.error("Failed to upload chat file to Google Drive:", error);
    return { success: false, error: error.message || "Failed to upload file." };
  }
}
