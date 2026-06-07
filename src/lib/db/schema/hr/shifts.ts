import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  uuid,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { departmentEnum } from "./jobs";

export const shiftTypeEnum = pgEnum("shift_type", [
  "Morning",
  "Evening",
  "Night",
  "Rotational",
  "Fixed",
]);

export const shiftSwapStatusEnum = pgEnum("shift_swap_status", [
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
]);

export const shifts = pgTable("shifts", {
  id: varchar("id", { length: 255 }).primaryKey(), // SHF-ENG-26-007
  name: varchar("name", { length: 100 }).notNull(),
  type: shiftTypeEnum("type").notNull().default("Morning"),
  startTime: varchar("start_time", { length: 5 }).notNull(), // "09:00"
  endTime: varchar("end_time", { length: 5 }).notNull(), // "17:00"
  department: departmentEnum("department"),

  gracePeriod: integer("grace_period").default(15), // in minutes
  breakDuration: integer("break_duration").default(60), // in minutes

  isAutoClockOut: boolean("is_auto_clock_out").default(false),
  autoClockOutTime: varchar("auto_clock_out_time", { length: 5 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shiftAssignments = pgTable("shift_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: varchar("employee_id")
    .references(() => employees.id)
    .notNull(),
  shiftId: varchar("shift_id")
    .references(() => shifts.id)
    .notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),

  rotationPattern: text("rotation_pattern"), // "2-2-3", "5-2"
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shiftSwaps = pgTable("shift_swaps", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestingEmployeeId: varchar("requesting_employee_id")
    .references(() => employees.id)
    .notNull(),
  targetEmployeeId: varchar("target_employee_id")
    .references(() => employees.id)
    .notNull(),

  originalShiftAssignmentId: uuid("original_shift_assignment_id")
    .references(() => shiftAssignments.id)
    .notNull(),
  targetShiftAssignmentId: uuid("target_shift_assignment_id")
    .references(() => shiftAssignments.id)
    .notNull(),

  swapDate: timestamp("swap_date").notNull(),
  reason: text("reason"),
  status: shiftSwapStatusEnum("status").default("Pending").notNull(),

  approvedBy: varchar("approved_by").references(() => employees.id),
  approvedAt: timestamp("approved_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Shift = typeof shifts.$inferSelect;
export type InsertShift = typeof shifts.$inferInsert;

export type ShiftAssignment = typeof shiftAssignments.$inferSelect;
export type InsertShiftAssignment = typeof shiftAssignments.$inferInsert;

export type ShiftSwap = typeof shiftSwaps.$inferSelect;
export type InsertShiftSwap = typeof shiftSwaps.$inferInsert;
