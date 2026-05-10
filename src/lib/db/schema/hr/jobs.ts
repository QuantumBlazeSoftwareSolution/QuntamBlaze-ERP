import { pgTable, varchar, timestamp, text, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { employees } from './employees';

export const departmentEnum = pgEnum('department', [
  'Engineering', 'Finance', 'Design', 'Marketing', 'Operations', 'HR', 'Sales'
]);

export const employmentTypeEnum = pgEnum('employment_type', [
  'Full-Time', 'Part-Time', 'Contract', 'Internship'
]);

export const seniorityEnum = pgEnum('seniority_level', [
  'Junior', 'Mid', 'Senior', 'Lead', 'Director'
]);

export const workLocationEnum = pgEnum('work_location_type', [
  'Remote', 'Hybrid', 'On-Site'
]);

export const jobStatusEnum = pgEnum('job_status', [
  'Active', 'Paused', 'Closed', 'Draft'
]);

export const jobs = pgTable('jobs', {
  id: varchar('id').primaryKey(),  // JOB-ENG-26-012
  title: varchar('title', { length: 200 }).notNull(),
  department: departmentEnum('department').notNull(),
  employmentType: employmentTypeEnum('employment_type').notNull(),
  seniorityLevel: seniorityEnum('seniority_level').notNull(),
  workLocationType: workLocationEnum('work_location_type').notNull(),
  city: varchar('city', { length: 100 }),
  salaryMin: integer('salary_min'), // in cents
  salaryMax: integer('salary_max'), // in cents
  currency: varchar('currency', { length: 3 }).default('USD'),
  openings: integer('openings').default(1),
  description: text('description'),
  requiredSkills: text('required_skills').array(),
  applicationDeadline: timestamp('application_deadline'),
  hiringManagerId: varchar('hiring_manager_id').references(() => employees.id),
  status: jobStatusEnum('status').default('Draft').notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by'),
  deletedAt: timestamp('deleted_at'),
});
