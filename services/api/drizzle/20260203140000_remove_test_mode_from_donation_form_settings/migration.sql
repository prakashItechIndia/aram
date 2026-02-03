-- Remove Test Mode from donation form settings (UI and API removed)

ALTER TABLE [donation_form_settings] DROP COLUMN [test_mode];
