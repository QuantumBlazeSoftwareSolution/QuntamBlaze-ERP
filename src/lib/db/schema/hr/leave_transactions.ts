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
  date,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { leaveTypes } from "./leave";

export const leaveRequestStatusEnum = pgEnum("leave_request_status", [
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
]);

export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id", { length: 255 }).primaryKey(), // LEV-EMP-ENG-26-001-014
  employeeId: varchar("employee_id")
    .references(() => employees.id)
    .notNull(),
  leaveTypeId: varchar("leave_type_id")
    .references(() => leaveTypes.id)
    .notNull(),

  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: numeric("total_days", { precision: 5, scale: 2 }).notNull(),

  reason: text("reason").notNull(),
  status: leaveRequestStatusEnum("status").default("Pending").notNull(),

  attachmentUrl: text("attachment_url"),

  approvedBy: varchar("approved_by").references(() => employees.id),
  approvedAt: timestamp("approved_at"),
  comments: text("comments"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leaveBalances = pgTable("leave_balances", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: varchar("employee_id")
    .references(() => employees.id)
    .notNull(),
  leaveTypeId: varchar("leave_type_id")
    .references(() => leaveTypes.id)
    .notNull(),
  year: integer("year").notNull(),

  entitled: numeric("entitled", { precision: 5, scale: 2 }).notNull().default("0"),
  accrued: numeric("accrued", { precision: 5, scale: 2 }).notNull().default("0"),
  taken: numeric("taken", { precision: 5, scale: 2 }).notNull().default("0"),
  remaining: numeric("remaining", { precision: 5, scale: 2 }).notNull().default("0"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = typeof leaveRequests.$inferInsert;

export type LeaveBalance = typeof leaveBalances.$inferSelect;
export type InsertLeaveBalance = typeof leaveBalances.$inferInsert;
