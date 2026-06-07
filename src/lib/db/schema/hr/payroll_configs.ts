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

export const calculationTypeEnum = pgEnum("calculation_type", ["Fixed", "Percentage"]);

export const salaryStructures = pgTable("salary_structures", {
  id: varchar("id", { length: 255 }).primaryKey(), // PAY-STR-ENG-01
  name: varchar("name", { length: 200 }).notNull(),
  grade: varchar("grade", { length: 50 }).notNull(), // Senior, Junior, Lead

  baseSalary: numeric("base_salary", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("LKR").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const allowanceTypes = pgTable("allowance_types", {
  id: varchar("id", { length: 255 }).primaryKey(), // ALW-001
  name: varchar("name", { length: 100 }).notNull(), // Housing, Transport
  calculationType: calculationTypeEnum("calculation_type").default("Fixed").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),

  isTaxable: boolean("is_taxable").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const structureAllowances = pgTable("structure_allowances", {
  id: uuid("id").defaultRandom().primaryKey(),
  structureId: varchar("structure_id")
    .references(() => salaryStructures.id)
    .notNull(),
  allowanceTypeId: varchar("allowance_type_id")
    .references(() => allowanceTypes.id)
    .notNull(),
});

export const statutoryRules = pgTable("statutory_rules", {
  id: varchar("id", { length: 255 }).primaryKey(), // STAT-SL-24
  name: varchar("name", { length: 100 }).notNull(), // EPF, ETF

  employeeContribution: numeric("employee_contribution", { precision: 5, scale: 2 }).notNull(), // 8%
  employerContribution: numeric("employer_contribution", { precision: 5, scale: 2 }).notNull(), // 12%

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SalaryStructure = typeof salaryStructures.$inferSelect;
export type InsertSalaryStructure = typeof salaryStructures.$inferInsert;

export type AllowanceType = typeof allowanceTypes.$inferSelect;
export type InsertAllowanceType = typeof allowanceTypes.$inferInsert;

export type StructureAllowance = typeof structureAllowances.$inferSelect;
export type InsertStructureAllowance = typeof structureAllowances.$inferInsert;

export type StatutoryRule = typeof statutoryRules.$inferSelect;
export type InsertStatutoryRule = typeof statutoryRules.$inferInsert;
