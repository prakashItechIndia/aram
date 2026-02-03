import {
  int,
  nvarchar,
  bit,
  datetime2,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

/**
 * Existing DB table: T_USER (admin portal users).
 * Column format: PascalCase with underscores (Id, User_Type, E_Mail, Created_Date).
 */
export const tUser = mssqlTable('T_USER', {
  id: int('Id').primaryKey().identity(),
  name: nvarchar('Name', { length: 100 }),
  userType: nvarchar('User_Type', { length: 30 }),
  userName: nvarchar('User_Name', { length: 100 }),
  password: nvarchar('Password', { length: 255 }),
  mobileNumber: nvarchar('Mobile_Number', { length: 15 }),
  location: nvarchar('Location', { length: 300 }),
  eMail: nvarchar('E_Mail', { length: 100 }),
  profilePicture: nvarchar('Profile_Picture', { length: 500 }),
  isActive: bit('Is_Active'),
  createdBy: int('Created_By'),
  createdDate: datetime2('Created_Date', { precision: 3 }),
  profileImageUrl: nvarchar('Profile_Image_Url', { length: 512 }),
});

export type TUser = typeof tUser.$inferSelect;
export type NewTUser = typeof tUser.$inferInsert;
