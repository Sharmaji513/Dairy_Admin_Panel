import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// Assuming these UI components are available from paths relative to this file
// If they are from a library like shadcn/ui, the imports would be different,
// e.g., import { Dialog } from '@/components/ui/dialog';
// Since the original path was '../ui/dialog', I will keep that structure.
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function EditMembershipModal({ isOpen, onClose, onEditMembership, customer }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membership: 'Bronze',
    status: 'active',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        membership: customer.membership || 'Bronze',
        status: customer.status || 'active',
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customer) {
      const updatedMembership = {
        ...customer,
        ...formData,
      };
      onEditMembership(updatedMembership);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Membership</DialogTitle>
          <DialogDescription>Edit membership details</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-medium">Edit Membership</h2>
          <button
            type="button"
            onClick={() => onClose()}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form onSubmit={handleSubmit} id="edit-membership-form">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-normal">
                  Customer Name <span className="text-red-500">*</span>
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

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-normal">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="membership" className="text-xs font-normal">
                  Membership Tier <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.membership}
                  onValueChange={(value) => setFormData({ ...formData, membership: value })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gold" className="text-xs">Gold</SelectItem>
                    <SelectItem value="Silver" className="text-xs">Silver</SelectItem>
                    <SelectItem value="Bronze" className="text-xs">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-normal">
                  Status <span className="text-red-500">*</span>
                </Label>
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
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
            className="h-9 text-xs px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-membership-form"
            className="bg-blue-600 hover:bg-blue-700 h-9 text-xs px-4"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}