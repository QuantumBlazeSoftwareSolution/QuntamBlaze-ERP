import { db } from "@/lib/db";
import { idConfig } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Persistently tracks and increments sequences for entity IDs.
 */
export async function incrementAndGet(id: string, prefix: string): Promise<number> {
  // Try to find the existing config
  const existing = await db.query.idConfig.findFirst({
    where: eq(idConfig.id, id),
  });

  if (!existing) {
    // Initialize if not exists
    await db.insert(idConfig).values({
      id,
      prefix,
      lastSequence: 1,
    });
    return 1;
  }

  // Increment
  const result = await db
    .update(idConfig)
    .set({
      lastSequence: sql`${idConfig.lastSequence} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(idConfig.id, id))
    .returning({ lastSequence: idConfig.lastSequence });

  return result[0].lastSequence;
}

/**
 * Previews the next sequence for an entity ID without incrementing it.
 */
export async function previewNextSequence(id: string): Promise<number> {
  const existing = await db.query.idConfig.findFirst({
    where: eq(idConfig.id, id),
  });

  if (!existing) {
    return 1;
  }

  return existing.lastSequence + 1;
}
