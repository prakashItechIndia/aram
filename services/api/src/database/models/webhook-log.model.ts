import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Gateway webhook event log (Gateway Settings screen).
 */
export const webhookLog = mssqlTable('webhook_log', {
  id: int('id').primaryKey(),
  gateway: nvarchar('gateway', { length: 32 }).notNull(),
  eventType: nvarchar('event_type', { length: 128 }),
  paymentId: nvarchar('payment_id', { length: 128 }),
  status: nvarchar('status', { length: 32 }),
  signatureValid: bit('signature_valid'),
  notes: nvarchar('notes', { length: 'max' }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type WebhookLogEntry = typeof webhookLog.$inferSelect;
export type NewWebhookLogEntry = typeof webhookLog.$inferInsert;
