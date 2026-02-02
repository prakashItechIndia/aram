import {
  int,
  nvarchar,
  decimal,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Payment_Transaction.
 */
export const tPaymentTransaction = mssqlTable('T_Payment_Transaction', {
  id: int('Id').primaryKey(),
  paymentId: nvarchar('Payment_Id', { length: 128 }),
  orderId: nvarchar('Order_Id', { length: 128 }),
  donorId: int('Donor_Id'),
  amount: decimal('Amount', { precision: 18, scale: 2 }),
  gatewayFee: decimal('Gateway_Fee', { precision: 18, scale: 2 }),
  netAmount: decimal('Net_Amount', { precision: 18, scale: 2 }),
  currency: nvarchar('Currency', { length: 3 }),
  status: nvarchar('Status', { length: 32 }),
  paymentMethod: nvarchar('Payment_Method', { length: 32 }),
  categoryId: int('Category_Id'),
  receiptId: int('Receipt_Id'),
  gatewayProvider: nvarchar('Gateway_Provider', { length: 32 }),
  isOffline: bit('Is_Offline'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TPaymentTransaction = typeof tPaymentTransaction.$inferSelect;
export type NewTPaymentTransaction = typeof tPaymentTransaction.$inferInsert;
