import { pgTable, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const personalTasks = pgTable("personal_tasks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  checklist: jsonb("checklist").default([]).notNull(), // Array of { id: string; text: string; completed: boolean }
  dueDate: timestamp("due_date"),
  priority: varchar("priority", { length: 20 }).default("Medium").notNull(), // Low, Medium, High
  status: varchar("status", { length: 50 }).default("Todo").notNull(), // Todo, In Progress, Completed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
