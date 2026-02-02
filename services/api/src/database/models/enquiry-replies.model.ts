import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Enquiry reply thread – replies to enquiries.
 */
export const enquiryReplies = mssqlTable('enquiry_replies', {
  id: int('id').primaryKey(),
  enquiryId: int('enquiry_id').notNull(),
  fromUserId: int('from_user_id'),
  body: nvarchar('body', { length: 'max' }).notNull(),
  isInternal: bit('is_internal').notNull().default(false),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
});

export type EnquiryReply = typeof enquiryReplies.$inferSelect;
export type NewEnquiryReply = typeof enquiryReplies.$inferInsert;
