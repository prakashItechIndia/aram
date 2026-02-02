-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE [admin_notifications] (
	[id] int IDENTITY(1, 1),
	[type] nvarchar(32) NOT NULL,
	[title] nvarchar(255) NOT NULL,
	[message] nvarchar(max),
	[read_at] datetime2(3),
	[created_at] datetime2(3) CONSTRAINT [DF__admin_not__creat__3FBB6990] DEFAULT (getdate()),
	CONSTRAINT [PK__admin_no__3213E83F46668038] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [audit_log] (
	[id] int IDENTITY(1, 1),
	[user_id] int,
	[action] nvarchar(64) NOT NULL,
	[entity_type] nvarchar(64),
	[entity_id] nvarchar(64),
	[details_json] nvarchar(max),
	[ip_address] nvarchar(45),
	[created_at] datetime2(3) CONSTRAINT [DF__audit_log__creat__3BEAD8AC] DEFAULT (getdate()),
	CONSTRAINT [PK__audit_lo__3213E83FBF5B7D66] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [automation_rules] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(255) NOT NULL,
	[trigger_type] nvarchar(64) NOT NULL,
	[trigger_filters_json] nvarchar(max),
	[actions_json] nvarchar(max) NOT NULL,
	[category] nvarchar(32),
	[priority] nvarchar(16),
	[status] nvarchar(32) NOT NULL CONSTRAINT [DF__automatio__statu__6F6A7CB2] DEFAULT (N'Enabled'),
	[schedule_type] nvarchar(32),
	[schedule_config_json] nvarchar(max),
	[last_run_at] datetime2(3),
	[next_run_at] datetime2(3),
	[success_rate] decimal(5,2),
	[created_at] datetime2(3) CONSTRAINT [DF__automatio__creat__705EA0EB] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__automati__3213E83FE1293288] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [automation_run_logs] (
	[id] int IDENTITY(1, 1),
	[rule_id] int,
	[event_ref] nvarchar(128),
	[recipient] nvarchar(255),
	[channel] nvarchar(32),
	[status] nvarchar(32) NOT NULL,
	[error_message] nvarchar(max),
	[created_at] datetime2(3) CONSTRAINT [DF__automatio__creat__733B0D96] DEFAULT (getdate()),
	CONSTRAINT [PK__automati__3213E83FF7BAC5CD] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [campaigns] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(128) NOT NULL,
	[public_title] nvarchar(255),
	[campaign_code] nvarchar(32) NOT NULL,
	[donation_category_id] int,
	[campaign_type] nvarchar(32),
	[target_amount] decimal(18,2),
	[current_amount] decimal(18,2) NOT NULL CONSTRAINT [DF__campaigns__curre__01BE3717] DEFAULT ((0)),
	[donor_count_target] int,
	[show_progress_on_public] bit NOT NULL CONSTRAINT [DF__campaigns__show___02B25B50] DEFAULT ((1)),
	[is_active] bit NOT NULL CONSTRAINT [DF__campaigns__is_ac__03A67F89] DEFAULT ((1)),
	[created_at] datetime2(3) CONSTRAINT [DF__campaigns__creat__049AA3C2] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[start_date] date,
	[end_date] date,
	[event_description] nvarchar(max),
	[banner_image_url] nvarchar(512),
	[thumbnail_image_url] nvarchar(512),
	CONSTRAINT [PK__campaign__3213E83FAA2FF733] PRIMARY KEY([id]),
	CONSTRAINT [UQ__campaign__DE597DBC8B9E6E62] UNIQUE([campaign_code])
);
--> statement-breakpoint
CREATE TABLE [communication_templates] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(128) NOT NULL,
	[category] nvarchar(32),
	[type] nvarchar(16) NOT NULL,
	[subject] nvarchar(255),
	[body_content] nvarchar(max),
	[variables_json] nvarchar(max),
	[dlt_template_id] nvarchar(64),
	[is_active] bit NOT NULL CONSTRAINT [DF__communica__is_ac__316D4A39] DEFAULT ((1)),
	[created_at] datetime2(3) CONSTRAINT [DF__communica__creat__32616E72] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[status] nvarchar(32),
	[updated_by] nvarchar(128),
	CONSTRAINT [PK__communic__3213E83F08F16204] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [donation_categories] (
	[id] int IDENTITY(1, 1),
	[category_code] nvarchar(32) NOT NULL,
	[display_name] nvarchar(128) NOT NULL,
	[public_visibility] bit NOT NULL CONSTRAINT [DF__donation___publi__7A1D154F] DEFAULT ((1)),
	[sort_order] int NOT NULL CONSTRAINT [DF__donation___sort___7B113988] DEFAULT ((0)),
	[is_80g_eligible] bit NOT NULL CONSTRAINT [DF__donation___is_80__7C055DC1] DEFAULT ((1)),
	[suggested_amounts] nvarchar(max),
	[is_deleted] bit NOT NULL CONSTRAINT [DF__donation___is_de__7CF981FA] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__donation___creat__7DEDA633] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[description] nvarchar(max),
	[tag_label] nvarchar(64),
	[highlighted] bit NOT NULL CONSTRAINT [DF__donation___highl__5A6F5FCC] DEFAULT ((0)),
	[is_default] bit NOT NULL CONSTRAINT [DF__donation___is_de__5B638405] DEFAULT ((0)),
	[min_amount] decimal(18,2),
	[max_amount] decimal(18,2),
	[allow_custom_amount] bit NOT NULL CONSTRAINT [DF__donation___allow__5C57A83E] DEFAULT ((1)),
	[recurring_allowed] bit NOT NULL CONSTRAINT [DF__donation___recur__5D4BCC77] DEFAULT ((0)),
	[recurring_default_checked] bit NOT NULL CONSTRAINT [DF__donation___recur__5E3FF0B0] DEFAULT ((0)),
	[receipt_enabled] bit NOT NULL CONSTRAINT [DF__donation___recei__5F3414E9] DEFAULT ((1)),
	[template_80g] nvarchar(128),
	[template_non_80g] nvarchar(128),
	[auto_email_receipt] bit NOT NULL CONSTRAINT [DF__donation___auto___60283922] DEFAULT ((1)),
	[auto_sms_receipt] bit NOT NULL CONSTRAINT [DF__donation___auto___611C5D5B] DEFAULT ((0)),
	[receipt_description] nvarchar(255),
	[pan_rule] nvarchar(32),
	[pan_threshold] int,
	[address_required] bit NOT NULL CONSTRAINT [DF__donation___addre__62108194] DEFAULT ((0)),
	[mobile_required] bit NOT NULL CONSTRAINT [DF__donation___mobil__6304A5CD] DEFAULT ((1)),
	[show_purpose_field] bit NOT NULL CONSTRAINT [DF__donation___show___63F8CA06] DEFAULT ((1)),
	[allow_anonymous] bit NOT NULL CONSTRAINT [DF__donation___allow__64ECEE3F] DEFAULT ((0)),
	[allowed_gateways] nvarchar(max),
	[allowed_payment_methods] nvarchar(max),
	[international_allowed] bit NOT NULL CONSTRAINT [DF__donation___inter__65E11278] DEFAULT ((0)),
	[accounting_head] nvarchar(128),
	[cost_center] nvarchar(128),
	[tax_category] nvarchar(64),
	[report_grouping] nvarchar(128),
	CONSTRAINT [PK__donation__3213E83F3AB29689] PRIMARY KEY([id]),
	CONSTRAINT [UQ__donation__BC9D1E7C349B7CF2] UNIQUE([category_code])
);
--> statement-breakpoint
CREATE TABLE [donation_form_settings] (
	[id] int IDENTITY(1, 1),
	[version] nvarchar(32) NOT NULL,
	[config_json] nvarchar(max) NOT NULL,
	[is_active] bit NOT NULL CONSTRAINT [DF__donation___is_ac__1B7E091A] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__donation___creat__1C722D53] DEFAULT (getdate()),
	[created_by] nvarchar(128),
	[maintenance_message] nvarchar(max),
	[form_enabled] bit NOT NULL CONSTRAINT [DF__donation___form___66D536B1] DEFAULT ((1)),
	[test_mode] bit NOT NULL CONSTRAINT [DF__donation___test___67C95AEA] DEFAULT ((0)),
	[multi_country] bit NOT NULL CONSTRAINT [DF__donation___multi__68BD7F23] DEFAULT ((0)),
	[pan_required] nvarchar(32),
	[address_required] bit NOT NULL CONSTRAINT [DF__donation___addre__69B1A35C] DEFAULT ((1)),
	[mobile_required] bit NOT NULL CONSTRAINT [DF__donation___mobil__6AA5C795] DEFAULT ((1)),
	[otp_verification] bit NOT NULL CONSTRAINT [DF__donation___otp_v__6B99EBCE] DEFAULT ((0)),
	[suggest_recurring] bit NOT NULL CONSTRAINT [DF__donation___sugge__6C8E1007] DEFAULT ((1)),
	[changes_description] nvarchar(500),
	CONSTRAINT [PK__donation__3213E83FBC4C80B4] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [donor_notes] (
	[id] int IDENTITY(1, 1),
	[donor_id] int NOT NULL,
	[created_by_user_id] int,
	[note_text] nvarchar(max) NOT NULL,
	[created_at] datetime2(3) CONSTRAINT [DF__donor_not__creat__5E0AE686] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__donor_no__3213E83F343D1989] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [donors] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(255) NOT NULL,
	[email] nvarchar(255) NOT NULL,
	[mobile] nvarchar(20),
	[pan] nvarchar(10),
	[address] nvarchar(max),
	[country] nvarchar(128) CONSTRAINT [DF__donors__country__727BF387] DEFAULT (N'India'),
	[state] nvarchar(128),
	[pincode] nvarchar(20),
	[status] nvarchar(32),
	[tags] nvarchar(max),
	[first_donation_at] datetime2(3),
	[last_donation_at] datetime2(3),
	[total_donated] decimal(18,2) NOT NULL CONSTRAINT [DF__donors__total_do__737017C0] DEFAULT ((0)),
	[donation_count] int NOT NULL CONSTRAINT [DF__donors__donation__74643BF9] DEFAULT ((0)),
	[is_guest] bit NOT NULL CONSTRAINT [DF__donors__is_guest__75586032] DEFAULT ((0)),
	[password_hash] nvarchar(255),
	[created_at] datetime2(3) CONSTRAINT [DF__donors__created___764C846B] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[theme_preference] nvarchar(16),
	[notification_preferences] nvarchar(max),
	[birthday] date,
	[memorial_dates] nvarchar(max),
	CONSTRAINT [PK__donors__3213E83F254341AA] PRIMARY KEY([id]),
	CONSTRAINT [UQ_donors_pan] UNIQUE([pan])
);
--> statement-breakpoint
CREATE TABLE [e_challans] (
	[id] int IDENTITY(1, 1),
	[challan_number] nvarchar(64) NOT NULL,
	[donor_id] int NOT NULL,
	[amount] decimal(18,2) NOT NULL,
	[category_id] int,
	[cheque_number] nvarchar(64),
	[payment_mode] nvarchar(32) NOT NULL,
	[donation_date] date NOT NULL,
	[receipt_id] int,
	[created_at] datetime2(3) CONSTRAINT [DF__e_challan__creat__353DDB1D] DEFAULT (getdate()),
	[created_by_user_id] int,
	[cash_received_by] nvarchar(128),
	[bank_name] nvarchar(128),
	[cheque_date] date,
	[dd_number] nvarchar(64),
	[dd_date] date,
	[utr_number] nvarchar(64),
	[transfer_date] date,
	[amount_in_words] nvarchar(255),
	[donor_type] nvarchar(32),
	[purpose] nvarchar(max),
	[receipt_number] nvarchar(64),
	CONSTRAINT [PK__e_challa__3213E83FA3DFC789] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [enquiries] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(255) NOT NULL,
	[email] nvarchar(255) NOT NULL,
	[organization] nvarchar(255),
	[subject] nvarchar(255),
	[message] nvarchar(max),
	[status] nvarchar(32) NOT NULL,
	[assigned_to_user_id] int,
	[created_at] datetime2(3) CONSTRAINT [DF__enquiries__creat__2D9CB955] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[category] nvarchar(64),
	[sla_deadline] datetime2(3),
	[has_attachment] bit NOT NULL CONSTRAINT [DF__enquiries__has_a__1A54DAB7] DEFAULT ((0)),
	CONSTRAINT [PK__enquirie__3213E83F200D83F0] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [enquiry_replies] (
	[id] int IDENTITY(1, 1),
	[enquiry_id] int NOT NULL,
	[from_user_id] int,
	[body] nvarchar(max) NOT NULL,
	[is_internal] bit NOT NULL CONSTRAINT [DF__enquiry_r__is_in__0C06BB60] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__enquiry_r__creat__0CFADF99] DEFAULT (getdate()),
	CONSTRAINT [PK__enquiry___3213E83F154382EE] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [enquiry_settings] (
	[id] int IDENTITY(1, 1),
	[default_sla_hours] int,
	[warning_before_breach_hours] int,
	[auto_assignment_enabled] bit NOT NULL CONSTRAINT [DF__enquiry_s__auto___58520D30] DEFAULT ((0)),
	[assignment_method] nvarchar(32),
	[auto_detect_spam] bit NOT NULL CONSTRAINT [DF__enquiry_s__auto___59463169] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__enquiry_s__creat__5A3A55A2] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__enquiry___3213E83F49EA052A] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [export_log] (
	[id] int IDENTITY(1, 1),
	[user_id] int,
	[report_type] nvarchar(64),
	[format] nvarchar(16),
	[ip_address] nvarchar(45),
	[created_at] datetime2(3) CONSTRAINT [DF__export_lo__creat__5887175A] DEFAULT (getdate()),
	CONSTRAINT [PK__export_l__3213E83FBCA0C770] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [feature_config] (
	[id] int IDENTITY(1, 1),
	[key] nvarchar(128) NOT NULL,
	[value] nvarchar(max),
	[is_enabled] bit NOT NULL CONSTRAINT [DF__feature_c__is_en__2042BE37] DEFAULT ((1)),
	[updated_at] datetime2(3) CONSTRAINT [DF__feature_c__updat__2136E270] DEFAULT (getdate()),
	[updated_by] nvarchar(128),
	CONSTRAINT [PK__feature___3213E83F10E6EF79] PRIMARY KEY([id]),
	CONSTRAINT [UQ__feature___DFD83CAF9876463D] UNIQUE([key])
);
--> statement-breakpoint
CREATE TABLE [gallery] (
	[id] int IDENTITY(1, 1),
	[title] nvarchar(255) NOT NULL,
	[description] nvarchar(max),
	[alt_text] nvarchar(255),
	[image_path] nvarchar(512) NOT NULL,
	[album_id] int,
	[tags_json] nvarchar(max),
	[sort_order] int NOT NULL CONSTRAINT [DF__gallery__sort_or__54B68676] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__gallery__created__55AAAAAF] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[caption] nvarchar(max),
	[photographer] nvarchar(128),
	[visibility] nvarchar(32) NOT NULL CONSTRAINT [DF__gallery__visibil__1B48FEF0] DEFAULT (N'Public'),
	[file_size] nvarchar(32),
	[thumbnail_path] nvarchar(512),
	[uploaded_by] nvarchar(128),
	[uploaded_at] datetime2(3),
	[alt_text_generated_by_ai] bit NOT NULL CONSTRAINT [DF__gallery__alt_tex__5B2E79DB] DEFAULT ((0)),
	CONSTRAINT [PK__gallery__3213E83F013C91F8] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [gallery_albums] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(255) NOT NULL,
	[cover_image_url] nvarchar(512),
	[image_count] int NOT NULL CONSTRAINT [DF__gallery_a__image__064DE20A] DEFAULT ((0)),
	[visibility] nvarchar(32) NOT NULL CONSTRAINT [DF__gallery_a__visib__07420643] DEFAULT (N'Public'),
	[sort_order] int NOT NULL CONSTRAINT [DF__gallery_a__sort___08362A7C] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__gallery_a__creat__092A4EB5] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__gallery___3213E83FD8F88096] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [gallery_settings] (
	[id] int IDENTITY(1, 1),
	[auto_resize_enabled] bit NOT NULL CONSTRAINT [DF__gallery_s__auto___1F198FD4] DEFAULT ((1)),
	[resize_sizes_json] nvarchar(max),
	[convert_to_webp_enabled] bit NOT NULL CONSTRAINT [DF__gallery_s__conve__200DB40D] DEFAULT ((1)),
	[auto_generate_alt_text_enabled] bit NOT NULL CONSTRAINT [DF__gallery_s__auto___2101D846] DEFAULT ((0)),
	[max_file_size_mb] int,
	[allowed_extensions] nvarchar(128),
	[created_at] datetime2(3) CONSTRAINT [DF__gallery_s__creat__21F5FC7F] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__gallery___3213E83F269A851C] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [payment_gateway_settings] (
	[id] int IDENTITY(1, 1),
	[provider] nvarchar(32) NOT NULL,
	[environment] nvarchar(16) NOT NULL,
	[api_key_encrypted] nvarchar(max),
	[api_secret_encrypted] nvarchar(max),
	[webhook_secret] nvarchar(255),
	[merchant_id] nvarchar(128),
	[gateway_fee_config] nvarchar(max),
	[retry_policy] nvarchar(max),
	[is_active] bit NOT NULL CONSTRAINT [DF__payment_g__is_ac__24134F1B] DEFAULT ((1)),
	[created_at] datetime2(3) CONSTRAINT [DF__payment_g__creat__25077354] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__payment___3213E83F032E1C7E] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [receipt_settings] (
	[id] int IDENTITY(1, 1),
	[config_json] nvarchar(max),
	[created_at] datetime2(3) CONSTRAINT [DF__receipt_s__creat__24D2692A] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[updated_by] nvarchar(128),
	[auto_send_email_on_receipt_generation] bit NOT NULL CONSTRAINT [DF__receipt_s__auto___25C68D63] DEFAULT ((1)),
	[email_subject_format] nvarchar(max),
	[email_sender_name] nvarchar(255),
	[email_reply_to] nvarchar(255),
	[email_retry_attempts] int NOT NULL CONSTRAINT [DF__receipt_s__email__26BAB19C] DEFAULT ((3)),
	[email_failure_alerts_notify_admin] bit NOT NULL CONSTRAINT [DF__receipt_s__email__27AED5D5] DEFAULT ((1)),
	[auto_send_sms_on_receipt_generation] bit NOT NULL CONSTRAINT [DF__receipt_s__auto___28A2FA0E] DEFAULT ((0)),
	[sms_template] nvarchar(max),
	[sms_short_link] bit NOT NULL CONSTRAINT [DF__receipt_s__sms_s__29971E47] DEFAULT ((1)),
	[mobile_required] bit NOT NULL CONSTRAINT [DF__receipt_s__mobil__2A8B4280] DEFAULT ((1)),
	[email_required] bit NOT NULL CONSTRAINT [DF__receipt_s__email__2B7F66B9] DEFAULT ((1)),
	[address_required] bit NOT NULL CONSTRAINT [DF__receipt_s__addre__2C738AF2] DEFAULT ((0)),
	[donation_category_required] bit NOT NULL CONSTRAINT [DF__receipt_s__donat__2D67AF2B] DEFAULT ((1)),
	[donation_type_required] bit NOT NULL CONSTRAINT [DF__receipt_s__donat__2E5BD364] DEFAULT ((1)),
	[pan_rule] nvarchar(32),
	[pan_threshold] int,
	[pan_auto_uppercase] bit NOT NULL CONSTRAINT [DF__receipt_s__pan_a__2F4FF79D] DEFAULT ((1)),
	[pincode_validation] bit NOT NULL CONSTRAINT [DF__receipt_s__pinco__30441BD6] DEFAULT ((1)),
	[duplicate_warning] bit NOT NULL CONSTRAINT [DF__receipt_s__dupli__3138400F] DEFAULT ((1)),
	[receipt_prefix] nvarchar(64),
	[starting_number] nvarchar(32),
	[padding_length] int,
	[no_gap_enforcement] bit NOT NULL CONSTRAINT [DF__receipt_s__no_ga__322C6448] DEFAULT ((1)),
	[auto_create_new_series] bit NOT NULL CONSTRAINT [DF__receipt_s__auto___33208881] DEFAULT ((1)),
	[manual_approval_required] bit NOT NULL CONSTRAINT [DF__receipt_s__manua__3414ACBA] DEFAULT ((0)),
	[receipt_types_json] nvarchar(max),
	[auto_generate_on_success] bit NOT NULL CONSTRAINT [DF__receipt_s__auto___3508D0F3] DEFAULT ((1)),
	[generation_delay] int NOT NULL CONSTRAINT [DF__receipt_s__gener__35FCF52C] DEFAULT ((0)),
	[auto_generate_imports] bit NOT NULL CONSTRAINT [DF__receipt_s__auto___36F11965] DEFAULT ((0)),
	[allow_manual_offline] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__37E53D9E] DEFAULT ((1)),
	[allow_manual_bulk] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__38D961D7] DEFAULT ((1)),
	[allow_backdated] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__39CD8610] DEFAULT ((1)),
	[backdate_window] int,
	[show_backdate_stamp] bit NOT NULL CONSTRAINT [DF__receipt_s__show___3AC1AA49] DEFAULT ((1)),
	[require_reason_manual] bit NOT NULL CONSTRAINT [DF__receipt_s__requi__3BB5CE82] DEFAULT ((1)),
	[default_template_online] nvarchar(128),
	[default_template_offline] nvarchar(128),
	[template_80g] nvarchar(128),
	[template_non_80g] nvarchar(128),
	[force_regenerate_on_update] bit NOT NULL CONSTRAINT [DF__receipt_s__force__3CA9F2BB] DEFAULT ((0)),
	[lock_content_after_generation] bit NOT NULL CONSTRAINT [DF__receipt_s__lock___3D9E16F4] DEFAULT ((1)),
	[storage_mode] nvarchar(16),
	[link_security] nvarchar(16),
	[link_expiry_days] int,
	[allow_regeneration_template] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__3E923B2D] DEFAULT ((1)),
	[allow_regeneration_anytime] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__3F865F66] DEFAULT ((0)),
	[bulk_generation_allowed] bit NOT NULL CONSTRAINT [DF__receipt_s__bulk___407A839F] DEFAULT ((1)),
	[max_batch_size] int,
	[zip_filename_format] nvarchar(255),
	[include_index_csv] bit NOT NULL CONSTRAINT [DF__receipt_s__inclu__416EA7D8] DEFAULT ((1)),
	[run_in_background] bit NOT NULL CONSTRAINT [DF__receipt_s__run_i__4262CC11] DEFAULT ((1)),
	[allow_mark_reissued] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__4356F04A] DEFAULT ((1)),
	[auto_mark_delivered] bit NOT NULL CONSTRAINT [DF__receipt_s__auto___444B1483] DEFAULT ((1)),
	[allow_reprint] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__453F38BC] DEFAULT ((1)),
	[allow_resend_email] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__46335CF5] DEFAULT ((1)),
	[allow_correction] bit NOT NULL CONSTRAINT [DF__receipt_s__allow__4727812E] DEFAULT ((1)),
	[require_reason_reprint] bit NOT NULL CONSTRAINT [DF__receipt_s__requi__481BA567] DEFAULT ((0)),
	[require_reason_correction] bit NOT NULL CONSTRAINT [DF__receipt_s__requi__490FC9A0] DEFAULT ((1)),
	[require_reason_manual_gen] bit NOT NULL CONSTRAINT [DF__receipt_s__requi__4A03EDD9] DEFAULT ((1)),
	[require_reason_regenerate] bit NOT NULL CONSTRAINT [DF__receipt_s__requi__4AF81212] DEFAULT ((1)),
	[require_reason_cancel] bit NOT NULL CONSTRAINT [DF__receipt_s__requi__4BEC364B] DEFAULT ((1)),
	[retention_years] int,
	[default_date_filter] nvarchar(32),
	[default_page_size] int,
	[export_formats_csv] bit NOT NULL CONSTRAINT [DF__receipt_s__expor__4CE05A84] DEFAULT ((1)),
	[export_formats_excel] bit NOT NULL CONSTRAINT [DF__receipt_s__expor__4DD47EBD] DEFAULT ((1)),
	[export_formats_pdf] bit NOT NULL CONSTRAINT [DF__receipt_s__expor__4EC8A2F6] DEFAULT ((1)),
	[mask_pii] bit NOT NULL CONSTRAINT [DF__receipt_s__mask___4FBCC72F] DEFAULT ((1)),
	CONSTRAINT [PK__receipt___3213E83FA26480E9] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [receipts] (
	[id] int IDENTITY(1, 1),
	[receipt_number] nvarchar(64) NOT NULL,
	[transaction_id] int,
	[donor_id] int NOT NULL,
	[amount] decimal(18,2) NOT NULL,
	[category_id] int,
	[receipt_type] nvarchar(32) NOT NULL,
	[financial_year] nvarchar(16),
	[pdf_path] nvarchar(512),
	[is_80g] bit NOT NULL CONSTRAINT [DF__receipts__is_80g__095F58DF] DEFAULT ((1)),
	[generated_at] datetime2(3) CONSTRAINT [DF__receipts__genera__0A537D18] DEFAULT (getdate()),
	[created_at] datetime2(3) CONSTRAINT [DF__receipts__create__0B47A151] DEFAULT (getdate()),
	[template_version] nvarchar(32),
	[generated_by] nvarchar(128),
	[delivery_status_email] nvarchar(32),
	[delivery_status_sms] nvarchar(32),
	[status] nvarchar(32),
	CONSTRAINT [PK__receipts__3213E83FA24B973F] PRIMARY KEY([id]),
	CONSTRAINT [UQ__receipts__89FE4B7559CA2AA5] UNIQUE([receipt_number])
);
--> statement-breakpoint
CREATE TABLE [reconciliation_batches] (
	[id] int IDENTITY(1, 1),
	[gateway_provider] nvarchar(32) NOT NULL,
	[period_start] datetime2(3) NOT NULL,
	[period_end] datetime2(3) NOT NULL,
	[status] nvarchar(32) NOT NULL,
	[matched_count] int NOT NULL CONSTRAINT [DF__reconcili__match__4668671F] DEFAULT ((0)),
	[mismatch_count] int NOT NULL CONSTRAINT [DF__reconcili__misma__475C8B58] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__reconcili__creat__4850AF91] DEFAULT (getdate()),
	CONSTRAINT [PK__reconcil__3213E83FE805A2D7] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [reconciliation_settings] (
	[id] int IDENTITY(1, 1),
	[auto_fetch_settlements] bit NOT NULL CONSTRAINT [DF__reconcili__auto___529933DA] DEFAULT ((1)),
	[auto_match_settlements] bit NOT NULL CONSTRAINT [DF__reconcili__auto___538D5813] DEFAULT ((1)),
	[match_strategy] nvarchar(32),
	[mismatch_tolerance] decimal(18,2),
	[receipt_missing_threshold] int,
	[webhook_missing_threshold] int,
	[manual_approval_required] bit NOT NULL CONSTRAINT [DF__reconcili__manua__54817C4C] DEFAULT ((1)),
	[created_at] datetime2(3) CONSTRAINT [DF__reconcili__creat__5575A085] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__reconcil__3213E83F8D99D8CA] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [refund_requests] (
	[id] int IDENTITY(1, 1),
	[transaction_id] int NOT NULL,
	[amount] decimal(18,2) NOT NULL,
	[reason] nvarchar(max) NOT NULL,
	[status] nvarchar(32) NOT NULL,
	[requested_by_user_id] int,
	[approved_by_user_id] int,
	[created_at] datetime2(3) CONSTRAINT [DF__refund_re__creat__27E3DFFF] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__refund_r__3213E83F6FA8255B] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [role_permissions] (
	[id] int IDENTITY(1, 1),
	[role_id] int NOT NULL,
	[permission_key] nvarchar(128) NOT NULL,
	[can_create] bit NOT NULL CONSTRAINT [DF__role_perm__can_c__149C0161] DEFAULT ((0)),
	[can_update] bit NOT NULL CONSTRAINT [DF__role_perm__can_u__1590259A] DEFAULT ((0)),
	[can_view] bit NOT NULL CONSTRAINT [DF__role_perm__can_v__168449D3] DEFAULT ((1)),
	[can_delete] bit NOT NULL CONSTRAINT [DF__role_perm__can_d__17786E0C] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__role_perm__creat__186C9245] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__role_per__3213E83F2A824CD1] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [sponsors] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(255) NOT NULL,
	[logo_url] nvarchar(512),
	[website_url] nvarchar(512),
	[contribution_type] nvarchar(32),
	[tier] nvarchar(32),
	[display_order] int NOT NULL CONSTRAINT [DF__sponsors__displa__4EFDAD20] DEFAULT ((0)),
	[is_active] bit NOT NULL CONSTRAINT [DF__sponsors__is_act__4FF1D159] DEFAULT ((1)),
	[show_on_homepage] bit NOT NULL CONSTRAINT [DF__sponsors__show_o__50E5F592] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__sponsors__create__51DA19CB] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[added_by] nvarchar(128),
	[featured] bit NOT NULL CONSTRAINT [DF__sponsors__featur__1C3D2329] DEFAULT ((0)),
	[display_start_date] date,
	[display_end_date] date,
	CONSTRAINT [PK__sponsors__3213E83F7DE1E309] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [T_BASIC_SETTING] (
	[Id] int IDENTITY(1, 1),
	[Aram_MailId] nvarchar(500),
	[Aram_ReplyTo_MailId] nvarchar(500),
	[Aram_CC_MailId] nvarchar(500),
	[Aram_BCC_MailId] nvarchar(max),
	[Aram_Mail_Subject] nvarchar(max),
	[Service_StartDate] datetime,
	[Service_EndDate] datetime,
	[Status] bit,
	[Aram_Mail_Body_1] nvarchar(max),
	CONSTRAINT [PK_T_BASIC_SETTING] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_CFG_ERRORLOG] (
	[Error_ID] bigint IDENTITY(1, 1),
	[ProjectName] nvarchar(100),
	[FormName] nvarchar(100),
	[CustomerID] nvarchar(100),
	[ProcessName] nvarchar(100),
	[Severity] nvarchar(50),
	[ErrorDetails] nvarchar(max),
	[UserName] nvarchar(50),
	[RecordStatus] nvarchar(50),
	[Data_Date] datetime CONSTRAINT [DF_ErrorLog_Data_Date] DEFAULT (getdate()),
	[IsDelete] bit CONSTRAINT [DF_ErrorLog_IsDelete] DEFAULT ((0)),
	CONSTRAINT [PK_ErrorLog] PRIMARY KEY([Error_ID])
);
--> statement-breakpoint
CREATE TABLE [T_CFG_Recipients] (
	[Id] int IDENTITY(1, 1),
	[Institution_Id] bigint NOT NULL,
	[Email_Type] varchar(200) CONSTRAINT [DF__t_cfg_rec__Email__30C33EC3] DEFAULT (NULL),
	[Recipient_Type] varchar(100) CONSTRAINT [DF__t_cfg_rec__Recip__31B762FC] DEFAULT (NULL),
	[FromEmail] varchar(500) CONSTRAINT [DF__t_cfg_rec__FromE__32AB8735] DEFAULT (NULL),
	[ToEmails] varchar(500),
	[BCCs] varchar(1000),
	[CCs] varchar(1000),
	[Subject] varchar(500),
	[Signature] varchar(500),
	[Body] nvarchar(max),
	[Active] bit,
	[Delete_Flag] bit,
	CONSTRAINT [PK__t_cfg_re__3214EC07BDCB69BF] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_Country] (
	[Id] int IDENTITY(1, 1),
	[Country_Name] nvarchar(200),
	[Country_Code] nvarchar(10),
	[Is_Active] bit,
	[Created_By] int,
	[Created_Date] datetime,
	[Is_Deleted] bit,
	[Modified_By] int,
	[Modified_Date] datetime,
	CONSTRAINT [PK_T_Country] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_DONOR_CATEGORIES] (
	[Id] int IDENTITY(1, 1),
	[Account_Number] nvarchar(30),
	[Donor_Types] nvarchar(50),
	[Donation_Code] nchar(10),
	[DonationPage_Show] bit,
	[Is_Active] bit,
	[Is_Deleted] bit,
	[Created_By] int,
	[Created_Date] datetime,
	CONSTRAINT [PK_T_DONOR_CATEGORIES] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_EChallan] (
	[Id] int IDENTITY(1, 1),
	[Receipt_Number] nvarchar(50),
	[Donation_Types] int NOT NULL,
	[Account_Number] nvarchar(25),
	[Name_Of_Donor] nvarchar(100),
	[Address] nvarchar(500),
	[State_Id] int,
	[State_Name] nvarchar(100),
	[Country_Id] int,
	[Country_Name] nvarchar(100),
	[City] nvarchar(100),
	[Pincode] nvarchar(6),
	[Telephone_Number] nvarchar(15),
	[Mobile_Number] nvarchar(15),
	[Email_Id] nvarchar(50),
	[Payment_Mode] nvarchar(30),
	[Amount] decimal(18,2),
	[Amount_In_Words] nvarchar(max),
	[DD_OR_Cheque_Number] nvarchar(10),
	[DD_OR_Cheque_Date] datetime,
	[DD_OR_Cheque_BankName] nvarchar(200),
	[DD_OR_Cheque_Branch] nvarchar(200),
	[PANcard_Number] nvarchar(50),
	[Location] nvarchar(100),
	[Receipt_Date] datetime,
	[Is_Active] bit,
	[Created_by] int,
	[Created_Date] datetime,
	[Type] nvarchar(10),
	[Transaction_Reference_PGI_Number] nvarchar(100),
	[Bank_Reference_Number] nvarchar(100),
	[Transaction_Amount] decimal(18,2),
	[Bank_Id] nvarchar(50),
	[Bank_Merchant_Id] nvarchar(50),
	[Transaction_Type] nvarchar(50),
	[Auth_Status] nvarchar(50),
	[Transaction_Date] nvarchar(100),
	[Auth_Status_Message] nvarchar(100),
	CONSTRAINT [PK_T_EChallan] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_Payment_Gateway_Config] (
	[Id] bigint IDENTITY(1, 1),
	[Setting_Name] nvarchar(150) NOT NULL,
	[Setting_Value] nvarchar(500) NOT NULL,
	CONSTRAINT [PK_T_Payment_Gateway_Config] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_Payment_Order_No] (
	[Doc_Type_Id] int IDENTITY(1, 1),
	[Doc_Type] varchar(3) NOT NULL,
	[Financial_Year] varchar(9) NOT NULL,
	[Institution_Id] int NOT NULL,
	[Starting_No] int NOT NULL,
	[Latest_No] int NOT NULL,
	[Module_Tag] varchar(15) NOT NULL,
	[Created_By] bigint NOT NULL,
	[Created_Date] datetime NOT NULL,
	CONSTRAINT [PK_T_Payment_Order_No] PRIMARY KEY([Doc_Type_Id])
);
--> statement-breakpoint
CREATE TABLE [T_Payment_Transaction] (
	[Id] bigint IDENTITY(1, 1),
	[EChallan_Id] int,
	[Fee_Type] nvarchar(50),
	[OrderId] nvarchar(50),
	[PaymentAmt] nvarchar(50),
	[MID] nvarchar(50),
	[MKEY] nvarchar(50),
	[paytmParams] nvarchar(max),
	[Signature] nvarchar(2000),
	[PaytmUrl] nvarchar(500),
	[Token] nvarchar(250),
	[PaymentUrl] nvarchar(500),
	[Initiated_Time] datetime,
	[CURRENCY] nvarchar(5),
	[GATEWAYNAME] nvarchar(20),
	[RESPMSG] nvarchar(500),
	[BANKNAME] nvarchar(150),
	[PAYMENTMODE] nvarchar(20),
	[RESPCODE] nvarchar(20),
	[TXNID] nvarchar(80),
	[TXNAMOUNT] nvarchar(25),
	[TXN_STATUS] nvarchar(20),
	[BANKTXNID] nvarchar(150),
	[TXNDATE] datetime,
	[CHECKSUMHASH] nvarchar(250),
	[ValidateCheckSum] nvarchar(25),
	[ResponseTimeStamp] nvarchar(max),
	[Version] nvarchar(50),
	[TXNTYPE] nvarchar(50),
	[Status_Flag] bit,
	CONSTRAINT [PK_T_Payment_Transaction] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_Razorpay_Transaction] (
	[Id] bigint IDENTITY(1, 1),
	[EChallan_Id] bigint NOT NULL,
	[Fee_Type] nvarchar(50),
	[OrderId] nvarchar(50),
	[PaymentAmt] nvarchar(50),
	[MID] nvarchar(50),
	[MKEY] nvarchar(50),
	[OrderIdParams] nvarchar(max),
	[RPayParams] nvarchar(max),
	[RPayOrderId] nvarchar(50),
	[Initiated_Time] datetime,
	[CURRENCY] nvarchar(5),
	[GATEWAYNAME] nvarchar(20),
	[RESPMSG] nvarchar(max),
	[RPayPaymentId] nvarchar(50),
	[RpaySignature] nvarchar(2000),
	[ValidateSignature] nvarchar(25),
	[TXN_STATUS] nvarchar(20),
	[TXNDATE] datetime,
	[BANKNAME] nvarchar(150),
	[PAYMENTMODE] nvarchar(20),
	[RESPCODE] nvarchar(20),
	[TXNID] nvarchar(80),
	[TXNAMOUNT] nvarchar(25),
	[TXNCHARGE] nvarchar(25),
	[BANKTXNID] nvarchar(150),
	[CHECKSUMHASH] nvarchar(250),
	[ValidateCheckSum] nvarchar(25),
	[ResponseTimeStamp] nvarchar(max),
	[Version] nvarchar(50),
	[TXNTYPE] nvarchar(50),
	[Status_Flag] bit,
	CONSTRAINT [PK_T_Razorpay_Transaction] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_State] (
	[Id] int IDENTITY(1, 1),
	[Country_Id] int,
	[State_Name] nvarchar(200),
	[Is_Active] bit,
	[Created_By] int,
	[Created_Date] datetime,
	[Is_Deleted] bit,
	[Modified_By] int,
	[Modified_Date] datetime,
	CONSTRAINT [PK_T_State] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_USER] (
	[Id] int IDENTITY(1, 1),
	[Name] nvarchar(100),
	[User_Type] nvarchar(30),
	[User_Name] nvarchar(100),
	[Password] nvarchar(50),
	[Mobile_Number] nvarchar(15),
	[Location] nvarchar(300),
	[E_Mail] nvarchar(100),
	[Is_Active] bit,
	[Created_By] int,
	[Created_Date] datetime,
	[Is_Deleted] bit,
	[Modified_By] int,
	[Modified_Date] datetime,
	CONSTRAINT [PK_T_USER] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [T_User_Activites] (
	[Id] int IDENTITY(1, 1),
	[EChallan_Id] int,
	[Type] nvarchar(50),
	[Done_By] int,
	[CurrentDate] nvarchar(20),
	[CurrentTime] nvarchar(20),
	CONSTRAINT [PK_T_User_Activites] PRIMARY KEY([Id])
);
--> statement-breakpoint
CREATE TABLE [transactions] (
	[id] int IDENTITY(1, 1),
	[payment_id] nvarchar(128),
	[order_id] nvarchar(128),
	[donor_id] int NOT NULL,
	[amount] decimal(18,2) NOT NULL,
	[gateway_fee] decimal(18,2) NOT NULL CONSTRAINT [DF__transacti__gatew__100C566E] DEFAULT ((0)),
	[net_amount] decimal(18,2),
	[currency] nvarchar(3) NOT NULL CONSTRAINT [DF__transacti__curre__11007AA7] DEFAULT (N'INR'),
	[status] nvarchar(32) NOT NULL,
	[payment_method] nvarchar(32),
	[donation_category_id] int,
	[campaign_id] int,
	[receipt_id] int,
	[gateway_provider] nvarchar(32),
	[gateway_response] nvarchar(max),
	[is_recurring] bit NOT NULL CONSTRAINT [DF__transacti__is_re__11F49EE0] DEFAULT ((0)),
	[is_offline] bit NOT NULL CONSTRAINT [DF__transacti__is_of__12E8C319] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__transacti__creat__13DCE752] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__transact__3213E83FA21C2484] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [user_otp] (
	[id] int IDENTITY(1, 1),
	[user_id] int,
	[email] nvarchar(255),
	[phone] nvarchar(20),
	[otp_code] nvarchar(10) NOT NULL,
	[expires_at] datetime2(3) NOT NULL,
	[created_at] datetime2(3) CONSTRAINT [DF__user_otp__create__4297D63B] DEFAULT (getdate()),
	CONSTRAINT [PK__user_otp__3213E83F34FAD49A] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [user_roles] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(64) NOT NULL,
	[description] nvarchar(255),
	CONSTRAINT [PK__user_rol__3213E83F17DDE973] PRIMARY KEY([id]),
	CONSTRAINT [UQ__user_rol__72E12F1B2C0B7CB5] UNIQUE([name])
);
--> statement-breakpoint
CREATE TABLE [users] (
	[id] int IDENTITY(1, 1),
	[email] nvarchar(255) NOT NULL,
	[password] nvarchar(255) NOT NULL,
	[name] nvarchar(255),
	[role_id] int,
	[created_at] datetime2(3) CONSTRAINT [DF__users__created_a__6EAB62A3] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__users__3213E83F6FBDA42A] PRIMARY KEY([id]),
	CONSTRAINT [UQ__users__AB6E616497F78EB8] UNIQUE([email])
);
--> statement-breakpoint
CREATE TABLE [webhook_log] (
	[id] int IDENTITY(1, 1),
	[gateway] nvarchar(32) NOT NULL,
	[event_type] nvarchar(128),
	[payment_id] nvarchar(128),
	[status] nvarchar(32),
	[signature_valid] bit,
	[notes] nvarchar(max),
	[created_at] datetime2(3) CONSTRAINT [DF__webhook_l__creat__11BF94B6] DEFAULT (getdate()),
	CONSTRAINT [PK__webhook___3213E83F3D219E31] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [website_content] (
	[id] int IDENTITY(1, 1),
	[section_key] nvarchar(64) NOT NULL,
	[content_json] nvarchar(max) NOT NULL,
	[version] int NOT NULL CONSTRAINT [DF__website_c__versi__4B2D1C3C] DEFAULT ((1)),
	[published_at] datetime2(3),
	[created_at] datetime2(3) CONSTRAINT [DF__website_c__creat__4C214075] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	[name] nvarchar(128),
	[slug] nvarchar(128),
	[status] nvarchar(32),
	[modified_by] nvarchar(128),
	CONSTRAINT [PK__website___3213E83F66E44988] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [website_page_sections] (
	[id] int IDENTITY(1, 1),
	[page_id] int NOT NULL,
	[section_key] nvarchar(64) NOT NULL,
	[section_name] nvarchar(128),
	[section_config_json] nvarchar(max),
	[enabled] bit NOT NULL CONSTRAINT [DF__website_p__enabl__7BD05397] DEFAULT ((1)),
	[sort_order] int NOT NULL CONSTRAINT [DF__website_p__sort___7CC477D0] DEFAULT ((0)),
	[created_at] datetime2(3) CONSTRAINT [DF__website_p__creat__7DB89C09] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__website___3213E83F8CE1B03C] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [website_pages] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(128) NOT NULL,
	[slug] nvarchar(128) NOT NULL,
	[status] nvarchar(32) NOT NULL CONSTRAINT [DF__website_p__statu__770B9E7A] DEFAULT (N'Draft'),
	[last_modified] datetime2(3),
	[modified_by] nvarchar(128),
	[version] int NOT NULL CONSTRAINT [DF__website_p__versi__77FFC2B3] DEFAULT ((1)),
	[created_at] datetime2(3) CONSTRAINT [DF__website_p__creat__78F3E6EC] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__website___3213E83F5CF9854E] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [website_team_members] (
	[id] int IDENTITY(1, 1),
	[name] nvarchar(255) NOT NULL,
	[designation] nvarchar(128),
	[photo_url] nvarchar(512),
	[bio] nvarchar(max),
	[social_links_json] nvarchar(max),
	[display_order] int NOT NULL CONSTRAINT [DF__website_t__displ__01892CED] DEFAULT ((0)),
	[is_active] bit NOT NULL CONSTRAINT [DF__website_t__is_ac__027D5126] DEFAULT ((1)),
	[created_at] datetime2(3) CONSTRAINT [DF__website_t__creat__0371755F] DEFAULT (getdate()),
	[updated_at] datetime2(3),
	CONSTRAINT [PK__website___3213E83F3EA77801] PRIMARY KEY([id])
);
--> statement-breakpoint
ALTER TABLE [audit_log] ADD CONSTRAINT [FK_audit_log_user] FOREIGN KEY ([user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [automation_run_logs] ADD CONSTRAINT [FK_automation_run_logs_rule] FOREIGN KEY ([rule_id]) REFERENCES [automation_rules]([id]);--> statement-breakpoint
ALTER TABLE [campaigns] ADD CONSTRAINT [FK_campaigns_category] FOREIGN KEY ([donation_category_id]) REFERENCES [donation_categories]([id]);--> statement-breakpoint
ALTER TABLE [donor_notes] ADD CONSTRAINT [FK_donor_notes_donor] FOREIGN KEY ([donor_id]) REFERENCES [donors]([id]);--> statement-breakpoint
ALTER TABLE [donor_notes] ADD CONSTRAINT [FK_donor_notes_user] FOREIGN KEY ([created_by_user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [e_challans] ADD CONSTRAINT [FK_e_challans_category] FOREIGN KEY ([category_id]) REFERENCES [donation_categories]([id]);--> statement-breakpoint
ALTER TABLE [e_challans] ADD CONSTRAINT [FK_e_challans_created_by] FOREIGN KEY ([created_by_user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [e_challans] ADD CONSTRAINT [FK_e_challans_donor] FOREIGN KEY ([donor_id]) REFERENCES [donors]([id]);--> statement-breakpoint
ALTER TABLE [e_challans] ADD CONSTRAINT [FK_e_challans_receipt] FOREIGN KEY ([receipt_id]) REFERENCES [receipts]([id]);--> statement-breakpoint
ALTER TABLE [enquiries] ADD CONSTRAINT [FK_enquiries_assigned_to] FOREIGN KEY ([assigned_to_user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [enquiry_replies] ADD CONSTRAINT [FK_enquiry_replies_enquiry] FOREIGN KEY ([enquiry_id]) REFERENCES [enquiries]([id]);--> statement-breakpoint
ALTER TABLE [enquiry_replies] ADD CONSTRAINT [FK_enquiry_replies_user] FOREIGN KEY ([from_user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [export_log] ADD CONSTRAINT [FK_export_log_user] FOREIGN KEY ([user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [receipts] ADD CONSTRAINT [FK_receipts_category] FOREIGN KEY ([category_id]) REFERENCES [donation_categories]([id]);--> statement-breakpoint
ALTER TABLE [receipts] ADD CONSTRAINT [FK_receipts_donor] FOREIGN KEY ([donor_id]) REFERENCES [donors]([id]);--> statement-breakpoint
ALTER TABLE [receipts] ADD CONSTRAINT [FK_receipts_transaction] FOREIGN KEY ([transaction_id]) REFERENCES [transactions]([id]);--> statement-breakpoint
ALTER TABLE [refund_requests] ADD CONSTRAINT [FK_refund_requests_approved_by] FOREIGN KEY ([approved_by_user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [refund_requests] ADD CONSTRAINT [FK_refund_requests_requested_by] FOREIGN KEY ([requested_by_user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [refund_requests] ADD CONSTRAINT [FK_refund_requests_transaction] FOREIGN KEY ([transaction_id]) REFERENCES [transactions]([id]);--> statement-breakpoint
ALTER TABLE [role_permissions] ADD CONSTRAINT [FK_role_permissions_role] FOREIGN KEY ([role_id]) REFERENCES [user_roles]([id]);--> statement-breakpoint
ALTER TABLE [transactions] ADD CONSTRAINT [FK_transactions_campaign] FOREIGN KEY ([campaign_id]) REFERENCES [campaigns]([id]);--> statement-breakpoint
ALTER TABLE [transactions] ADD CONSTRAINT [FK_transactions_category] FOREIGN KEY ([donation_category_id]) REFERENCES [donation_categories]([id]);--> statement-breakpoint
ALTER TABLE [transactions] ADD CONSTRAINT [FK_transactions_donor] FOREIGN KEY ([donor_id]) REFERENCES [donors]([id]);--> statement-breakpoint
ALTER TABLE [transactions] ADD CONSTRAINT [FK_transactions_receipt] FOREIGN KEY ([receipt_id]) REFERENCES [receipts]([id]);--> statement-breakpoint
ALTER TABLE [user_otp] ADD CONSTRAINT [FK_user_otp_user] FOREIGN KEY ([user_id]) REFERENCES [users]([id]);--> statement-breakpoint
ALTER TABLE [users] ADD CONSTRAINT [FK_users_role] FOREIGN KEY ([role_id]) REFERENCES [user_roles]([id]);--> statement-breakpoint
ALTER TABLE [website_page_sections] ADD CONSTRAINT [FK_website_page_sections_page] FOREIGN KEY ([page_id]) REFERENCES [website_pages]([id]);--> statement-breakpoint
CREATE INDEX [IDX_T_EChallan] ON [T_EChallan] ([Donation_Types],[Receipt_Number],[Account_Number],[Name_Of_Donor],[Address],[City],[Pincode],[Mobile_Number],[Email_Id],[Payment_Mode],[Amount],[DD_OR_Cheque_Number],[DD_OR_Cheque_Date],[PANcard_Number],[Receipt_Date]);--> statement-breakpoint
CREATE VIEW [All-PGI-Data638] AS SELECT        Id, Receipt_Number, 
                         CASE Donation_Types WHEN '1' THEN 'General Fund' WHEN '2' THEN 'Education Fund' WHEN '3' THEN 'Building Fund' WHEN '4' THEN 'Medical Fund' WHEN '5' THEN 'Aram Sei Fund' END AS 'Donation Type', 
                         Account_Number, Name_Of_Donor, Address, State_Id, State_Name, Country_Id, Country_Name, City, Pincode, Telephone_Number, Mobile_Number, Email_Id, Payment_Mode, Amount, Amount_In_Words, 
                         DD_OR_Cheque_Number, DD_OR_Cheque_Date, DD_OR_Cheque_BankName, DD_OR_Cheque_Branch, PANcard_Number, Location, Receipt_Date, Is_Active, Created_by, Created_Date, Type, 
                         Transaction_Reference_PGI_Number, Bank_Reference_Number, Transaction_Amount, Bank_Id, Bank_Merchant_Id, Transaction_Type, Auth_Status, Transaction_Date, Auth_Status_Message
FROM            dbo.T_EChallan;
*/