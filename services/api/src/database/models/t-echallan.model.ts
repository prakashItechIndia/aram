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
import { tDonorCategories } from './t-donor-categories.model';

/**
 * LEGACY DB table: T_EChallan (offline donations).
 * Links to:
 * - T_USER via Created_By (admin who created the e-challan)
 * - donors via Donor_Id (the donor who made the donation)
 * - T_DONOR_CATEGORIES via Category_Id (legacy donation category)
 */
export const tEChallan = mssqlTable('T_EChallan', {
  id: int('Id').primaryKey().identity(),
  challanNumber: nvarchar('Challan_Number', { length: 64 }),
  donorId: int('Donor_Id').references(() => donors.id),
  amount: decimal('Amount', { precision: 18, scale: 2 }),
  categoryId: int('Category_Id').references(() => tDonorCategories.id),
  paymentMode: nvarchar('Payment_Mode', { length: 32 }),
  chequeNumber: nvarchar('Cheque_Number', { length: 64 }),
  donationDate: date('Donation_Date'),
  receiptId: int('Receipt_Id'),
  createdBy: int('Created_By').references(() => tUser.id),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TEChallan = typeof tEChallan.$inferSelect;
export type NewTEChallan = typeof tEChallan.$inferInsert;
