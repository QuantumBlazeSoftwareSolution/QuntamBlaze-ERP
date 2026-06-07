import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  uuid,
  pgEnum,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const goalStatusEnum = pgEnum("goal_status", [
  "Not Started",
  "In Progress",
  "Completed",
  "Overdue",
  "Cancelled",
]);

export const reviewCycleStatusEnum = pgEnum("review_cycle_status", [
  "Open",
  "Self-Review",
  "Manager-Review",
  "Closed",
]);

export const performanceGoals = pgTable("performance_goals", {
  id: varchar("id", { length: 255 }).primaryKey(), // PERF-GOAL-2024-001
  employeeId: varchar("employee_id")
    .references(() => employees.id)
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  weightage: integer("weightage").default(1).notNull(), // 1 to 10
  status: goalStatusEnum("status").default("Not Started").notNull(),

  targetDate: timestamp("target_date").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const keyResults = pgTable("key_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  goalId: varchar("goal_id")
    .references(() => performanceGoals.id)
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),
  targetValue: numeric("target_value", { precision: 10, scale: 2 }).notNull(),
  currentValue: numeric("current_value", { precision: 10, scale: 2 }).default("0").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // %, $, count

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviewCycles = pgTable("review_cycles", {
  id: varchar("id", { length: 255 }).primaryKey(), // PERF-REV-2024-ANNUAL
  name: varchar("name", { length: 200 }).notNull(),

  status: reviewCycleStatusEnum("status").default("Open").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PerformanceGoal = typeof performanceGoals.$inferSelect;
export type InsertPerformanceGoal = typeof performanceGoals.$inferInsert;

export type KeyResult = typeof keyResults.$inferSelect;
export type InsertKeyResult = typeof keyResults.$inferInsert;

export type ReviewCycle = typeof reviewCycles.$inferSelect;
export type InsertReviewCycle = typeof reviewCycles.$inferInsert;
