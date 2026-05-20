import { pgTable, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const systemConfig = pgTable("system_config", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
