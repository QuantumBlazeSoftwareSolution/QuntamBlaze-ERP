import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type EmployeeInsert = typeof employees.$inferInsert;
export type EmployeeSelect = typeof employees.$inferSelect;

export const employeesCrud = {
  getAll: async (department?: string) => {
    const data = await db.query.employees.findMany({
      with: {
        department: true,
      },
      orderBy: [desc(employees.createdAt)],
    });
    const mapped = data.map((e: any) => ({
      ...e,
      department: e.department ? e.department.code : "",
    }));
    if (department) {
      return mapped.filter((e) => e.department === department);
    }
    return mapped;
  },

  getById: async (id: string) => {
    const res = await db.query.employees.findFirst({
      where: eq(employees.id, id),
      with: {
        department: true,
      },
    });
    if (!res) return null;
    return {
      ...res,
      department: (res as any).department ? (res as any).department.code : "",
    };
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
    return db.update(employees).set({ deletedAt: new Date() }).where(eq(employees.id, id));
  },
};
