import {
  int,
  nvarchar,
  decimal,
  date,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_EChallan (offline donations).
 */
export const tEChallan = mssqlTable('T_EChallan', {
  id: int('Id').primaryKey(),
  challanNumber: nvarchar('Challan_Number', { length: 64 }),
  donorId: int('Donor_Id'),
  amount: decimal('Amount', { precision: 18, scale: 2 }),
  categoryId: int('Category_Id'),
  paymentMode: nvarchar('Payment_Mode', { length: 32 }),
  chequeNumber: nvarchar('Cheque_Number', { length: 64 }),
  donationDate: date('Donation_Date'),
  receiptId: int('Receipt_Id'),
  createdBy: int('Created_By'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TEChallan = typeof tEChallan.$inferSelect;
export type NewTEChallan = typeof tEChallan.$inferInsert;
