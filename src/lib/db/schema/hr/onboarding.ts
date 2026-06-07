import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  uuid,
  pgEnum,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "pre_arrival",
  "day_1",
  "week_1",
  "month_1",
  "month_2",
  "month_3",
  "completed",
]);

export const taskCategoryEnum = pgEnum("onboarding_task_category", [
  "IT",
  "HR",
  "Finance",
  "Team",
  "Training",
  "Operations",
]);

export const onboardingPlans = pgTable("onboarding_plans", {
  id: varchar("id").primaryKey(), // ONB-EMP-ENG-26-001-01
  employeeId: varchar("employee_id")
    .references(() => employees.id)
    .notNull(),
  status: onboardingStatusEnum("status").default("pre_arrival").notNull(),
  startDate: timestamp("start_date").notNull(),
  completionRate: integer("completion_rate").default(0),
  mentorId: varchar("mentor_id").references(() => employees.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by"),
});

export const onboardingTasks = pgTable("onboarding_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  planId: varchar("plan_id")
    .references(() => onboardingPlans.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: taskCategoryEnum("category").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"),
  ownerId: varchar("owner_id").references(() => employees.id), // e.g. IT manager for "Laptop Setup"

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OnboardingPlan = typeof onboardingPlans.$inferSelect;
export type InsertOnboardingPlan = typeof onboardingPlans.$inferInsert;

export type OnboardingTask = typeof onboardingTasks.$inferSelect;
export type InsertOnboardingTask = typeof onboardingTasks.$inferInsert;
