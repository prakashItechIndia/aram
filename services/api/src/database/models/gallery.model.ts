import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Website gallery (Phase 3) – images, albums.
 */
export const gallery = mssqlTable('gallery', {
  id: int('id').primaryKey().identity(),
  title: nvarchar('title', { length: 255 }).notNull(),
  description: nvarchar('description', { length: 'max' }),
  altText: nvarchar('alt_text', { length: 255 }),
  imagePath: nvarchar('image_path', { length: 512 }).notNull(),
  albumId: int('album_id'),
  tagsJson: nvarchar('tags_json', { length: 'max' }),
  sortOrder: int('sort_order').default(0),
  caption: nvarchar('caption', { length: 'max' }),
  photographer: nvarchar('photographer', { length: 128 }),
  visibility: nvarchar('visibility', { length: 32 }).notNull().default('Public'),
  fileSize: nvarchar('file_size', { length: 32 }),
  thumbnailPath: nvarchar('thumbnail_path', { length: 512 }),
  uploadedBy: nvarchar('uploaded_by', { length: 128 }),
  uploadedAt: datetime2('uploaded_at', { precision: 3 }),
  altTextGeneratedByAi: bit('alt_text_generated_by_ai').notNull().default(false),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type GalleryItem = typeof gallery.$inferSelect;
export type NewGalleryItem = typeof gallery.$inferInsert;
