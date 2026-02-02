ALTER TABLE [admin_notifications] ADD [user_id] int NULL;
--> statement-breakpoint
ALTER TABLE [admin_notifications] ADD CONSTRAINT [FK_admin_notifications_user_id] FOREIGN KEY ([user_id]) REFERENCES [T_USER]([Id]);
--> statement-breakpoint
CREATE INDEX [IDX_admin_notifications_user_id] ON [admin_notifications]([user_id]);
