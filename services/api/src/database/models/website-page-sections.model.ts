import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Website page sections – Hero, Mission, Stats, etc. per page.
 */
export const websitePageSections = mssqlTable('website_page_sections', {
  id: int('id').primaryKey(),
  pageId: int('page_id').notNull(),
  sectionKey: nvarchar('section_key', { length: 64 }).notNull(),
  sectionName: nvarchar('section_name', { length: 128 }),
  sectionConfigJson: nvarchar('section_config_json', { length: 'max' }),
  enabled: bit('enabled').notNull().default(true),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type WebsitePageSection = typeof websitePageSections.$inferSelect;
export type NewWebsitePageSection = typeof websitePageSections.$inferInsert;
