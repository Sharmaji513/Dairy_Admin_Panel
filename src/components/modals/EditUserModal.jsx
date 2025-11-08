import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Check } from 'lucide-react';

export function EditUserModal({ open, onClose, onSave, user }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [permissions, setPermissions] = useState({
    // Core
    dashboard: true,
    settings: false,
    userManagement: false,
    homepage: false,
    reports: false,
    products: true,
    orders: true,
    customers: true,
    deliveryStaff: false,
    branches: false,
    profile: true,
    
    // Analytics & Reports
    analytics: false,
    auditLogs: false,
    
    // Operations
    billing: false,
    notifications: false,
    contentManagement: false,
    
    // Development
    integrations: false,
    apiAccess: false,
    security: false,
  });

  useEffect(() => {
    if (open) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
      const initialPermissions = user.permissions || {
        // Core
        dashboard: true,
        settings: false,
        userManagement: false,
        homepage: false,
        reports: false,
        products: true,
        orders: true,
        customers: true,
        deliveryStaff: false,
        branches: false,
        profile: true,
        
        // Analytics & Reports
        analytics: false,
        auditLogs: false,
        
        // Operations
        billing: false,
        notifications: false,
        contentManagement: false,
        
        // Development
        integrations: false,
        apiAccess: false,
        security: false,
      };
      setPermissions(initialPermissions);
      console.log('EditUserModal opened. Initial permissions:', initialPermissions);
    }
  }, [open, user]);

  // Accept an optional `checked` value from the Checkbox `onCheckedChange` handler.
  // If `checked` is provided use it, otherwise toggle based on previous state.
  const handlePermissionChange = useCallback((key, checked) => {
    setPermissions(prev => {
      console.log('handlePermissionChange: previous permissions', prev);
      const newValue = typeof checked === 'boolean' ? checked : !prev[key];
      const newPermissions = { ...prev, [key]: newValue };
      console.log('handlePermissionChange: Setting', key, 'to', newValue, 'New permissions:', newPermissions);
      return newPermissions;
    });
  }, []);

  const handleSave = () => {
    if (!name || !email) {
      alert('Please fill all required fields');
      return;
    }

    onSave({
      ...user,
      name,
      email,
      role,
      status,
      permissions,
    });
    onClose();
  };

  const PermissionCheckbox = ({ 
    permissionKey, 
    title, 
    description 
  }) => {
    const isChecked = permissions[permissionKey] === true;
    console.log('PermissionCheckbox:', permissionKey, 'isChecked:', isChecked, 'Current permissions state:', permissions);
    
    return (
      <div className="flex items-start gap-2">
        <Checkbox
          id={`edit-permission-${permissionKey}`}
          checked={isChecked}
          onCheckedChange={(checked) => handlePermissionChange(permissionKey, checked)}
          className="border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5"
        />
        <label
          htmlFor={`edit-permission-${permissionKey}`}
          className="cursor-pointer flex-1 select-none"
        >
          <div className="text-xs font-medium">{title}</div>
          <div className="text-[10px] text-muted-foreground">{description}</div>
        </label>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription className="sr-only">Edit user details and permissions</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Full Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissions & Access Section */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-xs font-medium text-red-600">* Permissions & Access</Label>

            {/* Core Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">Core</span>
              </div>
              <div className="grid grid-cols-2 gap-3 ml-5">
                <PermissionCheckbox 
                  permissionKey="dashboard"
                  title="Dashboard"
                  description="Main overview and metrics"
                />
                <PermissionCheckbox 
                  permissionKey="settings"
                  title="Settings"
                  description="System configuration"
                />
                <PermissionCheckbox 
                  permissionKey="userManagement"
                  title="User Management"
                  description="Manage users and permissions"
                />
                <PermissionCheckbox 
                  permissionKey="homepage"
                  title="Homepage"
                  description="Homepage management"
                />
                <PermissionCheckbox 
                  permissionKey="reports"
                  title="Reports"
                  description="View and generate reports"
                />
                <PermissionCheckbox 
                  permissionKey="products"
                  title="Products"
                  description="Product management"
                />
                <PermissionCheckbox 
                  permissionKey="orders"
                  title="Orders"
                  description="Order management"
                />
                <PermissionCheckbox 
                  permissionKey="customers"
                  title="Customers"
                  description="Customer management"
                />
                <PermissionCheckbox 
                  permissionKey="deliveryStaff"
                  title="Delivery Staff"
                  description="Staff management"
                />
                <PermissionCheckbox 
                  permissionKey="branches"
                  title="Branches"
                  description="Branch management"
                />
                <PermissionCheckbox 
                  permissionKey="profile"
                  title="Profile"
                  description="User profile access"
                />
              </div>
            </div>

            {/* Analytics & Reports Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">Analytics & Reports</span>
              </div>
              <div className="grid grid-cols-2 gap-3 ml-5">
                <PermissionCheckbox 
                  permissionKey="analytics"
                  title="Analytics"
                  description="Advanced analytics dashboard"
                />
                <PermissionCheckbox 
                  permissionKey="auditLogs"
                  title="Audit Logs"
                  description="System audit trails"
                />
              </div>
            </div>

            {/* Operations Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">Operations</span>
              </div>
              <div className="grid grid-cols-2 gap-3 ml-5">
                <PermissionCheckbox 
                  permissionKey="billing"
                  title="Billing"
                  description="Payment and subscription management"
                />
                <PermissionCheckbox 
                  permissionKey="notifications"
                  title="Notifications"
                  description="Email and push notifications"
                />
                <PermissionCheckbox 
                  permissionKey="contentManagement"
                  title="Content Management"
                  description="Content creation and editing"
                />
              </div>
            </div>

            {/* Development Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">Development</span>
              </div>
              <div className="grid grid-cols-2 gap-3 ml-5">
                <PermissionCheckbox 
                  permissionKey="integrations"
                  title="Integrations"
                  description="Third party integrations"
                />
                <PermissionCheckbox 
                  permissionKey="apiAccess"
                  title="Api Access"
                  description="API keys and documentation"
                />
                <PermissionCheckbox 
                  permissionKey="security"
                  title="Security"
                  description="Security settings and logs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}