import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Gallery upload Processing Options (Upload Images modal):
 * Auto-resize (thumbnail, medium, large), Convert to WebP, Auto-generate alt text (AI).
 */
export const gallerySettings = mssqlTable('gallery_settings', {
  id: int('id').primaryKey(),
  autoResizeEnabled: bit('auto_resize_enabled').notNull().default(true),
  resizeSizesJson: nvarchar('resize_sizes_json', { length: 'max' }),
  convertToWebpEnabled: bit('convert_to_webp_enabled').notNull().default(true),
  autoGenerateAltTextEnabled: bit('auto_generate_alt_text_enabled').notNull().default(false),
  maxFileSizeMb: int('max_file_size_mb'),
  allowedExtensions: nvarchar('allowed_extensions', { length: 128 }),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type GallerySetting = typeof gallerySettings.$inferSelect;
export type NewGallerySetting = typeof gallerySettings.$inferInsert;
