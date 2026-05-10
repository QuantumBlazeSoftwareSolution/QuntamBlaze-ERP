import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const idConfig = pgTable("id_config", {
  id: varchar("id", { length: 255 }).primaryKey(), // prefix like 'PRJ', 'CLI', 'TSK'
  prefix: varchar("prefix", { length: 50 }).notNull(),
  lastSequence: integer("last_sequence").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
