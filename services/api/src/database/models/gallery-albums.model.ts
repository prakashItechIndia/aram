import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Gallery albums – grouping of gallery images.
 */
export const galleryAlbums = mssqlTable('gallery_albums', {
  id: int('id').primaryKey(),
  name: nvarchar('name', { length: 255 }).notNull(),
  coverImageUrl: nvarchar('cover_image_url', { length: 512 }),
  imageCount: int('image_count').notNull().default(0),
  visibility: nvarchar('visibility', { length: 32 }).notNull().default('Public'),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type NewGalleryAlbum = typeof galleryAlbums.$inferInsert;
