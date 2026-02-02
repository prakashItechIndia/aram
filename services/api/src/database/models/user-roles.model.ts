import { int, nvarchar, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * RBAC – super_admin, admin, finance_manager, etc.
 */
export const userRoles = mssqlTable('user_roles', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 64 }).notNull().unique(),
  description: nvarchar('description', { length: 255 }),
});

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
