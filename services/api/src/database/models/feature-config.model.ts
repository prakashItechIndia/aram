import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Donation form settings / feature configuration.
 * Admin can enable/disable features; this drives logic, inputs, UI visibility, SMS, email.
 * Store as key-value or JSON; BRD specifies: Form Status, Test Mode, Multi-Country, PAN rules,
 * Address/Mobile required, Preset amounts, Min/Max, Recurring suggestion, etc.
 */
export const featureConfig = mssqlTable('feature_config', {
  id: int('id').primaryKey(),
  key: nvarchar('key', { length: 128 }).notNull().unique(),
  value: nvarchar('value', { length: 'max' }), // JSON or scalar
  isEnabled: bit('is_enabled').default(true),
  updatedAt: datetime2('updated_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedBy: nvarchar('updated_by', { length: 128 }),
});

export type FeatureConfigRow = typeof featureConfig.$inferSelect;
export type NewFeatureConfigRow = typeof featureConfig.$inferInsert;
