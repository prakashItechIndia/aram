import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  decimal,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Reconciliation Settings – toggles and thresholds (Payments > Reconciliation).
 */
export const reconciliationSettings = mssqlTable('reconciliation_settings', {
  id: int('id').primaryKey(),
  autoFetchSettlements: bit('auto_fetch_settlements').notNull().default(true),
  autoMatchSettlements: bit('auto_match_settlements').notNull().default(true),
  matchStrategy: nvarchar('match_strategy', { length: 32 }),
  mismatchTolerance: decimal('mismatch_tolerance', { precision: 18, scale: 2 }),
  receiptMissingThreshold: int('receipt_missing_threshold'),
  webhookMissingThreshold: int('webhook_missing_threshold'),
  manualApprovalRequired: bit('manual_approval_required').notNull().default(true),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type ReconciliationSetting = typeof reconciliationSettings.$inferSelect;
export type NewReconciliationSetting = typeof reconciliationSettings.$inferInsert;
