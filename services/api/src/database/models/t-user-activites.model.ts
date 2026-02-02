import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_User_Activites (audit / user activity).
 */
export const tUserActivites = mssqlTable('T_User_Activites', {
  id: int('Id').primaryKey(),
  userId: int('User_Id'),
  action: nvarchar('Action', { length: 64 }),
  entityType: nvarchar('Entity_Type', { length: 64 }),
  entityId: nvarchar('Entity_Id', { length: 64 }),
  details: nvarchar('Details', { length: 'max' }),
  ipAddress: nvarchar('Ip_Address', { length: 45 }),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TUserActivites = typeof tUserActivites.$inferSelect;
export type NewTUserActivites = typeof tUserActivites.$inferInsert;
