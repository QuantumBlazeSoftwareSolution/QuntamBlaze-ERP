import { eq, isNull, and } from "drizzle-orm";
import { db } from "../../index";
import { projects } from "../../schema";

export async function getAllProjects() {
  try {
    const data = await db.select().from(projects).where(isNull(projects.deletedAt));
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProjectById(id: string) {
  try {
    const data = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .limit(1);

    if (data.length === 0) return { success: false, error: "Project not found" };
    return { success: true, data: data[0] };
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    return { success: false, error: "Failed to fetch project" };
  }
}
