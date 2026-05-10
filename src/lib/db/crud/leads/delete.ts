import { eq } from "drizzle-orm";
import { db } from "../../index";
import { leads } from "../../schema";

export async function softDeleteLead(id: string) {
  try {
    const [deletedLead] = await db
      .update(leads)
      .set({ deletedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!deletedLead) return { success: false, error: "Lead not found or already deleted" };
    return { success: true, data: deletedLead };
  } catch (error) {
    console.error(`Failed to delete lead ${id}:`, error);
    return { success: false, error: "Database error during soft deletion" };
  }
}
