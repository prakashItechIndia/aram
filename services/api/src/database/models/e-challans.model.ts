import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  decimal,
  date,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Offline donations – E-Challan entry (cash, cheque, DD, bank transfer).
 */
export const eChallans = mssqlTable('e_challans', {
  id: int('id').primaryKey(),
  challanNumber: nvarchar('challan_number', { length: 64 }).notNull(),
  donorId: int('donor_id').notNull(),
  amount: decimal('amount', { precision: 18, scale: 2 }).notNull(),
  categoryId: int('category_id'),
  chequeNumber: nvarchar('cheque_number', { length: 64 }),
  paymentMode: nvarchar('payment_mode', { length: 32 }).notNull(),
  donationDate: date('donation_date').notNull(),
  receiptId: int('receipt_id'),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  createdByUserId: int('created_by_user_id'),
});

export type EChallan = typeof eChallans.$inferSelect;
export type NewEChallan = typeof eChallans.$inferInsert;
