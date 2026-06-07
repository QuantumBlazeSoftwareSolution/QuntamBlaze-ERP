import { pgTable, varchar, timestamp, text, numeric, jsonb } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { clients } from "./clients";

export const invoices = pgTable("invoices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 }).references(() => projects.id),
  clientId: varchar("client_id", { length: 255 }).references(() => clients.id),
  issueDate: timestamp("issue_date"),
  dueDate: timestamp("due_date"),
  amount: numeric("amount", { precision: 12, scale: 2 }).default("0"),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 50 }).default("Draft").notNull(),
  billingAddress: text("billing_address"),
  receiptId: varchar("receipt_id", { length: 255 }),
  lineItems: jsonb("line_items").default("[]").notNull(),

  // Luxury standards
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
