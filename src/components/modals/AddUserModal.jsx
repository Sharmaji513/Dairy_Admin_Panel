import { useState, useCallback, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // ✨ NO 'SelectPortal' here
import { Checkbox } from "../ui/checkbox";
import { ROLE_PERMISSIONS } from "../../lib/rolePermissions";

export function AddUserModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "PanelUser",
  });

  // Initial permissions state
  const [permissions, setPermissions] = useState({
    dashboard: false, products: false, categoryManagement: false, orders: false, customers: false,
    deliveryStaff: false, membership: false, profile: false, analytics: false,
    auditLogs: false, reports: false, userManagement: false, wallet: false,
    billing: false, notifications: false, contentManagement: false,
    homepage: false, settings: false, helpSupport: false, integrations: false,
    apiAccess: false, security: false,
  });

  // Update permissions when role changes
  useEffect(() => {
    const rolePerms = ROLE_PERMISSIONS[formData.role] || [];
    setPermissions(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = rolePerms.includes(key);
      });
      return next;
    });
  }, [formData.role]);

  const handlePermissionChange = useCallback((key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const permissionsArray = Object.keys(permissions).filter(key => permissions[key]);

    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      permissions: permissionsArray,
      role: "PanelUser", 
      isActive: true
    };

    onSave(newUser);
    onOpenChange(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "PanelUser" });
  };

  const PermissionCheckbox = ({ permissionKey, title }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={permissionKey}
        checked={permissions[permissionKey]}
        onCheckedChange={() => handlePermissionChange(permissionKey)}
        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <Label htmlFor={permissionKey} className="text-sm font-normal cursor-pointer">
        {title}
      </Label>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white flex flex-col max-h-[90vh] p-0 gap-0 block overflow-y-auto">
        
        <DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10">
          <DialogTitle className="text-base font-medium">Add New User</DialogTitle>
          <DialogDescription className="sr-only">Create a new user.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required /></div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => {console.log('Selected Role:', value); setFormData({ ...formData, role: value });}}>
                <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                {/* ✨ FIX: Z-Index [9999] makes it clickable */}
                <SelectContent className="z-[9999]">
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="PanelUser">Panel User</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Permissions</Label>
              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
                <PermissionCheckbox permissionKey="dashboard" title="Dashboard" />
                <PermissionCheckbox permissionKey="products" title="Products" />
                {/* ✨ ADDED: Category Management permission */}
                <PermissionCheckbox permissionKey="categoryManagement" title="Category Management" />
                <PermissionCheckbox permissionKey="orders" title="Orders" />
                <PermissionCheckbox permissionKey="customers" title="Customers" />
                <PermissionCheckbox permissionKey="userManagement" title="User Management" />
                <PermissionCheckbox permissionKey="settings" title="Settings" />
                <PermissionCheckbox permissionKey="reports" title="Reports" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}