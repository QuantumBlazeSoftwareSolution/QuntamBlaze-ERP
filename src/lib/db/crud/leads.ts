import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type LeadInsert = typeof leads.$inferInsert;
export type LeadSelect = typeof leads.$inferSelect;

export const leadsCrud = {
  getAll: async () => {
    return db.query.leads.findMany({
      orderBy: [desc(leads.createdAt)],
    });
  },

  getById: async (id: string) => {
    return db.query.leads.findFirst({
      where: eq(leads.id, id),
    });
  },

  create: async (data: LeadInsert) => {
    return db.insert(leads).values(data).returning();
  },

  update: async (id: string, data: Partial<LeadInsert>) => {
    return db
      .update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
  },

  delete: async (id: string) => {
    return db.update(leads).set({ deletedAt: new Date() }).where(eq(leads.id, id));
  },
};
