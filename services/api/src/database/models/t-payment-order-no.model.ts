import { int, nvarchar, datetime2, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Payment_Order_No (order number sequence).
 */
export const tPaymentOrderNo = mssqlTable('T_Payment_Order_No', {
  id: int('Id').primaryKey(),
  orderNo: nvarchar('Order_No', { length: 64 }),
  financialYear: nvarchar('Financial_Year', { length: 16 }),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TPaymentOrderNo = typeof tPaymentOrderNo.$inferSelect;
export type NewTPaymentOrderNo = typeof tPaymentOrderNo.$inferInsert;
