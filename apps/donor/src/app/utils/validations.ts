/**
 * Global validation utilities for reusable form validations
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  pattern?: string;
  custom?: string;
}

/**
 * Validates a field value against given rules
 */
export const validateField = (
  value: string,
  rules: ValidationRule,
  messages: ValidationMessages = {}
): string | null => {
  const trimmedValue = value.trim();

  // Required validation
  if (rules.required && !trimmedValue) {
    return messages.required || 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!trimmedValue && !rules.required) {
    return null;
  }

  // Length validations
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return messages.minLength || `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return messages.maxLength || `Maximum length is ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return messages.pattern || 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(trimmedValue);
    if (customError) {
      return messages.custom || customError;
    }
  }

  return null;
};

/**
 * Input sanitization functions for real-time validation
 */
export const sanitizeInput = {
  name: (value: string): string => {
    // Allow only alphabets and spaces, max 150 characters
    return value
      .replace(/[^A-Za-z\s]/g, '') // Remove non-alphabetic characters
      .slice(0, 150); // Limit to 150 characters
  },

  mobile: (value: string, country?: string): string => {
    const config = country && countryPhoneConfigs[country] ? countryPhoneConfigs[country] : countryPhoneConfigs.india;
    return value
      .replace(/[^0-9]/g, '') // Remove non-numeric characters
      .slice(0, config.maxLength); // Limit based on country
  },

  panNumber: (value: string): string => {
    // Allow only alphanumeric, auto-uppercase, max 10 characters
    return value
      .replace(/[^A-Za-z0-9]/g, '') // Remove non-alphanumeric characters
      .toUpperCase()
      .slice(0, 10); // Limit to 10 characters
  },

  email: (value: string): string => {
    // Basic email sanitization - allow common email characters
    return value
      .replace(/[^A-Za-z0-9@._-]/g, '') // Remove invalid email characters
      .slice(0, 254); // Standard email max length
  },
};

/**
 * Pre-defined validation rules for common fields
 */
export const validationRules = {
  name: {
    required: true,
    maxLength: 150,
    pattern: /^[A-Za-z\s]+$/,
  },

  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  mobile: {
    required: true,
    pattern: /^\d{10}$/,
  },

  panNumber: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  },

  address: {
    required: true,
  },

  amount: {
    required: true,
    custom: (value: string) => {
      const num = Number(value);
      if (isNaN(num)) return 'Invalid amount';
      if (num < 100) return 'Minimum donation amount is ₹100';
      if (num > 50000) return 'Maximum donation amount is ₹50000';
      return null;
    },
  },

  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
  },

  emailOrPhone: {
    required: true,
    custom: (value: string) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^\d{10}$/.test(value);
      if (!isEmail && !isPhone) return 'Enter a valid email or 10-digit phone number';
      return null;
    }
  }
};

/**
 * Pre-defined validation messages
 */
export const validationMessages = {
  name: {
    required: 'Name is required',
    maxLength: 'Name cannot exceed 150 characters',
    pattern: 'Name can only contain alphabets and spaces',
  },

  email: {
    required: 'Email is required',
    pattern: 'Invalid email format',
  },

  mobile: {
    required: 'Mobile number is required',
    pattern: 'Mobile must be exactly 10 digits',
  },

  panNumber: {
    required: 'PAN number is required',
    pattern: 'Invalid PAN format (e.g., AAAAA0000A)',
  },

  address: {
    required: 'Address is required',
  },

  amount: {
    required: 'Amount is required',
  },

  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
    pattern: 'Password must contain: uppercase letter, number, and special character',
  },

  emailOrPhone: {
    required: 'Email or phone is required',
  }
};

/**
 * Country-specific phone configurations
 */
export const countryPhoneConfigs: Record<string, { prefix: string; pattern: RegExp; message: string; maxLength: number }> = {
  india: {
    prefix: '+91',
    pattern: /^[6-9]\d{9}$/,
    message: 'India mobile must be 10 digits starting with 6-9',
    maxLength: 10,
  },
  usa: {
    prefix: '+1',
    pattern: /^\d{10}$/,
    message: 'USA mobile must be 10 digits',
    maxLength: 10,
  },
  canada: {
    prefix: '+1',
    pattern: /^\d{10}$/,
    message: 'Canada mobile must be 10 digits',
    maxLength: 10,
  },
  uk: {
    prefix: '+44',
    pattern: /^\d{10,11}$/,
    message: 'UK mobile must be 10-11 digits',
    maxLength: 11,
  },
};

/**
 * Gets mobile validation rules based on country
 */
export const getMobileValidation = (country: string): ValidationRule => {
  const config = country && countryPhoneConfigs[country] ? countryPhoneConfigs[country] : countryPhoneConfigs.india;
  return {
    required: true,
    pattern: config.pattern,
    custom: (value: string) => {
      if (!config.pattern.test(value)) return config.message;
      return null;
    },
  };
};

/**
 * Validates an entire form object
 */
export const validateForm = (
  formData: Record<string, string>,
  fieldRules: Record<string, ValidationRule>,
  fieldMessages: Record<string, ValidationMessages> = {}
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(fieldRules).forEach((field) => {
    const error = validateField(
      formData[field],
      fieldRules[field],
      fieldMessages[field] || {}
    );
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

