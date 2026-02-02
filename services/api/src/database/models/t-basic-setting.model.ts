import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_BASIC_SETTING (app/config settings).
 */
export const tBasicSetting = mssqlTable('T_BASIC_SETTING', {
  id: int('Id').primaryKey(),
  key: nvarchar('Key', { length: 128 }),
  value: nvarchar('Value', { length: 'max' }),
  isActive: bit('Is_Active'),
  updatedDate: datetime2('Updated_Date', { precision: 3 }),
});

export type TBasicSetting = typeof tBasicSetting.$inferSelect;
export type NewTBasicSetting = typeof tBasicSetting.$inferInsert;
