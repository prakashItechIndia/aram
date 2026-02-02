import { int, nvarchar, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_State.
 */
export const tState = mssqlTable('T_State', {
  id: int('Id').primaryKey(),
  name: nvarchar('Name', { length: 128 }),
  countryId: int('Country_Id'),
});

export type TState = typeof tState.$inferSelect;
export type NewTState = typeof tState.$inferInsert;
