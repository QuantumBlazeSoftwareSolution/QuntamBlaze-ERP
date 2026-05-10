import { db } from "@/lib/db";
import { projects, projectMilestones } from "@/lib/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";

export type ProjectInsert = typeof projects.$inferInsert;
export type ProjectSelect = typeof projects.$inferSelect;

export const projectsCrud = {
  getAll: async (search?: string) => {
    const query = db.query.projects.findMany({
      with: { client: true, milestones: true },
      orderBy: [desc(projects.createdAt)],
    });
    const data = await query;
    if (search) {
      const lower = search.toLowerCase();
      return data.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.status.toLowerCase().includes(lower) ||
          p.client?.name?.toLowerCase().includes(lower)
      );
    }
    return data;
  },

  getById: async (id: string) => {
    return db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: { client: true, milestones: true, team: { with: { employee: true } } },
    });
  },

  create: async (data: ProjectInsert) => {
    return db.insert(projects).values(data).returning();
  },

  update: async (id: string, data: Partial<ProjectInsert>) => {
    return db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
  },

  delete: async (id: string) => {
    return db
      .update(projects)
      .set({ deletedAt: new Date() })
      .where(eq(projects.id, id));
  },

  getMilestones: async (projectId: string) => {
    return db.query.projectMilestones.findMany({
      where: eq(projectMilestones.projectId, projectId),
    });
  },
};
