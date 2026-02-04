import { int, nvarchar, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Country.
 */
export const tCountry = mssqlTable('T_Country', {
  id: int('Id').primaryKey(),
  countryName: nvarchar('Country_Name', { length: 128 }),
  countryCode: nvarchar('Country_Code', { length: 10 }),
  countryNumber: nvarchar('Country_Number', { length: 10 }),
});

export type TCountry = typeof tCountry.$inferSelect;
export type NewTCountry = typeof tCountry.$inferInsert;
