-- Drop Default Constraint for require_reason_cancel
DECLARE @ConstraintName nvarchar(200)
SELECT @ConstraintName = Name FROM sys.default_constraints
WHERE parent_object_id = OBJECT_ID('receipt_settings')
AND parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('receipt_settings') AND name = 'require_reason_cancel')
IF @ConstraintName IS NOT NULL
EXEC('ALTER TABLE receipt_settings DROP CONSTRAINT ' + @ConstraintName)
GO
IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'require_reason_cancel' AND Object_ID = Object_ID(N'receipt_settings'))
BEGIN
    ALTER TABLE [receipt_settings] DROP COLUMN [require_reason_cancel];
END