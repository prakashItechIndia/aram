import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Automation run history – per execution log.
 */
export const automationRunLogs = mssqlTable('automation_run_logs', {
  id: int('id').primaryKey(),
  ruleId: int('rule_id'),
  eventRef: nvarchar('event_ref', { length: 128 }),
  recipient: nvarchar('recipient', { length: 255 }),
  channel: nvarchar('channel', { length: 32 }),
  status: nvarchar('status', { length: 32 }).notNull(),
  errorMessage: nvarchar('error_message', { length: 'max' }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type AutomationRunLog = typeof automationRunLogs.$inferSelect;
export type NewAutomationRunLog = typeof automationRunLogs.$inferInsert;
