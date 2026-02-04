ALTER TABLE [T_Country] ADD [Country_Number] nvarchar(10);
ALTER TABLE [T_Country] ALTER COLUMN [Country_Name] nvarchar(128);
ALTER TABLE [T_Country] ALTER COLUMN [Created_Date] datetime2(3);
ALTER TABLE [T_Country] ALTER COLUMN [Modified_Date] datetime2(3);