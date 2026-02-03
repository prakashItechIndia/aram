import { sql } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * 2FA / OTP verification – admin and donor.
 */
export const userOtp = mssqlTable('user_otp', {
  id: int('id').primaryKey().identity(),
  userId: int('user_id'),
  email: nvarchar('email', { length: 255 }),
  phone: nvarchar('phone', { length: 20 }),
  otpCode: nvarchar('otp_code', { length: 10 }).notNull(),
  expiresAt: datetime2('expires_at', { mode: 'string', precision: 3 }).notNull(),
  createdAt: datetime2('created_at', { mode: 'string', precision: 3 }).default(sql`GETDATE()`),
});

export type UserOtp = typeof userOtp.$inferSelect;
export type NewUserOtp = typeof userOtp.$inferInsert;
