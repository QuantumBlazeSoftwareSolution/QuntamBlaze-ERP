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

export const leaveAccrualFrequencyEnum = pgEnum("leave_accrual_frequency", [
  "Monthly",
  "Quarterly",
  "Yearly",
  "One-Time",
]);

export const leaveTypes = pgTable("leave_types", {
  id: varchar("id", { length: 255 }).primaryKey(), // LVT-001
  name: varchar("name", { length: 100 }).notNull(), // Annual, Sick, Casual
  description: text("description"),
  colorCode: varchar("color_code", { length: 50 }).default("#3B82F6"),

  isPaid: boolean("is_paid").default(true),
  requiresAttachment: boolean("requires_attachment").default(false),
  minNoticeDays: integer("min_notice_days").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leavePolicies = pgTable("leave_policies", {
  id: varchar("id", { length: 255 }).primaryKey(), // POL-ENG-ANN-24
  name: varchar("name", { length: 200 }).notNull(),
  leaveTypeId: varchar("leave_type_id")
    .references(() => leaveTypes.id)
    .notNull(),

  annualEntitlement: numeric("annual_entitlement", { precision: 5, scale: 2 }).notNull(), // e.g. 21.00
  accrualFrequency: leaveAccrualFrequencyEnum("accrual_frequency").default("Yearly").notNull(),

  maxCarryForward: numeric("max_carry_forward", { precision: 5, scale: 2 }).default("0"),
  canApplyInProbation: boolean("can_apply_in_probation").default(false),

  isProrated: boolean("is_prorated").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
