// List of ALL available permission keys in your app
const ALL_PERMISSIONS_LIST = [
  // Core
  'dashboard', 'products', 'orders', 'customers', 'deliveryStaff', 'membership', 'profile',
  // Analytics
  'analytics', 'auditLogs', 'reports',
  // Operations
  'userManagement', 'wallet', 'billing', 'notifications', 'contentManagement', 'homepage', 'categoryManagement',
  // Dev/Settings
  'settings', 'helpSupport', 'integrations', 'apiAccess', 'security'
];

export const ROLE_PERMISSIONS = {
  'Super Admin': [...ALL_PERMISSIONS_LIST], // ✨ All permissions
  'Admin': [...ALL_PERMISSIONS_LIST],       // ✨ All permissions
  'PanelUser': [
    'dashboard', 'products', 'orders', 'customers', 'profile', 'categoryManagement'
  ],
  'Customer': [
    'profile'
  ]
};

/**
 * Tries to determine the role name based on a user's permissions array.
 */
export function getRoleFromPermissions(permissions = []) {
  if (!permissions || permissions.length === 0) return 'Customer';

  // Check strict match for Super Admin / Admin (has everything)
  const allCount = ALL_PERMISSIONS_LIST.length;
  // If user has (almost) all permissions, call them Admin
  if (permissions.length >= allCount - 2) { 
      return 'Admin'; 
  }
  
  // If user has specific panel keys
  if (permissions.includes('products') && permissions.includes('orders')) {
    return 'PanelUser';
  }

  return 'PanelUser'; // Default for staff
}