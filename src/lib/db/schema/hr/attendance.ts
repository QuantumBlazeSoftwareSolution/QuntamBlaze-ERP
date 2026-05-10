import { pgTable, varchar, timestamp, text, integer, uuid, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { employees } from './employees';

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'Present', 'Late', 'Absent', 'On Leave', 'Half Day', 'Holiday'
]);

export const attendanceLocationEnum = pgEnum('attendance_location', [
  'Office', 'Remote', 'On-Site', 'Hybrid'
]);

export const attendanceRecords = pgTable('attendance_records', {
  id: varchar('id', { length: 255 }).primaryKey(), // ATT-EMP-ENG-26-001-20260507
  employeeId: varchar('employee_id').references(() => employees.id).notNull(),
  date: timestamp('date').notNull(),
  
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  
  status: attendanceStatusEnum('status').notNull().default('Present'),
  location: attendanceLocationEnum('location').notNull().default('Office'),
  
  ipAddress: varchar('ip_address', { length: 50 }),
  deviceInfo: text('device_info'),
  notes: text('notes'),
  
  isOvertime: boolean('is_overtime').default(false),
  totalHours: integer('total_hours'), // in minutes
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
