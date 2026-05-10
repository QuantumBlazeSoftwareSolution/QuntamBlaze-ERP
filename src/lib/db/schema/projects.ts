import { pgTable, varchar, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { employees } from "./hr/employees";

export const projects = pgTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  clientId: varchar("client_id", { length: 255 }).references(() => clients.id),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline"),
  progress: integer("progress").default(0),
  budget: numeric("budget", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 50 }).default("Draft").notNull(),
  description: varchar("description", { length: 2000 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const projectMilestones = pgTable("project_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 })
    .references(() => projects.id)
    .notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  subLabel: varchar("sub_label", { length: 255 }),
  state: varchar("state", { length: 50 }).default("upcoming").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectTeam = pgTable("project_team", {
  projectId: varchar("project_id", { length: 255 })
    .references(() => projects.id)
    .notNull(),
  employeeId: varchar("employee_id", { length: 255 })
    .references(() => employees.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
