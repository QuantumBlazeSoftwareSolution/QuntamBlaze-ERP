import { pgTable, varchar, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const projects = pgTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  clientId: varchar("client_id", { length: 255 }).references(() => clients.id),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline"),
  progress: integer("progress").default(0),
  budget: numeric("budget", { precision: 12, scale: 2 }).default("0"),
  status: varchar("status", { length: 50 }).default("Draft").notNull(),

  // Luxury standards
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
