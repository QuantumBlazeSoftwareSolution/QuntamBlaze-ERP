"use server";

import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { saveSystemConfigAction } from "./config";

export async function savePusherConfigAction(
  appId: string,
  key: string,
  secret: string,
  cluster: string
) {
  try {
    if (!appId || !key || !secret || !cluster) {
      throw new Error("All fields (App ID, Key, Secret, Cluster) are required.");
    }
    const config = { appId, key, secret, cluster };
    await saveSystemConfigAction("pusher_config", config);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save Pusher configuration." };
  }
}

export async function getPusherStatusAction() {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "pusher_config"))
      .limit(1);

    if (record && record.length > 0 && record[0].value) {
      const config = record[0].value as any;
      return {
        success: true,
        isConfigured: !!(config.appId && config.key && config.secret && config.cluster),
        appId: config.appId || "",
        key: config.key || "",
        cluster: config.cluster || "",
      };
    }

    // Check environment variables fallback
    const hasEnv = !!(
      process.env.PUSHER_APP_ID &&
      process.env.NEXT_PUBLIC_PUSHER_KEY &&
      process.env.PUSHER_SECRET &&
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    );

    if (hasEnv) {
      return {
        success: true,
        isConfigured: true,
        appId: process.env.PUSHER_APP_ID || "",
        key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      };
    }

    return { success: true, isConfigured: false };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to read Pusher configuration." };
  }
}

export async function disconnectPusherAction() {
  try {
    await db.delete(systemConfig).where(eq(systemConfig.key, "pusher_config"));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to disconnect Pusher." };
  }
}
