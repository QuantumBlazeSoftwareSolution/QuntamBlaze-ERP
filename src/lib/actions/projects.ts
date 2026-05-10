"use server";

import { db } from "@/lib/db";
import { projects, projectMilestones } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const data = await db.query.projects.findMany({
      with: {
        client: true,
      },
      orderBy: [desc(projects.createdAt)],
    });
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const data = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        client: true,
        milestones: true,
      },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}
