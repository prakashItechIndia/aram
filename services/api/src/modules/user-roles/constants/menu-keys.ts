/**
 * Menu/screen keys for page-wise permissions. Must match frontend and sidebar.
 */
export const MENU_KEYS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'donations', label: 'Donations' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'donors', label: 'Donors' },
  { key: 'reports', label: 'Reports' },
  { key: 'user_management', label: 'User Management' },
  { key: 'settings', label: 'Settings' },
] as const;

export const DEFAULT_ROLES = [
  { name: 'Super Admin', description: 'Full system access with all permissions' },
  { name: 'Admin', description: 'Administrative access with limited restrictions' },
  { name: 'Finance Manager', description: 'Financial operations and reporting access' },
  { name: 'Operator', description: 'Basic operational access for daily tasks' },
] as const;
