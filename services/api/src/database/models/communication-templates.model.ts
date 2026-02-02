import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Email / SMS templates – transactional, marketing, operational.
 */
export const communicationTemplates = mssqlTable('communication_templates', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 128 }).notNull(),
  category: nvarchar('category', { length: 32 }),
  type: nvarchar('type', { length: 16 }).notNull(),
  subject: nvarchar('subject', { length: 255 }),
  bodyContent: nvarchar('body_content', { length: 'max' }),
  variablesJson: nvarchar('variables_json', { length: 'max' }),
  dltTemplateId: nvarchar('dlt_template_id', { length: 64 }),
  isActive: bit('is_active').default(true),
  status: nvarchar('status', { length: 32 }),
  updatedBy: nvarchar('updated_by', { length: 128 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type CommunicationTemplate = typeof communicationTemplates.$inferSelect;
export type NewCommunicationTemplate = typeof communicationTemplates.$inferInsert;
