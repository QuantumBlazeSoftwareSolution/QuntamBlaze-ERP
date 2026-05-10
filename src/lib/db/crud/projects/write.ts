import { eq } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "../../index";
import { projects } from "../../schema";

// Generate Zod schemas directly from the Drizzle schema
export const insertProjectSchema = createInsertSchema(projects);
export const updateProjectSchema = createUpdateSchema(projects).omit({ createdAt: true });

export async function createProject(data: z.infer<typeof insertProjectSchema>) {
  try {
    // Validate payload
    const parsedData = insertProjectSchema.parse(data);

    const [newProject] = await db
      .insert(projects)
      .values(parsedData)
      .returning();

    return { success: true, data: newProject };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Validation or database error during creation" };
  }
}

export async function updateProject(id: string, data: z.infer<typeof updateProjectSchema>) {
  try {
    // Validate payload
    const parsedData = updateProjectSchema.parse(data);

    const [updatedProject] = await db
      .update(projects)
      .set({ ...parsedData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    return { success: true, data: updatedProject };
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    return { success: false, error: "Validation or database error during update" };
  }
}
