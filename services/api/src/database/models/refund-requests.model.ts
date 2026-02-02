import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  decimal,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Refund requests – approval workflow for >₹10k.
 */
export const refundRequests = mssqlTable('refund_requests', {
  id: int('id').primaryKey(),
  transactionId: int('transaction_id').notNull(),
  amount: decimal('amount', { precision: 18, scale: 2 }).notNull(),
  reason: nvarchar('reason', { length: 'max' }).notNull(),
  status: nvarchar('status', { length: 32 }).notNull(),
  requestedByUserId: int('requested_by_user_id'),
  approvedByUserId: int('approved_by_user_id'),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type RefundRequest = typeof refundRequests.$inferSelect;
export type NewRefundRequest = typeof refundRequests.$inferInsert;
