import { pgTable, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";

export const hrActivities = pgTable("hr_activities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 100 }).notNull(), // New Hire, Leave Approved, etc.
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  entities: jsonb("entities"), // Array of entity IDs like ["EMP-001"]
});

export type HRActivity = typeof hrActivities.$inferSelect;
export type InsertHRActivity = typeof hrActivities.$inferInsert;
