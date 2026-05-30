import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type ClientInsert = typeof clients.$inferInsert;
export type ClientSelect = typeof clients.$inferSelect;

export const clientsCrud = {
  getAll: async () => {
    return db.query.clients.findMany({
      with: { projects: true, invoices: true },
      orderBy: [desc(clients.createdAt)],
    });
  },

  getById: async (id: string) => {
    return db.query.clients.findFirst({
      where: eq(clients.id, id),
      with: { projects: true, invoices: true },
    });
  },

  create: async (data: ClientInsert) => {
    return db.insert(clients).values(data).returning();
  },

  update: async (id: string, data: Partial<ClientInsert>) => {
    return db
      .update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
  },

  delete: async (id: string) => {
    return db.update(clients).set({ deletedAt: new Date() }).where(eq(clients.id, id));
  },
};
