import { pgTable, varchar, jsonb } from "drizzle-orm/pg-core";

export const systemConfig = pgTable("system_config", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: jsonb("value").notNull(),
});
