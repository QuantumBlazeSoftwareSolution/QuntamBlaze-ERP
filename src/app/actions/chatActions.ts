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


