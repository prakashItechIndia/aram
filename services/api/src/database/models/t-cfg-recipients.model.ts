import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_CFG_Recipients.
 */
export const tCfgRecipients = mssqlTable('T_CFG_Recipients', {
  id: int('Id').primaryKey(),
  email: nvarchar('Email', { length: 255 }),
  mobile: nvarchar('Mobile', { length: 20 }),
  type: nvarchar('Type', { length: 32 }),
  isActive: bit('Is_Active'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TCfgRecipients = typeof tCfgRecipients.$inferSelect;
export type NewTCfgRecipients = typeof tCfgRecipients.$inferInsert;
