import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_CFG_ERRORLOG.
 */
export const tCfgErrorlog = mssqlTable('T_CFG_ERRORLOG', {
  id: int('Id').primaryKey(),
  message: nvarchar('Message', { length: 'max' }),
  level: nvarchar('Level', { length: 32 }),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TCfgErrorlog = typeof tCfgErrorlog.$inferSelect;
export type NewTCfgErrorlog = typeof tCfgErrorlog.$inferInsert;
