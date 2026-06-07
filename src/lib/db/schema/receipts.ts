import { pgTable, varchar, timestamp, text, numeric } from "drizzle-orm/pg-core";
import { invoices } from "./invoices";

export const receipts = pgTable("receipts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  invoiceId: varchar("invoice_id", { length: 255 }).references(() => invoices.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).default("0"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionRef: varchar("transaction_ref", { length: 255 }),
  date: timestamp("date").defaultNow(),
  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;
