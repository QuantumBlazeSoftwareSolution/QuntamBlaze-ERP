import { pgTable, varchar, timestamp, text, integer, pgEnum } from 'drizzle-orm/pg-core';
import { jobs } from './jobs';
import { employees } from './employees';

export const pipelineStageEnum = pgEnum('pipeline_stage', [
  'Applied', 'Screening', 'Technical', 'Final', 'Offer', 'Hired', 'Rejected', 'Withdrawn'
]);

export const candidateSourceEnum = pgEnum('candidate_source', [
  'LinkedIn', 'Referral', 'Website', 'Agency', 'Direct', 'Job Board'
]);

export const candidates = pgTable('candidates', {
  id: varchar('id').primaryKey(),  // CND-26-089
  jobId: varchar('job_id').references(() => jobs.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  linkedinUrl: varchar('linkedin_url', { length: 255 }),
  resumeUrl: varchar('resume_url', { length: 255 }),
  source: candidateSourceEnum('source').notNull(),
  currentStage: pipelineStageEnum('current_stage').default('Applied').notNull(),
  referredBy: varchar('referred_by').references(() => employees.id),
  notes: text('notes'),
  expectedSalary: integer('expected_salary'), // in cents
  noticePeriodDays: integer('notice_period_days'),
  assignedToId: varchar('assigned_to_id').references(() => employees.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by'),
  deletedAt: timestamp('deleted_at'),
});
