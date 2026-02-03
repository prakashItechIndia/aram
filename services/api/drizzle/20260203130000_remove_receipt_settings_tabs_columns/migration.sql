-- Remove columns for dropped Receipt Management tabs:
-- Storage & Access, Bulk Operations, Status Workflow, Audit & Compliance, Search Defaults

ALTER TABLE [receipt_settings] DROP COLUMN
  [storage_mode],
  [link_security],
  [link_expiry_days],
  [allow_regeneration_template],
  [allow_regeneration_anytime],
  [bulk_generation_allowed],
  [max_batch_size],
  [zip_filename_format],
  [include_index_csv],
  [run_in_background],
  [allow_mark_reissued],
  [auto_mark_delivered],
  [retention_years],
  [default_date_filter],
  [default_page_size],
  [export_formats_csv],
  [export_formats_excel],
  [export_formats_pdf],
  [mask_pii];
