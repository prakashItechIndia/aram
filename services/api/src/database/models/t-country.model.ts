import { int, nvarchar, bit, datetime2, mssqlTable } from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Country.
 */
export const tCountry = mssqlTable('T_Country', {
  id: int('Id').primaryKey(),
  countryName: nvarchar('Country_Name', { length: 128 }),
  countryCode: nvarchar('Country_Code', { length: 10 }),
  countryNumber: nvarchar('Country_Number', { length: 10 }),
  isActive: bit('Is_Active'),
  createdBy: int('Created_By'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
  isDeleted: bit('Is_Deleted'),
  modifiedBy: int('Modified_By'),
  modifiedDate: datetime2('Modified_Date', { precision: 3 }),
});

export type TCountry = typeof tCountry.$inferSelect;
export type NewTCountry = typeof tCountry.$inferInsert;
