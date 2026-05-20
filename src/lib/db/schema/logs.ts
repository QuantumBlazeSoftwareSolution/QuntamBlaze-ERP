import { pgTable, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const systemLog = pgTable("system_log", {
  id: varchar("id", { length: 255 }).primaryKey(), // We can generate a UUID
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 255 }).notNull(),
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
