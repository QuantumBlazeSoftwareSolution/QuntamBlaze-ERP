"use server";

import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { logAction } from "@/lib/logger";
import { revalidatePath } from "next/cache";

const DEFAULT_CONFIGS: Record<string, any> = {
  currency: {
    code: "LKR",
    symbol: "Rs.",
    name: "Sri Lankan Rupee",
  },
  country: {
    name: "Sri Lanka",
    code: "LK",
  },
};

export async function getSystemConfigsAction() {
  try {
    // Self-healing database initialization: ensure the table exists
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "system_config" (
          "key" varchar(255) PRIMARY KEY NOT NULL,
          "value" jsonb NOT NULL
        );
      `);
    } catch (tableErr) {
      console.warn("Table auto-creation check failed, attempting to select anyway:", tableErr);
    }

    const records = await db.select().from(systemConfig);
    const configs: Record<string, any> = {};

    // Map records to object key-value
    for (const record of records) {
      configs[record.key] = record.value;
    }

    // Seed missing defaults dynamically in database
    for (const key of Object.keys(DEFAULT_CONFIGS)) {
      if (!(key in configs)) {
        await db.insert(systemConfig).values({
          key,
          value: DEFAULT_CONFIGS[key],
        }).onConflictDoNothing();
        configs[key] = DEFAULT_CONFIGS[key];
      }
    }

    return { success: true, configs };
  } catch (error: any) {
    console.error("Failed to retrieve system configs:", error);
    return { success: false, error: "Database error while fetching configurations.", configs: DEFAULT_CONFIGS };
  }
}

export async function saveSystemConfigAction(key: string, value: any) {
  try {
    // 1. Fetch previous value for audit logging
    const existing = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, key))
      .limit(1);

    const previousValue = existing.length > 0 ? existing[0].value : null;

    // 2. Perform upsert
    await db
      .insert(systemConfig)
      .values({ key, value })
      .onConflictDoUpdate({
        target: systemConfig.key,
        set: { value },
      });

    // 3. Log the system configuration update action
    await logAction(key, "SYSTEM", {
      actionName: "UPDATE_SYSTEM_CONFIG",
      actor: "System Admin",
      description: `Updated system configuration key: '${key}'`,
      time: new Date().toISOString(),
      previousValue,
      newValue: value,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to save system config for ${key}:`, error);
    return { success: false, error: error.message || "Database error while saving configuration." };
  }
}
