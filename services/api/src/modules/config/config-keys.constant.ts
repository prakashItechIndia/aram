/**
 * Feature/config keys used by admin to enable/disable behaviour.
 * Used for: logic, inputs, UI visibility, SMS, email, and other dependent functionality.
 */
export const CONFIG_KEYS = {
  // Donation form status
  DONATION_FORM_ENABLED: 'donation_form_enabled',
  DONATION_FORM_MAINTENANCE_MESSAGE: 'donation_form_maintenance_message',
  TEST_MODE: 'test_mode',

  // Field configuration
  MULTI_COUNTRY_SUPPORT: 'multi_country_support',
  PAN_REQUIREMENT: 'pan_requirement', // 'always' | 'threshold' | 'optional_international'
  PAN_THRESHOLD_AMOUNT: 'pan_threshold_amount',
  REQUIRE_ADDRESS: 'require_address',
  REQUIRE_MOBILE: 'require_mobile',
  MOBILE_OTP_VERIFICATION: 'mobile_otp_verification',

  // Amount configuration
  PRESET_AMOUNTS: 'preset_amounts', // JSON array e.g. [500, 1000, 2500, 5000]
  MIN_AMOUNT: 'min_amount',
  MAX_AMOUNT: 'max_amount',
  SUGGEST_RECURRING: 'suggest_recurring',

  // Notifications
  SEND_RECEIPT_EMAIL: 'send_receipt_email',
  SEND_RECEIPT_SMS: 'send_receipt_sms',
  SEND_80G_EMAIL: 'send_80g_email',
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];
