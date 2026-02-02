import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Razorpay_Transaction (gateway-specific payload).
 */
export const tRazorpayTransaction = mssqlTable('T_Razorpay_Transaction', {
  id: int('Id').primaryKey(),
  paymentTransactionId: int('Payment_Transaction_Id'),
  razorpayPaymentId: nvarchar('Razorpay_Payment_Id', { length: 128 }),
  razorpayOrderId: nvarchar('Razorpay_Order_Id', { length: 128 }),
  rawResponse: nvarchar('Raw_Response', { length: 'max' }),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TRazorpayTransaction = typeof tRazorpayTransaction.$inferSelect;
export type NewTRazorpayTransaction = typeof tRazorpayTransaction.$inferInsert;
