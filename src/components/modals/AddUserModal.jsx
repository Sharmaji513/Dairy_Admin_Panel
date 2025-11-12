import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { UserPlus, X, Check } from "lucide-react";
import { addUserToSystem } from "../../lib/auth";

export function AddUserModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
  });

  const [permissions, setPermissions] = useState({
    // Core
    dashboard: true,
    products: true,
    orders: true,
    customers: true,
    deliveryStaff: false,
    membership: false,
    profile: true,

    // Analytics & Reports
    analytics: false,
    auditLogs: false,
    reports: false,

    // Operations
    userManagement: false,
    wallet: false,
    billing: false,
    notifications: false,
    contentManagement: false,
    homepage: false,

    // Development
    settings: false,
    helpSupport: false,
    integrations: false,
    apiAccess: false,
    security: false,
  });

  const handlePermissionChange = useCallback((key) => {
    setPermissions((prev) => {
      const currentValue = prev[key];
      const newPermissions = { ...prev, [key]: !currentValue };
      console.log(
        "Toggling",
        key,
        "from",
        currentValue,
        "to",
        !currentValue,
      );
      return newPermissions;
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      permissions,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    addUserToSystem(newUser);
    onSave(newUser);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "User",
    });
    setPermissions({
      dashboard: true,
      products: true,
      orders: true,
      customers: true,
      deliveryStaff: false,
      membership: false,
      profile: true,
      analytics: false,
      auditLogs: false,
      reports: false,
      userManagement: false,
      wallet: false,
      billing: false,
      notifications: false,
      contentManagement: false,
      homepage: false,
      settings: false,
      helpSupport: false,
      integrations: false,
      apiAccess: false,
      security: false,
    });
  };

  const PermissionCheckbox = ({ permissionKey, title, description }) => (
    <div className="flex items-start gap-2">
      <Checkbox
        id={permissionKey}
        checked={permissions[permissionKey]}
        onCheckedChange={() => handlePermissionChange(permissionKey)}
        className="mt-0.5 h-4 w-4 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <div className="flex-1">
        <Label
          htmlFor={permissionKey}
          className="cursor-pointer text-xs font-normal leading-tight"
        >
          {title}
        </Label>
        {description && (
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Add a new user to the system</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-medium">Add New User</h2>
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
          <form onSubmit={handleSubmit} id="add-user-form">
            {/* Basic Information */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <Label htmlFor="password" className="text-xs">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label htmlFor="role" className="text-xs">
                  Role
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full text-xs h-9 mt-1 border border-gray-300 rounded-md px-3"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Permissions & Access */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600">
                * Permissions & Access
              </h4>

              {/* Core Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-700 font-semibold min-w-[180px]">
                    Core
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <PermissionCheckbox
                    permissionKey="dashboard"
                    title="Dashboard"
                    description="Main overview and metrics"
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
                    permissionKey="membership"
                    title="Membership"
                    description="Membership tiers"
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
                  <span className="text-xs text-gray-700 font-semibold min-w-[180px]">
                    Analytics & Reports
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
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
                  <PermissionCheckbox
                    permissionKey="reports"
                    title="Reports"
                    description="View and generate reports"
                  />
                </div>
              </div>

              {/* Operations Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-700 font-semibold min-w-[180px]">
                    Operations
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <PermissionCheckbox
                    permissionKey="userManagement"
                    title="User Management"
                    description="Manage users and permissions"
                  />
                  <PermissionCheckbox
                    permissionKey="wallet"
                    title="Wallet"
                    description="Wallet management"
                  />
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
                  <PermissionCheckbox
                    permissionKey="homepage"
                    title="Homepage"
                    description="Homepage management"
                  />
                </div>
              </div>

              {/* Development Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-700 font-semibold min-w-[180px]">
                    Development
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <PermissionCheckbox
                    permissionKey="settings"
                    title="Settings"
                    description="System configuration"
                  />
                  <PermissionCheckbox
                    permissionKey="helpSupport"
                    title="Help & Support"
                    description="Help and support access"
                  />
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
            form="add-user-form"
            className="bg-blue-600 hover:bg-blue-700 h-9 text-xs px-4"
          >
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}