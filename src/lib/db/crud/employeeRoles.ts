import { db } from "@/lib/db";
import { employeeRoles } from "@/lib/db/schema";
import { eq, desc, isNull } from "drizzle-orm";

export type EmployeeRoleInsert = typeof employeeRoles.$inferInsert;
export type EmployeeRoleSelect = typeof employeeRoles.$inferSelect;

const DEFAULT_ROLES = [
  { id: "se", code: "SE", name: "Software Engineer", description: "Design, develop, and maintain software applications and systems.", baseRole: "Dev" },
  { id: "pm", code: "PM", name: "Project Manager", description: "Plan, execute, and close projects, ensuring alignment with organizational goals.", baseRole: "PM" },
  { id: "qa", code: "QA", name: "Quality Assurance", description: "Establish and enforce quality standards, and run rigorous validation pipelines.", baseRole: "QA" },
  { id: "designer", code: "Designer", name: "UI/UX Designer", description: "Create user-centered interface layouts, graphics, and interactive journeys.", baseRole: "UI/UX" },
  { id: "devops", code: "DevOps", name: "DevOps Engineer", description: "Orchestrate continuous delivery automation, infrastructure provisioning, and monitoring.", baseRole: "None" },
  { id: "hr", code: "HR", name: "HR Manager", description: "Oversee employee onboarding, training, career roadmaps, and benefits administration.", baseRole: "None" }
] as const;

export const employeeRolesCrud = {
  getAll: async () => {
    // 1. Fetch active roles (not soft-deleted)
    const data = await db.query.employeeRoles.findMany({
      where: isNull(employeeRoles.deletedAt),
      orderBy: [desc(employeeRoles.createdAt)],
    });

    // 2. If table is empty, auto-seed with standard employee roles
    if (data.length === 0) {
      await db.insert(employeeRoles).values(DEFAULT_ROLES as any);
      return db.query.employeeRoles.findMany({
        where: isNull(employeeRoles.deletedAt),
        orderBy: [desc(employeeRoles.createdAt)],
      });
    }

    // 3. For existing databases, let's make sure the default roles have their baseRole properly updated
    const needsUpdate = data.some(r => 
      (r.code === "SE" && r.baseRole !== "Dev") ||
      (r.code === "PM" && r.baseRole !== "PM") ||
      (r.code === "QA" && r.baseRole !== "QA") ||
      (r.code === "Designer" && r.baseRole !== "UI/UX")
    );
    if (needsUpdate) {
      for (const defaultRole of DEFAULT_ROLES) {
        await db
          .update(employeeRoles)
          .set({ baseRole: defaultRole.baseRole })
          .where(eq(employeeRoles.code, defaultRole.code));
      }
      // Refetch after update
      return db.query.employeeRoles.findMany({
        where: isNull(employeeRoles.deletedAt),
        orderBy: [desc(employeeRoles.createdAt)],
      });
    }

    return data;
  },

  getById: async (id: string) => {
    return db.query.employeeRoles.findFirst({
      where: eq(employeeRoles.id, id),
    });
  },

  create: async (data: EmployeeRoleInsert) => {
    return db.insert(employeeRoles).values(data).returning();
  },

  update: async (id: string, data: Partial<EmployeeRoleInsert>) => {
    return db
      .update(employeeRoles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employeeRoles.id, id))
      .returning();
  },

  delete: async (id: string) => {
    return db
      .update(employeeRoles)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(employeeRoles.id, id));
  },
};
