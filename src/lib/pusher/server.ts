import Pusher from "pusher";
import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getPusherInstance(): Promise<Pusher | null> {
  let appId = process.env.PUSHER_APP_ID;
  let key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  let secret = process.env.PUSHER_SECRET;
  let cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  try {
    const configRecord = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "pusher_config"))
      .limit(1);

    if (configRecord && configRecord.length > 0 && configRecord[0].value) {
      const config = configRecord[0].value as any;
      if (config.appId) appId = config.appId;
      if (config.key) key = config.key;
      if (config.secret) secret = config.secret;
      if (config.cluster) cluster = config.cluster;
    }
  } catch (err) {
    console.error("Failed to load Pusher config from DB:", err);
  }

  if (!appId || !key || !secret || !cluster) {
    return null;
  }

  return new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });
}
