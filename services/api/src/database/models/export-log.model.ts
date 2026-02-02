import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Report export audit – who exported what, when, IP.
 */
export const exportLog = mssqlTable('export_log', {
  id: int('id').primaryKey(),
  userId: int('user_id'),
  reportType: nvarchar('report_type', { length: 64 }),
  format: nvarchar('format', { length: 16 }),
  ipAddress: nvarchar('ip_address', { length: 45 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type ExportLogEntry = typeof exportLog.$inferSelect;
export type NewExportLogEntry = typeof exportLog.$inferInsert;
