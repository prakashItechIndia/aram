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
 * Unified receipt engine – ARAM/YYYY-YY/XXXXX, online + e-challan types.
 */
export const receipts = mssqlTable('receipts', {
  id: int('id').primaryKey(),
  receiptNumber: nvarchar('receipt_number', { length: 64 }).notNull().unique(),
  transactionId: int('transaction_id'),
  donorId: int('donor_id').notNull(),
  amount: decimal('amount', { precision: 18, scale: 2 }).notNull(),
  categoryId: int('category_id'),
  receiptType: nvarchar('receipt_type', { length: 32 }).notNull(),
  financialYear: nvarchar('financial_year', { length: 16 }),
  pdfPath: nvarchar('pdf_path', { length: 512 }),
  is80g: bit('is_80g').default(true),
  generatedAt: datetime2('generated_at', { precision: 3 }).default(sql`GETDATE()`),
  templateVersion: nvarchar('template_version', { length: 32 }),
  generatedBy: nvarchar('generated_by', { length: 128 }),
  deliveryStatusEmail: nvarchar('delivery_status_email', { length: 32 }),
  deliveryStatusSms: nvarchar('delivery_status_sms', { length: 32 }),
  status: nvarchar('status', { length: 32 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type Receipt = typeof receipts.$inferSelect;
export type NewReceipt = typeof receipts.$inferInsert;
