import { pgTable, varchar, timestamp, text, boolean, jsonb } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 50 }).default("#10B981"),
  isSystem: boolean("is_system").default(false).notNull(),
  permissions: jsonb("permissions").default("{}").notNull(),

  // Luxury standards
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
