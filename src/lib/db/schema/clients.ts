import { pgTable, varchar, timestamp, text, numeric } from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 255 }),
  billingAddress: text("billing_address"),
  paymentTerms: varchar("payment_terms", { length: 100 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 100 }),
  totalBilled: numeric("total_billed", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
