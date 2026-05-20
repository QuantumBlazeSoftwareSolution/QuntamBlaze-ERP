import { pgTable, varchar, timestamp, text, jsonb, integer } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: varchar("id", { length: 255 }).primaryKey(),
  // Skeleton for now, to be expanded in Task 32
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  name: varchar("name", { length: 255 }).notNull(), // Full name for quick access
  role: varchar("role", { length: 255 }),
  employeeRole: varchar("employee_role", { length: 50 }).default("SE").notNull(),
  department: varchar("department", { length: 100 }),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  joinDate: timestamp("join_date"),
  avatar: varchar("avatar", { length: 500 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  nic: varchar("nic", { length: 20 }),
  bankDetails: jsonb("bank_details"),
  reportingToId: varchar("reporting_to_id", { length: 255 }).references((): any => employees.id),
  profileHealth: integer("profile_health").default(0),
  birthDate: timestamp("birth_date"),
  probationEnd: timestamp("probation_end"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
