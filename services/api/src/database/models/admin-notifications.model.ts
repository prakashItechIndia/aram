import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Dashboard alerts – error, warning, info.
 */
export const adminNotifications = mssqlTable('admin_notifications', {
  id: int('id').primaryKey(),
  type: nvarchar('type', { length: 32 }).notNull(),
  title: nvarchar('title', { length: 255 }).notNull(),
  message: nvarchar('message', { length: 'max' }),
  readAt: datetime2('read_at', { precision: 3 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type AdminNotification = typeof adminNotifications.$inferSelect;
export type NewAdminNotification = typeof adminNotifications.$inferInsert;
