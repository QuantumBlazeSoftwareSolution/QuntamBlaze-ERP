import { eq } from "drizzle-orm";
import { db } from "../../index";
import { projects } from "../../schema";

/**
 * Soft deletes a project by setting the deletedAt timestamp.
 */
export async function softDeleteProject(id: string) {
  try {
    const [deletedProject] = await db
      .update(projects)
      .set({ deletedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (!deletedProject) {
      return { success: false, error: "Project not found or already deleted" };
    }

    return { success: true, data: deletedProject };
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    return { success: false, error: "Database error during soft deletion" };
  }
}

/**
 * Hard deletes a project permanently. Use with caution.
 */
export async function hardDeleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true };
  } catch (error) {
    console.error(`Failed to hard delete project ${id}:`, error);
    return { success: false, error: "Database error during hard deletion" };
  }
}
