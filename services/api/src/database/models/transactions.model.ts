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
 * Payments / donations – gateway, amount, status, receipt link.
 */
export const transactions = mssqlTable('transactions', {
  id: int('id').primaryKey(),
  paymentId: nvarchar('payment_id', { length: 128 }),
  orderId: nvarchar('order_id', { length: 128 }),
  donorId: int('donor_id').notNull(),
  amount: decimal('amount', { precision: 18, scale: 2 }).notNull(),
  gatewayFee: decimal('gateway_fee', { precision: 18, scale: 2 }).default('0'),
  netAmount: decimal('net_amount', { precision: 18, scale: 2 }),
  currency: nvarchar('currency', { length: 3 }).default('INR'),
  status: nvarchar('status', { length: 32 }).notNull(),
  paymentMethod: nvarchar('payment_method', { length: 32 }),
  donationCategoryId: int('donation_category_id'),
  campaignId: int('campaign_id'),
  receiptId: int('receipt_id'),
  gatewayProvider: nvarchar('gateway_provider', { length: 32 }),
  gatewayResponse: nvarchar('gateway_response', { length: 'max' }),
  isRecurring: bit('is_recurring').default(false),
  isOffline: bit('is_offline').default(false),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
