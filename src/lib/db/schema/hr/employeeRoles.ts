import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const employeeRoles = pgTable("employee_roles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(), // e.g. "SE", "PM", "QA", "Designer", "DevOps", "HR"
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  baseRole: varchar("base_role", { length: 50 }).default("None").notNull(),
});
