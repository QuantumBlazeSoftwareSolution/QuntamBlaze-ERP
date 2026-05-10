import { eq, isNull, and } from "drizzle-orm";
import { db } from "../../index";
import { leads } from "../../schema";

export async function getAllLeads() {
  try {
    const data = await db.select().from(leads).where(isNull(leads.deletedAt));
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}

export async function getLeadById(id: string) {
  try {
    const data = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, id), isNull(leads.deletedAt)))
      .limit(1);

    if (data.length === 0) return { success: false, error: "Lead not found" };
    return { success: true, data: data[0] };
  } catch (error) {
    console.error(`Failed to fetch lead ${id}:`, error);
    return { success: false, error: "Failed to fetch lead" };
  }
}
