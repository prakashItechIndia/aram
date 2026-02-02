import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Enquiry Configuration – SLA, auto-assignment, spam (Communications > Enquiries > Configure).
 */
export const enquirySettings = mssqlTable('enquiry_settings', {
  id: int('id').primaryKey(),
  defaultSlaHours: int('default_sla_hours'),
  warningBeforeBreachHours: int('warning_before_breach_hours'),
  autoAssignmentEnabled: bit('auto_assignment_enabled').notNull().default(false),
  assignmentMethod: nvarchar('assignment_method', { length: 32 }),
  autoDetectSpam: bit('auto_detect_spam').notNull().default(false),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type EnquirySetting = typeof enquirySettings.$inferSelect;
export type NewEnquirySetting = typeof enquirySettings.$inferInsert;
