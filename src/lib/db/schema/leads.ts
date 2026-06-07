import { pgTable, varchar, timestamp, text, integer, numeric } from "drizzle-orm/pg-core";
import { users } from "./users";

export const leads = pgTable("leads", {
  id: varchar("id", { length: 255 }).primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 100 }),
  source: varchar("source", { length: 100 }),
  status: varchar("status", { length: 50 }).default("New").notNull(),
  score: integer("score").default(0),
  estimatedValue: numeric("estimated_value", { precision: 12, scale: 2 }).default("0"),
  industry: varchar("industry", { length: 255 }),
  notes: text("notes"),
  assignedTo: varchar("assigned_to", { length: 255 }).references(() => users.id),
  lastContactedAt: timestamp("last_contacted_at"),

  // Luxury standards
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
