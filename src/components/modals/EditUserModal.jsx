import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { updateUserInSystem } from '../../lib/auth'; // Removed AuthUser import

// Removed EditUserModalProps interface
// Removed Permission interface

export function EditUserModal({ open, onOpenChange, onSave, user }) { // Removed props type
  const [formData, setFormData] = useState({ // Removed <Partial<AuthUser>>
    name: '',
    email: '',
    role: 'User',
    status: 'active',
  });

  const [permissions, setPermissions] = useState([ // Removed <Permission[]>
    // Core section
    { id: 'dashboard', label: 'Dashboard', description: 'Main overview and metrics', checked: false },
    { id: 'products', label: 'Products', description: 'Product management', checked: false },
    { id: 'orders', label: 'Orders', description: 'Order management', checked: false },
    { id: 'customers', label: 'Customers', description: 'Customer management', checked: false },
    { id: 'delivery-staff', label: 'Delivery Staff', description: 'Staff management', checked: false },
    { id: 'membership', label: 'Membership', description: 'Membership tiers', checked: false },
    { id: 'profile', label: 'Profile', description: 'User profile access', checked: false },
    
    // Analytics & Reports section
    { id: 'analytics', label: 'Analytics', description: 'Advanced analytics dashboard', checked: false },
    { id: 'audit-logs', label: 'Audit Logs', description: 'System audit trails', checked: false },
    { id: 'reports', label: 'Reports', description: 'View and generate reports', checked: false },
    
    // Operations section
    { id: 'user-management', label: 'User Management', description: 'Manage users and permissions', checked: false },
    { id: 'wallet', label: 'Wallet', description: 'Wallet management', checked: false },
    { id: 'billing', label: 'Billing', description: 'Payment and subscription management', checked: false },
    { id: 'notifications', label: 'Notifications', description: 'Email and push notifications', checked: false },
    { id: 'content-management', label: 'Content Management', description: 'Content creation and editing', checked: false },
    { id: 'homepage', label: 'Homepage', description: 'Homepage management', checked: false },
    
    // Development section
    { id: 'settings', label: 'Settings', description: 'System configuration', checked: false },
    { id: 'help-support', label: 'Help & Support', description: 'Help and support access', checked: false },
    { id: 'integrations', label: 'Integrations', description: 'Third party integrations', checked: false },
    { id: 'api-access', label: 'Api Access', description: 'API keys and documentation', checked: false },
    { id: 'security', label: 'Security', description: 'Security settings and logs', checked: false },
  ]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || 'active',
      });

      // Set some default permissions based on role
      const defaultPermissions = [...permissions];
      if (user.role === 'Super Admin' || user.role === 'Admin') {
        // Admins get all permissions
        defaultPermissions.forEach(p => p.checked = true);
      } else {
        // Regular users get basic permissions
        defaultPermissions.forEach(p => {
          p.checked = ['dashboard', 'orders', 'products', 'customers', 'profile'].includes(p.id);
        });
      }
      setPermissions(defaultPermissions);
    }
  }, [user, open]);

  const handleSubmit = (e) => { // Removed : React.FormEvent
    e.preventDefault();
    if (user) {
      const updatedUser = { // Removed : AuthUser
        ...user,
        ...formData,
        name: formData.name, // Removed !
        email: formData.email, // Removed !
        role: formData.role, // Removed !
        status: formData.status || 'active',
      };
      
      updateUserInSystem(user.id, formData);
      onSave(updatedUser);
      onOpenChange(false);
    }
  };

  const handlePermissionToggle = (id) => { // Removed : string
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const categoryPermissions = [
    { 
      category: 'Core', 
      items: ['dashboard', 'products', 'orders', 'customers', 'delivery-staff', 'membership', 'profile'] 
    },
    { 
      category: 'Analytics & Reports', 
      items: ['analytics', 'audit-logs', 'reports'] 
    },
    { 
      category: 'Operations', 
      items: ['user-management', 'wallet', 'billing', 'notifications', 'content-management', 'homepage'] 
    },
    { 
      category: 'Development', 
      items: ['settings', 'help-support', 'integrations', 'api-access', 'security'] 
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user information and permissions</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-medium">Edit User</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form onSubmit={handleSubmit} id="edit-user-form">
            {/* Full Name and Email */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-normal">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-normal">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-normal">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin" className="text-xs">Super Admin</SelectItem>
                    <SelectItem value="Admin" className="text-xs">Admin</SelectItem>
                    <SelectItem value="Manager" className="text-xs">Manager</SelectItem>
                    <SelectItem value="Staff" className="text-xs">Staff</SelectItem>
                    <SelectItem value="User" className="text-xs">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-normal">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="text-xs">Active</SelectItem>
                    <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-3 mt-5">
              <Label className="text-xs font-normal text-red-500">* Permissions & Access</Label>
              
              <div className="space-y-4">
                {categoryPermissions.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    {category.category && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-700 font-semibold min-w-[180px]">{category.category}</p>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      {category.items.map((itemId) => {
                        const permission = permissions.find(p => p.id === itemId);
                        if (!permission) return null;
                        
                        return (
                          <div key={permission.id} className="flex items-start gap-2">
                            <Checkbox
                              id={permission.id}
                              checked={permission.checked}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                              className="mt-0.5 h-4 w-4 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={permission.id}
                                className="cursor-pointer text-xs font-normal leading-tight"
                              >
                                {permission.label}
                              </Label>
                              {permission.description && (
                                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 text-xs px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            className="bg-blue-600 hover:bg-blue-700 h-9 text-xs px-4"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}