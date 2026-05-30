import { pgTable, varchar, timestamp, integer, text } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { employees } from "./hr/employees";

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 })
    .references(() => projects.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("todo").notNull(), // todo, in-progress, review, done
  priority: varchar("priority", { length: 20 }).default("medium").notNull(), // low, medium, high
  dueDate: timestamp("due_date"),
  assigneeId: varchar("assignee_id", { length: 255 }).references(() => employees.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
