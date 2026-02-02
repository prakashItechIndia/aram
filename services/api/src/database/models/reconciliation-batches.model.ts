import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Payments reconciliation – gateway settlement batches.
 */
export const reconciliationBatches = mssqlTable('reconciliation_batches', {
  id: int('id').primaryKey(),
  gatewayProvider: nvarchar('gateway_provider', { length: 32 }).notNull(),
  periodStart: datetime2('period_start', { precision: 3 }).notNull(),
  periodEnd: datetime2('period_end', { precision: 3 }).notNull(),
  status: nvarchar('status', { length: 32 }).notNull(),
  matchedCount: int('matched_count').default(0),
  mismatchCount: int('mismatch_count').default(0),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type ReconciliationBatch = typeof reconciliationBatches.$inferSelect;
export type NewReconciliationBatch = typeof reconciliationBatches.$inferInsert;
