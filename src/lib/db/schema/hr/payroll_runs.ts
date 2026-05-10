import { pgTable, varchar, timestamp, text, integer, uuid, pgEnum, boolean, numeric, date } from 'drizzle-orm/pg-core';
import { employees } from './employees';
import { salaryStructures } from './payroll_configs';

export const payrollBatchStatusEnum = pgEnum('payroll_batch_status', [
  'Draft', 'Processing', 'Completed', 'Paid'
]);

export const payrollBatches = pgTable('payroll_batches', {
  id: varchar('id', { length: 255 }).primaryKey(), // PAY-RUN-202405
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  
  status: payrollBatchStatusEnum('status').default('Draft').notNull(),
  
  totalGross: numeric('total_gross', { precision: 15, scale: 2 }).default('0'),
  totalNet: numeric('total_net', { precision: 15, scale: 2 }).default('0'),
  totalDeductions: numeric('total_deductions', { precision: 15, scale: 2 }).default('0'),
  
  processedBy: varchar('processed_by').references(() => employees.id),
  processedAt: timestamp('processed_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const payrollItems = pgTable('payroll_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  batchId: varchar('batch_id').references(() => payrollBatches.id).notNull(),
  employeeId: varchar('employee_id').references(() => employees.id).notNull(),
  structureId: varchar('structure_id').references(() => salaryStructures.id),
  
  basicSalary: numeric('basic_salary', { precision: 12, scale: 2 }).notNull(),
  totalAllowances: numeric('total_allowances', { precision: 12, scale: 2 }).default('0'),
  totalDeductions: numeric('total_deductions', { precision: 12, scale: 2 }).default('0'),
  unpaidLeaveDeduction: numeric('unpaid_leave_deduction', { precision: 12, scale: 2 }).default('0'),
  
  netSalary: numeric('net_salary', { precision: 12, scale: 2 }).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
