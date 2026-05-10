import { eq } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "../../index";
import { leads } from "../../schema";

export const insertLeadSchema = createInsertSchema(leads);
export const updateLeadSchema = createUpdateSchema(leads).omit({ createdAt: true });

export async function createLead(data: z.infer<typeof insertLeadSchema>) {
  try {
    const parsedData = insertLeadSchema.parse(data);

    const [newLead] = await db.insert(leads).values(parsedData).returning();

    return { success: true, data: newLead };
  } catch (error) {
    console.error("Failed to create lead:", error);
    return { success: false, error: "Validation or database error during creation" };
  }
}

export async function updateLead(id: string, data: z.infer<typeof updateLeadSchema>) {
  try {
    const parsedData = updateLeadSchema.parse(data);

    const [updatedLead] = await db
      .update(leads)
      .set({ ...parsedData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    return { success: true, data: updatedLead };
  } catch (error) {
    console.error(`Failed to update lead ${id}:`, error);
    return { success: false, error: "Validation or database error during update" };
  }
}
