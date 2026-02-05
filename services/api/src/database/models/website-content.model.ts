import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * CMS (Phase 2) – hero, mission_vision, etc.
 */
export const websiteContent = mssqlTable('website_content', {
  id: int('id').primaryKey().identity(),
  sectionKey: nvarchar('section_key', { length: 64 }).notNull(),
  contentJson: nvarchar('content_json', { length: 'max' }).notNull(),
  version: int('version').default(1),
  publishedAt: datetime2('published_at', { precision: 3 }),
  name: nvarchar('name', { length: 128 }),
  slug: nvarchar('slug', { length: 128 }),
  status: nvarchar('status', { length: 32 }),
  modifiedBy: nvarchar('modified_by', { length: 128 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETUTCDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type WebsiteContent = typeof websiteContent.$inferSelect;
export type NewWebsiteContent = typeof websiteContent.$inferInsert;
