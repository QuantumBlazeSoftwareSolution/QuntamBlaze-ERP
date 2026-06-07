import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const departments = pgTable("departments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  code: varchar("code", { length: 50 }).notNull().unique(), // e.g. "ENGINEERING", "HR", "FINANCE"
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
