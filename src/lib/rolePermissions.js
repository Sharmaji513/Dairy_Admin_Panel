export const ROLE_PERMISSIONS = {
  Admin: [
    'dashboard', 'products', 'orders', 'customers', 'deliveryStaff', 
    'membership', 'profile', 'analytics', 'auditLogs', 'reports', 
    'userManagement', 'wallet', 'billing', 'notifications', 
    'contentManagement', 'homepage', 'settings', 'helpSupport', 
    'integrations', 'apiAccess', 'security'
  ],
  PanelUser: [
    'dashboard', 'products', 'orders', 'customers', 'profile'
  ],
  // 'Customer' role is typically for the front-end app, 
  // but if you want to create a very restricted panel user:
  Customer: [
    'profile'
  ]
};

/**
 * Tries to determine the role name based on a user's permissions array.
 */
export function getRoleFromPermissions(permissions = []) {
  if (!permissions || permissions.length === 0) return 'Customer';

  const adminPerms = ROLE_PERMISSIONS.Admin;
  // If user has all admin permissions
  if (adminPerms.every(p => permissions.includes(p))) {
    return 'Admin';
  }
  
  const panelUserPerms = ROLE_PERMISSIONS.PanelUser;
  // If user has all PanelUser permissions (and possibly more, but not all Admin)
  if (panelUserPerms.every(p => permissions.includes(p))) {
    return 'PanelUser';
  }

  return 'Customer';
}