import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_Payment_Gateway_Config.
 */
export const tPaymentGatewayConfig = mssqlTable('T_Payment_Gateway_Config', {
  id: int('Id').primaryKey(),
  provider: nvarchar('Provider', { length: 32 }),
  environment: nvarchar('Environment', { length: 16 }),
  apiKey: nvarchar('Api_Key', { length: 255 }),
  apiSecret: nvarchar('Api_Secret', { length: 255 }),
  webhookSecret: nvarchar('Webhook_Secret', { length: 255 }),
  merchantId: nvarchar('Merchant_Id', { length: 128 }),
  isActive: bit('Is_Active'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
});

export type TPaymentGatewayConfig = typeof tPaymentGatewayConfig.$inferSelect;
export type NewTPaymentGatewayConfig = typeof tPaymentGatewayConfig.$inferInsert;
