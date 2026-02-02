import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Per-role menu permissions (Users & Roles screen).
 */
export const rolePermissions = mssqlTable('role_permissions', {
  id: int('id').primaryKey(),
  roleId: int('role_id').notNull(),
  permissionKey: nvarchar('permission_key', { length: 128 }).notNull(),
  canCreate: bit('can_create').notNull().default(false),
  canUpdate: bit('can_update').notNull().default(false),
  canView: bit('can_view').notNull().default(true),
  canDelete: bit('can_delete').notNull().default(false),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
