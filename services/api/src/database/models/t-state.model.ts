import { int, nvarchar, bit, datetime2, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_State.
 */
export const tState = mssqlTable('T_State', {
  id: int('Id').primaryKey(),
  name: nvarchar('Name', { length: 128 }),
  countryId: int('Country_Id'),
  isActive: bit('Is_Active'),
  createdBy: int('Created_By'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
  isDeleted: bit('Is_Deleted'),
  modifiedBy: int('Modified_By'),
  modifiedDate: datetime2('Modified_Date', { precision: 3 }),
});

export type TState = typeof tState.$inferSelect;
export type NewTState = typeof tState.$inferInsert;
