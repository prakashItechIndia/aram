import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Website team members (WC-002 – Team & Contact Management).
 * User Stories: name, designation, photo, bio, social links, display order.
 */
export const websiteTeamMembers = mssqlTable('website_team_members', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 255 }).notNull(),
  designation: nvarchar('designation', { length: 128 }),
  photoUrl: nvarchar('photo_url', { length: 512 }),
  bio: nvarchar('bio', { length: 'max' }),
  socialLinksJson: nvarchar('social_links_json', { length: 'max' }),
  displayOrder: int('display_order').default(0),
  isActive: bit('is_active').default(true),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type WebsiteTeamMember = typeof websiteTeamMembers.$inferSelect;
export type NewWebsiteTeamMember = typeof websiteTeamMembers.$inferInsert;
