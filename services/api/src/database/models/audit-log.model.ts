import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * User activity – Super Admin / compliance.
 */
export const auditLog = mssqlTable('audit_log', {
  id: int('id').primaryKey(),
  userId: int('user_id'),
  action: nvarchar('action', { length: 64 }).notNull(),
  entityType: nvarchar('entity_type', { length: 64 }),
  entityId: nvarchar('entity_id', { length: 64 }),
  detailsJson: nvarchar('details_json', { length: 'max' }),
  ipAddress: nvarchar('ip_address', { length: 45 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;
