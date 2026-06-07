import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { roles } from "./roles";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  avatar: text("avatar"),
  roleId: varchar("role_id", { length: 255 }).references(() => roles.id),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  lastActive: timestamp("last_active"),
  passwordHash: text("password_hash"),

  // Luxury standards
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
