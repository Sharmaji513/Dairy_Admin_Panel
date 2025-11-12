import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function AddMembershipModal({ isOpen, onClose, onAddMembership }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    membershipTier: 'Bronze',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMembership = {
      id: Date.now().toString(),
      name: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      membership: formData.membershipTier,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
    };
    onAddMembership(newMembership);
    onClose();
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      membershipTier: 'Bronze',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Add Membership</DialogTitle>
          <DialogDescription>Add a new membership</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-medium">Add Membership</h2>
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
          <form onSubmit={handleSubmit} id="add-membership-form">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="text-xs font-normal">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="h-9 text-xs"
                  placeholder="Enter customer name"
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
                  placeholder="Enter email"
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
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="membershipTier" className="text-xs font-normal">
                  Membership Tier <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.membershipTier}
                  onValueChange={(value) => setFormData({ ...formData, membershipTier: value })}
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
            form="add-membership-form"
            className="bg-red-500 hover:bg-red-600 h-9 text-xs px-4"
          >
            Add Membership
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}