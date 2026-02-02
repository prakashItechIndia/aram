import { int, nvarchar, bit, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_ROLES_PRIVILEGE (role-permission mapping).
 */
export const tRolesPrivilege = mssqlTable('T_ROLES_PRIVILEGE', {
  id: int('Id').primaryKey(),
  roleId: int('Role_Id'),
  privilegeKey: nvarchar('Privilege_Key', { length: 64 }),
  isAllowed: bit('Is_Allowed'),
});

export type TRolesPrivilege = typeof tRolesPrivilege.$inferSelect;
export type NewTRolesPrivilege = typeof tRolesPrivilege.$inferInsert;
