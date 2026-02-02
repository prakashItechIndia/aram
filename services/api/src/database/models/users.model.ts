import { sql } from 'drizzle-orm';
import { int, nvarchar, datetime2, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Admin portal users (auth). role_id → user_roles.
 * After running db:pull, merge any differences from the introspected schema.
 */
export const users = mssqlTable('users', {
  id: int('id').primaryKey(),
  email: nvarchar('email', { length: 255 }).notNull().unique(),
  password: nvarchar('password', { length: 255 }).notNull(),
  name: nvarchar('name', { length: 255 }),
  roleId: int('role_id'),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
