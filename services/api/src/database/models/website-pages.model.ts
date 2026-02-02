import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Website Content – page list with versioning (Content screen).
 */
export const websitePages = mssqlTable('website_pages', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 128 }).notNull(),
  slug: nvarchar('slug', { length: 128 }).notNull(),
  status: nvarchar('status', { length: 32 }).notNull().default('Draft'),
  lastModified: datetime2('last_modified', { precision: 3 }),
  modifiedBy: nvarchar('modified_by', { length: 128 }),
  version: int('version').notNull().default(1),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type WebsitePage = typeof websitePages.$inferSelect;
export type NewWebsitePage = typeof websitePages.$inferInsert;
