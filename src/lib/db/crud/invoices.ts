import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type InvoiceInsert = typeof invoices.$inferInsert;
export type InvoiceSelect = typeof invoices.$inferSelect;

export const invoicesCrud = {
  getAll: async () => {
    return db.query.invoices.findMany({
      with: { client: true, project: true },
      orderBy: [desc(invoices.createdAt)],
    });
  },

  getById: async (id: string) => {
    return db.query.invoices.findFirst({
      where: eq(invoices.id, id),
      with: { client: true, project: true },
    });
  },

  create: async (data: InvoiceInsert) => {
    return db.insert(invoices).values(data).returning();
  },

  update: async (id: string, data: Partial<InvoiceInsert>) => {
    return db
      .update(invoices)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
  },

  delete: async (id: string) => {
    return db
      .update(invoices)
      .set({ deletedAt: new Date() })
      .where(eq(invoices.id, id));
  },
};
