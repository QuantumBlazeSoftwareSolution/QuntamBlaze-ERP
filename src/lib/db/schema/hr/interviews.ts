import { pgTable, varchar, timestamp, text, integer, uuid, pgEnum, primaryKey, jsonb, numeric } from 'drizzle-orm/pg-core';
import { candidates } from './candidates';
import { jobs } from './jobs';
import { employees } from './employees';

export const recommendationEnum = pgEnum('recommendation', [
  'strong_hire', 'hire', 'no_hire', 'strong_no_hire'
]);

export const interviewTypeEnum = pgEnum('interview_type', [
  'phone_screen', 'technical', 'culture_fit', 'final', 'reference_check', 'hr_round'
]);

export const interviewStatusEnum = pgEnum('interview_status', [
  'scheduled', 'completed', 'cancelled', 'no_show'
]);

export const interviews = pgTable('interviews', {
  id: varchar('id').primaryKey(),  // INT-26-047
  candidateId: varchar('candidate_id').references(() => candidates.id).notNull(),
  jobId: varchar('job_id').references(() => jobs.id).notNull(),
  type: interviewTypeEnum('type').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').default(60),
  status: interviewStatusEnum('status').default('scheduled'),
  meetingLink: varchar('meeting_link'),
  location: varchar('location'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by'),
});

export const interviewers = pgTable('interviewers', {
  interviewId: varchar('interview_id').references(() => interviews.id).notNull(),
  employeeId: varchar('employee_id').references(() => employees.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.interviewId, t.employeeId] })
}));

export const scorecards = pgTable('scorecards', {
  id: uuid('id').defaultRandom().primaryKey(),
  interviewId: varchar('interview_id').references(() => interviews.id).notNull(),
  evaluatorId: varchar('evaluator_id').references(() => employees.id).notNull(),
  technicalScore: numeric('technical_score'),    // 0-100 weighted
  behavioralScore: numeric('behavioral_score'),
  roleSpecificScore: numeric('role_specific_score'),
  overallScore: numeric('overall_score'),
  recommendation: recommendationEnum('recommendation'),
  summary: text('summary'),
  privateNotes: text('private_notes'),
  criteriaScores: jsonb('criteria_scores'), // { criterionId: { rating, notes } }
  
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
