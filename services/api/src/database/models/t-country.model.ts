import { int, nvarchar, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Country.
 */
export const tCountry = mssqlTable('T_Country', {
  id: int('Id').primaryKey(),
  name: nvarchar('Name', { length: 128 }),
  code: nvarchar('Code', { length: 10 }),
});

export type TCountry = typeof tCountry.$inferSelect;
export type NewTCountry = typeof tCountry.$inferInsert;
