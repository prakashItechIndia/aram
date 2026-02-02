import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  decimal,
  date,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';
import { tUser } from './t-user.model';
import { donors } from './donors.model';
import { donationCategories } from './donation-categories.model';

/**
 * Offline donations – E-Challan entry (cash, cheque, DD, bank transfer).
 * Links to T_USER (admin who created), donors, and donation_categories.
 */
export const eChallans = mssqlTable('e_challans', {
  id: int('id').primaryKey().identity(),
  challanNumber: nvarchar('challan_number', { length: 64 }).notNull(),
  donorId: int('donor_id').notNull().references(() => donors.id),
  amount: decimal('amount', { precision: 18, scale: 2 }).notNull(),
  categoryId: int('category_id').references(() => donationCategories.id),
  chequeNumber: nvarchar('cheque_number', { length: 64 }),
  paymentMode: nvarchar('payment_mode', { length: 32 }).notNull(),
  donationDate: date('donation_date').notNull(),
  receiptId: int('receipt_id'),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  createdByUserId: int('created_by_user_id').references(() => tUser.id),
});

export type EChallan = typeof eChallans.$inferSelect;
export type NewEChallan = typeof eChallans.$inferInsert;
