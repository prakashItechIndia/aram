import { type TranslationType } from './en';

const de = {
  DIALOG: {
    ACCOUNT_DELETE: {
      TITLE: 'Are you absolutely sure?',
      PARENT_TRIGGER_BUTTON: 'Delete account',
      CANCEL_ACTION: 'Cancel',
      DELETE_ACTION: 'Delete account',
      TOAST: {
        SUCCESS: 'Account Deleted!',
      },
      DESCRIPTION:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    },

    LOGOUT: {
      TITLE: 'Would you like to logout?',
      PARENT_TRIGGER_BUTTON: 'Sign Out',
      CANCEL_ACTION: 'Cancel',
      LOGOUT_ACTION: 'Logout',
      TOAST: {
        SUCCESS: `You've been logged out`,
      },
      DESCRIPTION: 'This will terminate your current session. Are you sure?',
    },

    TAX_COMPLETE: {
      TITLE: 'Are you sure you want to mark this tax authority complete?',
      DESCRIPTION:
        'Notification emails will be sent out to each lender with a loan in that tax authority.',
      COMPLETE_ACTION: 'Yes, Complete',
      TOAST: {
        SUCCESS: 'Tax Authority marked as completed!',
      },
    },

    DELETE_PROFILE_PICTURE: {
      TITLE: 'Profilbild löschen?',
      DESCRIPTION:
        'Dadurch wird das Profilbild dauerhaft gelöscht. Möchten Sie wirklich fortfahren?',
      CANCEL_ACTION: 'Abbrechen',
      DELETE_ACTION: 'Löschen',
      TOAST: {
        SUCCESS: 'Profilbild erfolgreich gelöscht',
      },
    },
  },
  COMMON: {
    LOADING: {
      PLEASE_WAIT: 'Please wait...',
    },
    TOAST: {
      SUBMIT_SUCCESS: 'Submitted successfully!',
      ERROR_PREFIX: 'Error',
      SOMETHING_WENT_WRONG: 'Something went wrong! Please try again',
    },
    Invox: 'Invox',
    TERMS: 'Terms',
    PRIVACY: 'Privacy',
    RESULTS: 'Results',
    ADD_NEW: 'Add New',
    FILTER: 'Filter',
    SEARCH: 'Search',
    EDIT: 'Edit',
    DELETE: 'Delete',
    EXPORT: 'Export',
    DOWNLOAD_TEMPLATE: 'Download Template',
    SAVE: 'Save',
    VIEW_RESEARCH: 'View Research',
    MARK_TAX_AUTHOTITY_COMPLETE: 'Mark Tax Authority Complete',
    ADD: 'Add',
    CANCEL: 'Cancel',
    VIEW: 'View',
    DETAILS: 'Details',
    SELECT: 'Select',
    ERRORS: 'Errors',
    CONTINUE: 'Continue',
  },
  SET_PASSWORD: {
    TOAST: {
      SUCCESS: 'Password created successfully!',
    },
    TITLE: 'Create New Password',
    DESCRIPTION: 'Please enter a new password for your account.',
    NEW_PASSWORD: 'New Password',
    CONFIRM_PASSWORD: 'Retype New Password',
    SUBMIT: 'Set New Password',
    PASSWORD: 'Password',
    BACK_TO_LOGIN: 'Back to Login',
    PASSWORD_VALIDATION: {
      TITLE: 'Password must contain ',
      AT_LEAST_8_CHARACTERS: 'at least 8 characters long',
      AT_LEAST_1_UPPERCASE: 'at least one uppercase letter',
      AT_LEAST_1_LOWERCASE: 'at least one lowercase letter',
      AT_LEAST_1_NUMBER: 'at least one digit',
      AT_LEAST_1_SPECIAL_CHARACTER:
        'at least one special character like @$!%*?&',
    },
  },
  LOGIN: {
    TOAST: {
      SUCCESS: 'Welcome back! Login successful.',
      EMAIL_NOT_FOUND: 'No account found. Contact your admin.',
    },
    TITLE: 'Streamline Invoice Processing with AI-Driven Automation.',
    SUB_TITLE:
      'Eliminate manual effort with smart document processing. Capture, organise, and retrieve data seamlessly—boosting productivity and accuracy.',
    USERNAME: 'Username',
    PASSWORD: 'Password',
    LOGIN: 'Login',
    FORGOT_PASSWORD: 'Forgot Password',
    SEND_RESET_LINK: 'Send me a reset link',
    BANNER_TITLE: 'Welcome to {{tenant}}',
    BANNER_DESCRIPTION:
      'Sign in to access intelligent document processing, enhanced security, and seamless workflow automation.',
    BANNER_IMAGE_ALT: 'Banner Image Alt Text',
    LOGO_ALT: 'Logo Alt Text',
    BRAND: 'iCaptur',
    CONTINUE_AGREE: 'By continuing, you agree to our',
    TERMS: 'Terms of Service',
    AND: 'and',
    PRIVACY: 'Privacy Policy',
    FORGOT_PASSWORD_QUESTION: 'Forgot your password?',
    NEED_HELP: 'Need help?',
    CONTACT_SUPPORT: 'Contact Support',
    ALL_RIGHTS_RESERVED: 'All Rights Reserved',
    POWERED_BY: 'Powered By',
    POWERED_BY_ALT: 'Powered By Alt Text',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Forgot Password',
    DESCRIPTION:
      'Enter your registered email to receive a link to reset password',
    EMAIL: 'Email Address',
    SUBMIT: 'Send Reset Password',
    BACK_TO_LOGIN: 'Back to Login',
    TOAST: {
      SUCCESS: 'Password reset link sent to your email.',
    },
  },
  RESET_PASSWORD: {
    TRIGGER_BUTTON: 'Reset Password',
    TITLE: 'Reset Your Password',
    DESCRIPTION: 'Your new password must be different from previous one.',
    NEW_PASSWORD: 'New Password',
    CONFIRM_PASSWORD: 'Confirm New Password',
    SUBMIT: 'Reset Password',
    BACK_TO_LOGIN: 'Back to Login',
    INVALID_TOKEN: 'Invalid or expired reset token',
    TOKEN_EXPIRED:
      'This password reset link has expired. Please request a new one.',
    TOAST: {
      SUCCESS: 'Password reset successfully!',
    },
  },
  CHANGE_PASSWORD: {
    TRIGGER_BUTTON: 'Change Password',
    TITLE: 'Change Password',
    DESCRIPTION: 'Your new password must be different from previous one.',
    CURRENT_PASSWORD: 'Current Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    SUBMIT: 'Change Password',
    TOAST: {
      SUCCESS:
        'Password changed successfully. All sessions have been logged out.',
    },
  },
  NAVBAR: {
    DASHBOARD: 'Dashboard',
    USERS: 'Users',
    ORGANIZATIONS: 'Organization',
    LOGS: 'Log Report',
    SERVICES: 'Services',
  },
  TOP_NAVBAR: {
    DASHBOARD: 'Dashboard',
    USERS: 'Users',
    SETTINGS: 'Settings',
    HELP: 'Help',
  },
  SETTINGS: {
    TITLE: 'Settings',
    PROFILE: 'Profile',
  },
  USERS: {
    TOAST: {
      ADD_SUCCESS: 'User registered successfully!',
      UPDATE_SUCCESS: 'User updated successfully!',
    },
    TITLE: 'Manage Users',
    ADD_USER_TITLE: 'Add User',
    FETCH_NEXT_PAGE: 'CLICK OR SCROLL DOWN to Load More',
    NO_MORE: 'No More',
    SEARCH_PLACEHOLDER: 'Search',
    USER: 'User',
    ADD_USER: {
      FIRST_NAME: 'First Name',
      LAST_NAME: 'Last Name',
      EMAIL_ADDRESS: 'Email Address',
      PHONE_NUMBER: 'Phone #',
      USER_TYPE: 'User Type',
      READ_ONLY: 'Read Only',
      SUBMIT: 'Add',
      EDIT_SUBMIT: 'Save Changes',
      CANCEL: 'Cancel',
    },
    NO_DATA_TITLE: 'No users found',
  },
  CONTACT: {
    TITLE: 'Contact/Help',
    NAME: 'Invox Client Services',
    EMAIL: 'info@Invox.com',
    PHONE: '000-111-000',
  },
  PROFILE: { CHANGE_IMAGE: 'Change Image' },
  SERVICES: {
    SIDE_MENUS: {
      DOCUMENTS: 'Documents',
      CAD_DRAWINGS: 'CAD Drawings',
      EOB: 'EOB',
      LOGS: 'Logs',
      EOB_EXTRACTION: 'EOB Extraktion',
      '3D_MODELS': '3D Modelle',
      LOGISTICS: 'Logistik',
      RECRUITMENT: 'Personalbeschaffung',
      HEALTHCARE: 'Gesundheitswesen',
      FORM_IDENTITY: 'Formular & Identität',
      FINANCE: 'Finanzen',
    },
  },
} satisfies TranslationType;
export default de;
