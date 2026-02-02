import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Payment gateway config – Razorpay, Paytm, PayU (test/live).
 */
export const paymentGatewaySettings = mssqlTable('payment_gateway_settings', {
  id: int('id').primaryKey(),
  provider: nvarchar('provider', { length: 32 }).notNull(),
  environment: nvarchar('environment', { length: 16 }).notNull(),
  apiKeyEncrypted: nvarchar('api_key_encrypted', { length: 'max' }),
  apiSecretEncrypted: nvarchar('api_secret_encrypted', { length: 'max' }),
  webhookSecret: nvarchar('webhook_secret', { length: 255 }),
  merchantId: nvarchar('merchant_id', { length: 128 }),
  gatewayFeeConfig: nvarchar('gateway_fee_config', { length: 'max' }),
  retryPolicy: nvarchar('retry_policy', { length: 'max' }),
  isActive: bit('is_active').default(true),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type PaymentGatewaySetting = typeof paymentGatewaySettings.$inferSelect;
export type NewPaymentGatewaySetting = typeof paymentGatewaySettings.$inferInsert;
