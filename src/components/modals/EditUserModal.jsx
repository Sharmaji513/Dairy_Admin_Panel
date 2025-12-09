import { useState, useEffect, useCallback } from "react";
import { Check, Power } from "lucide-react";
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
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // ✨ NO 'SelectPortal' here
import { ROLE_PERMISSIONS, getRoleFromPermissions } from "../../lib/rolePermissions";

// Custom Toggle for Active Status
function CustomToggle({ label, checked, onChange, activeColor = "bg-green-500" }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`
        flex items-center justify-between w-full p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
        ${checked ? `border-${activeColor.split('-')[1]}-200 bg-${activeColor.split('-')[1]}-50` : 'border-gray-200 bg-white hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          h-8 w-8 rounded-full flex items-center justify-center transition-colors
          ${checked ? `bg-white text-${activeColor.split('-')[1]}-600 shadow-sm` : 'bg-gray-100 text-gray-400'}
        `}>
          {checked ? <Check className="h-4 w-4" /> : <Power className="h-4 w-4" />}
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      
      <div className={`
        w-9 h-5 rounded-full transition-colors relative
        ${checked ? activeColor : 'bg-gray-300'}
      `}>
        <div className={`
          absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow transition-transform duration-200
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `} />
      </div>
    </div>
  );
}

export function EditUserModal({ open, onOpenChange, onSave, user }) {
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState("PanelUser");
  
  const [permissions, setPermissions] = useState({
    dashboard: false, products: false, categoryManagement: false, orders: false, customers: false,
    userManagement: false, settings: false, reports: false, 
  });

  useEffect(() => {
    if (user) {
      const userIsActive = user.isActive === true || (user.status && user.status.toLowerCase() === 'active');
      setIsActive(userIsActive);
      
      const userRole = getRoleFromPermissions(user.permissions);
      setRole(userRole);
      
      const userPerms = user.permissions || [];
      setPermissions(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] = userPerms.includes(key);
        });
        return next;
      });
    }
  }, [user, open]);

  const handlePermissionChange = useCallback((key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPermissionsArray = Object.keys(permissions).filter(key => permissions[key]);
    const newRole = getRoleFromPermissions(newPermissionsArray);

    const updatedData = {
      id: user.id,
      permissions: newPermissionsArray,
      isActive: isActive,
      role: newRole, 
      status: isActive ? 'active' : 'inactive' 
    };

    onSave(updatedData);
    onOpenChange(false);
  };

  const PermissionCheckbox = ({ permissionKey, title }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={permissionKey}
        checked={permissions[permissionKey]}
        onCheckedChange={() => handlePermissionChange(permissionKey)}
        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <Label htmlFor={permissionKey} className="text-sm font-normal cursor-pointer">{title}</Label>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white flex flex-col max-h-[90vh] p-0 gap-0 block overflow-y-auto">
        
        <DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10">
          <DialogTitle className="text-base font-medium">Edit User</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">{user?.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Read-only fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name</Label><Input value={user?.firstName || user?.name?.split(' ')[0] || ''} disabled className="bg-gray-50" /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input value={user?.lastName || user?.name?.split(' ').slice(1).join(' ') || ''} disabled className="bg-gray-50" /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ''} disabled className="bg-gray-50" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={user?.phone || ''} disabled className="bg-gray-50" /></div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Role & Permissions</Label>
              
              <div className="mb-3">
                 <Select value={role} onValueChange={(val) => {
                    setRole(val);
                    const rolePerms = ROLE_PERMISSIONS[val] || [];
                    setPermissions(prev => {
                      const next = { ...prev };
                      Object.keys(next).forEach(k => next[k] = rolePerms.includes(k));
                      return next;
                    });
                 }}>
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

              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
                <PermissionCheckbox permissionKey="dashboard" title="Dashboard" />
                <PermissionCheckbox permissionKey="products" title="Products" />
                {/* ✨ ADDED: Category Management permission */}
                <PermissionCheckbox permissionKey="categoryManagement" title="Category Management" />
                <PermissionCheckbox permissionKey="orders" title="Orders" />
                <PermissionCheckbox permissionKey="customers" title="Customers" />
                <PermissionCheckbox permissionKey="userManagement" title="User Management" />
              </div>
            </div>

            {/* ✨ FIXED: Visible Toggle Button */}
            <CustomToggle 
              label={isActive ? "User is Active" : "User is Inactive"} 
              checked={isActive} 
              onChange={setIsActive} 
            />
            
            <div className="pt-4 border-t flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
               <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}