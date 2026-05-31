"use server";

import webpush from "web-push";
import { db } from "@/lib/db";
import { pushSubscriptions, systemConfig } from "@/lib/db/schema";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { getPusherInstance } from "@/lib/pusher/server";
import { v4 as uuidv4 } from "uuid";

// symmetric check to load VAPID keys programmatically or dynamically
async function initWebPush() {
  let publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  let privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    try {
      const record = await db
        .select()
        .from(systemConfig)
        .where(eq(systemConfig.key, "vapid_keys"))
        .limit(1);

      if (record && record.length > 0) {
        const value = record[0].value as any;
        publicKey = value.publicKey;
        privateKey = value.privateKey;
      } else {
        console.log("[QB-PUSH] No VAPID keys found in env/db. Generating dynamically...");
        const keys = webpush.generateVAPIDKeys();
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
        await db.insert(systemConfig).values({
          key: "vapid_keys",
          value: { publicKey, privateKey },
        });
        console.log("[QB-PUSH] ✓ Dynamic VAPID keys generated and stored in system_config.");
      }
    } catch (err) {
      console.error("[QB-PUSH] Failed to load VAPID keys:", err);
    }
  }

  if (publicKey && privateKey) {
    webpush.setVapidDetails(
      "mailto:ops-connect-support@quantumblaze.com",
      publicKey,
      privateKey
    );
  }
  return { publicKey };
}

/**
 * Server Action to load/expose the VAPID Public Key for client-side subscription initialization.
 */
export async function getVapidPublicKeyAction() {
  try {
    const { publicKey } = await initWebPush();
    return { success: true, publicKey: publicKey || "" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load VAPID public key." };
  }
}

/**
 * Saves/registers an employee's push credentials securely in the database.
 */
export async function savePushSubscriptionAction(subscription: any) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "Authentication required." };
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return { success: false, error: "Invalid subscription details." };
    }

    // Check if subscription already exists for this endpoint
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
      .limit(1);

    if (existing && existing.length > 0) {
      await db
        .update(pushSubscriptions)
        .set({
          userId: session.userId,
          keys: subscription.keys,
        })
        .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
    } else {
      await db.insert(pushSubscriptions).values({
        id: `SUB-${uuidv4().slice(0, 8).toUpperCase()}`,
        userId: session.userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error("[QB-PUSH] Failed to save push subscription:", err);
    return { success: false, error: err.message || "Failed to save push subscription." };
  }
}

/**
 * Triggers a real-time notification broadcast:
 * - Broadcasts a WebSocket message immediately using Pusher (for active in-app toast updates).
 * - Forwards a VAPID-signed Web Push payload to native browser push servers for closed-tab/offline OS alerts.
 */
export async function triggerRealtimeAlertAction(
  targetUserId: string,
  notificationData: {
    type: "invoice" | "task" | "proposal" | "lead";
    entityId: string;
    message: string;
    url?: string;
  }
) {
  try {
    const notificationPayload = {
      id: `NTF-${uuidv4().slice(0, 8).toUpperCase()}`,
      type: notificationData.type,
      entityId: notificationData.entityId,
      message: notificationData.message,
      timestamp: new Date().toISOString(),
      read: false,
      group: "today" as const,
    };

    // 1. Broadcast via Pusher for active connected users
    const pusher = await getPusherInstance();
    if (pusher) {
      try {
        await pusher.trigger(`user-${targetUserId}`, "new-notification", notificationPayload);
        console.log(`[QB-PUSH] ✓ Real-time Pusher broadcast sent to channel user-${targetUserId}`);
      } catch (pusherErr) {
        console.error("[QB-PUSH] Pusher notification broadcast failed:", pusherErr);
      }
    }

    // 2. Dispatch OS push notification for offline / closed-tab users
    await initWebPush();
    const subs = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, targetUserId));

    if (subs && subs.length > 0) {
      console.log(`[QB-PUSH] Delivering OS Web Push to ${subs.length} active device(s) for user ${targetUserId}...`);
      const payloadString = JSON.stringify({
        title: "QuantumBlaze ERP Update 🚀",
        body: notificationData.message,
        url: notificationData.url || "/dashboard",
      });

      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as any,
            },
            payloadString
          );
        } catch (pushErr: any) {
          console.warn(`[QB-PUSH] Push to subscription ${sub.id} failed:`, pushErr.message);
          // If browser push server rejects (expired subscription), auto-clean subscription record
          if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
            console.log(`[QB-PUSH] Cleaning up expired subscription record: ${sub.id}`);
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
          }
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("[QB-PUSH] Failed to trigger real-time alert:", err);
    return { success: false, error: err.message || "Failed to trigger real-time alert." };
  }
}
