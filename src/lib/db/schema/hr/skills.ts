import { pgTable, varchar, timestamp, text, integer, uuid, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { employees } from './employees';

export const skillCategoryEnum = pgEnum('skill_category', [
  'Technical', 'Leadership', 'Soft Skills', 'Operations', 'Strategic', 'Tools'
]);

export const employeeSkills = pgTable('employee_skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: varchar('employee_id').references(() => employees.id).notNull(),
  skillName: varchar('skill_name', { length: 255 }).notNull(),
  category: skillCategoryEnum('category').notNull(),
  level: integer('level').notNull().default(0), // 0 to 100
  targetLevel: integer('target_level').notNull().default(0),
  
  lastAssessedAt: timestamp('last_assessed_at'),
  assessedBy: varchar('assessed_by').references(() => employees.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const certifications = pgTable('certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: varchar('employee_id').references(() => employees.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  issueDate: timestamp('issue_date'),
  expiryDate: timestamp('expiry_date'),
  credentialId: varchar('credential_id', { length: 255 }),
  credentialUrl: text('credential_url'),
  status: varchar('status', { length: 50 }).notNull().default('Active'), // Active, Expired, Expiring Soon
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
