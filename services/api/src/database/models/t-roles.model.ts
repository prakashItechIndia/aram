import { int, nvarchar, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_ROLES (RBAC).
 * Follows existing format: T_ prefix, PascalCase_Underscore columns.
 */
export const tRoles = mssqlTable('T_ROLES', {
  id: int('Id').primaryKey(),
  name: nvarchar('Name', { length: 100 }),
  description: nvarchar('Description', { length: 255 }),
});

export type TRole = typeof tRoles.$inferSelect;
export type NewTRole = typeof tRoles.$inferInsert;
