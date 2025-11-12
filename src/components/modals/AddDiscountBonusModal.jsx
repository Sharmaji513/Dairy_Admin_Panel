import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// TypeScript interfaces (DiscountBonus, AddDiscountBonusModalProps) are removed for JSX.

export function AddDiscountBonusModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'discount', // Removed 'as' type assertion
    value: '',
    valueType: 'percentage', // Removed 'as' type assertion
    membershipTier: 'All',
    validFrom: '',
    validUntil: '',
    status: 'active', // Removed 'as' type assertion
  });

  const handleSubmit = (e) => { // Removed 'React.FormEvent' type
    e.preventDefault();
    const newItem = { // Removed 'DiscountBonus' type
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      value: parseFloat(formData.value),
      valueType: formData.valueType,
      membershipTier: formData.membershipTier,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      status: formData.status,
    };
    onAdd(newItem);
    onClose();
    setFormData({
      title: '',
      type: 'discount',
      value: '',
      valueType: 'percentage',
      membershipTier: 'All',
      validFrom: '',
      validUntil: '',
      status: 'active',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Add Discount/Bonus</DialogTitle>
          <DialogDescription>Add a new discount or bonus offer</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-medium">Add Discount/Bonus</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form onSubmit={handleSubmit} id="add-discount-bonus-form">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-xs">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                  required
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="type" className="text-xs">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })} // Removed type
                  >
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount" className="text-xs">Discount</SelectItem>
                      <SelectItem value="bonus" className="text-xs">Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valueType" className="text-xs">
                    Value Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.valueType}
                    onValueChange={(value) => setFormData({ ...formData, valueType: value })} // Removed type
                  >
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue placeholder="Select value type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage" className="text-xs">Percentage (%)</SelectItem>
                      <SelectItem value="fixed" className="text-xs">Fixed (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="value" className="text-xs">
                    Value <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter value"
                    required
                    className="h-9 text-xs mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="membershipTier" className="text-xs">
                    Membership Tier <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.membershipTier}
                    onValueChange={(value) => setFormData({ ...formData, membershipTier: value })}
                  >
                    <SelectTrigger className="h-9 text-xs mt-1">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All" className="text-xs">All</SelectItem>
                      <SelectItem value="Gold" className="text-xs">Gold</SelectItem>
                      <SelectItem value="Silver" className="text-xs">Silver</SelectItem>
                      <SelectItem value="Bronze" className="text-xs">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="validFrom" className="text-xs">
                    Valid From <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                    className="h-9 text-xs mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="validUntil" className="text-xs">
                    Valid Until <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-xs">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })} // Removed type
                >
                  <SelectTrigger className="h-9 text-xs mt-1">
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
            onClick={onClose}
            className="h-9 text-xs px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-discount-bonus-form"
            className="bg-red-500 hover:bg-red-600 h-9 text-xs px-4"
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}