ALTER TABLE "admin_notifications" ADD "sender_id" int;
ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_sender_id_T_USER_Id_fk" FOREIGN KEY ("sender_id") REFERENCES "T_USER"("Id");
