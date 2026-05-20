import { db } from "@/lib/db";
import { systemLog } from "@/lib/db/schema/logs";
import { v4 as uuidv4 } from "uuid";

export interface LogDetails {
  actionName: string;
  actor: string;
  description: string;
  time: string;
  previousValue?: any;
  newValue?: any;
}

export async function logAction(
  entityId: string,
  entityType: string,
  details: LogDetails
) {
  try {
    await db.insert(systemLog).values({
      id: uuidv4(),
      entityId,
      entityType,
      details,
    });
  } catch (error) {
    console.error("Failed to insert system log:", error);
    // Don't throw, we don't want to break the main transaction just because logging failed.
  }
}
