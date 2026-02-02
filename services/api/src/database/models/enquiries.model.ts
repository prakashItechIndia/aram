import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Contact form / Communications inbox – enquiries.
 */
export const enquiries = mssqlTable('enquiries', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 255 }).notNull(),
  email: nvarchar('email', { length: 255 }).notNull(),
  organization: nvarchar('organization', { length: 255 }),
  subject: nvarchar('subject', { length: 255 }),
  message: nvarchar('message', { length: 'max' }),
  status: nvarchar('status', { length: 32 }).notNull(),
  assignedToUserId: int('assigned_to_user_id'),
  category: nvarchar('category', { length: 64 }),
  slaDeadline: datetime2('sla_deadline', { precision: 3 }),
  hasAttachment: bit('has_attachment').notNull().default(false),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
