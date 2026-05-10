import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type EmployeeInsert = typeof employees.$inferInsert;
export type EmployeeSelect = typeof employees.$inferSelect;

export const employeesCrud = {
  getAll: async (department?: string) => {
    const data = await db.query.employees.findMany({
      orderBy: [desc(employees.createdAt)],
    });
    if (department) {
      return data.filter((e) => e.department === department);
    }
    return data;
  },

  getById: async (id: string) => {
    return db.query.employees.findFirst({
      where: eq(employees.id, id),
    });
  },

  create: async (data: EmployeeInsert) => {
    return db.insert(employees).values(data).returning();
  },

  update: async (id: string, data: Partial<EmployeeInsert>) => {
    return db
      .update(employees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
  },

  delete: async (id: string) => {
    return db
      .update(employees)
      .set({ deletedAt: new Date() })
      .where(eq(employees.id, id));
  },
};
