import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';
import { tUser } from './t-user.model';

/**
 * Dashboard alerts – error, warning, info.
 */
export const adminNotifications = mssqlTable('admin_notifications', {
  id: int('id').primaryKey().identity(),
  userId: int('user_id').references(() => tUser.id),
  type: nvarchar('type', { length: 32 }).notNull(),
  title: nvarchar('title', { length: 255 }).notNull(),
  message: nvarchar('message', { length: 'max' }),
  readAt: datetime2('read_at', { precision: 3 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type AdminNotification = typeof adminNotifications.$inferSelect;
export type NewAdminNotification = typeof adminNotifications.$inferInsert;
