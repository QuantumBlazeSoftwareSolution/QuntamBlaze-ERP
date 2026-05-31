import { db } from "@/lib/db";
import { chatMessages, users, roles } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

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

    // Map and parse attachments safely
    const parsedMessages = messages.map((m) => ({
      ...m,
      attachments:
        typeof m.attachments === "string"
          ? JSON.parse(m.attachments)
          : m.attachments || [],
    }));

    return NextResponse.json(parsedMessages);
  } catch (error: any) {
    console.error("Failed to load chat history:", error);
    return NextResponse.json({ error: error.message || "Failed to load chat history" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, senderId, messageText } = body;
    const attachments = body.attachments || [];

    if (!projectId || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const messageId = `MSG-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Insert message into Postgres DB
    await db.insert(chatMessages).values({
      id: messageId,
      projectId,
      senderId,
      messageText: messageText || "",
      attachments: attachments,
    });

    // Query sender details for enriched payload
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
      name: "Unknown User",
      avatar: null,
      roleName: "Member",
      roleColor: "#10B981",
    };

    const messagePayload = {
      id: messageId,
      projectId,
      senderId,
      messageText: messageText || "",
      attachments: attachments,
      createdAt: new Date().toISOString(),
      senderName: sender.name,
      senderAvatar: sender.avatar,
      roleName: sender.roleName,
      roleColor: sender.roleColor,
    };

    return NextResponse.json(messagePayload);
  } catch (error: any) {
    console.error("Failed to save chat message:", error);
    return NextResponse.json({ error: error.message || "Failed to save message" }, { status: 500 });
  }
}
