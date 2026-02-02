import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Admin > Donors > Donor Profile Drawer > Notes tab (ARAM admin.md §5.4.3).
 */
export const donorNotes = mssqlTable('donor_notes', {
  id: int('id').primaryKey(),
  donorId: int('donor_id').notNull(),
  createdByUserId: int('created_by_user_id'),
  noteText: nvarchar('note_text', { length: 'max' }).notNull(),
  createdAt: datetime2('created_at', { precision: 3 }).default(sql`GETDATE()`),
  updatedAt: datetime2('updated_at', { precision: 3 }),
});

export type DonorNote = typeof donorNotes.$inferSelect;
export type NewDonorNote = typeof donorNotes.$inferInsert;
