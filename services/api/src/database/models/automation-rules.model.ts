import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  decimal,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Communication Automation – rules (trigger + actions + schedule).
 */
export const automationRules = mssqlTable('automation_rules', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 255 }).notNull(),
  triggerType: nvarchar('trigger_type', { length: 64 }).notNull(),
  triggerFiltersJson: nvarchar('trigger_filters_json', { length: 'max' }),
  actionsJson: nvarchar('actions_json', { length: 'max' }).notNull(),
  category: nvarchar('category', { length: 32 }),
  priority: nvarchar('priority', { length: 16 }),
  status: nvarchar('status', { length: 32 }).notNull().default('Enabled'),
  scheduleType: nvarchar('schedule_type', { length: 32 }),
  scheduleConfigJson: nvarchar('schedule_config_json', { length: 'max' }),
  lastRunAt: datetime2('last_run_at', { precision: 3 }),
  nextRunAt: datetime2('next_run_at', { precision: 3 }),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type AutomationRule = typeof automationRules.$inferSelect;
export type NewAutomationRule = typeof automationRules.$inferInsert;
