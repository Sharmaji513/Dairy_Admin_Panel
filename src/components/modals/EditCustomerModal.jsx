import { useState, useEffect } from 'react';
// ✨ REMOVED 'X' from imports
import { User, Mail, Phone, Shield, Award } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function EditCustomerModal({ open, onOpenChange, onSave, customer }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    status: 'active',
    customerType: 'new',
    membership: 'Bronze',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id,
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        status: (customer.status || 'active').toLowerCase(),
        customerType: customer.customerType || 'new',
        membership: customer.membership || 'Bronze',
      });
    }
  }, [customer]);

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  if (!customer && open) return null; 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none rounded-none flex flex-col p-0 gap-0 bg-gray-50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Customer</h2>
            <p className="text-sm text-gray-500 mt-1">Update customer details and account settings.</p>
          </div>
          {/* ✨ REMOVED THE CUSTOM 'X' BUTTON HERE. The default one will show. */}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-blue-600" /> Personal Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Account Settings */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                <Shield className="h-5 w-5 text-green-600" /> Account Settings
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Account Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status" className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"/> Active
                      </SelectItem>
                      <SelectItem value="inactive" className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-gray-400 inline-block mr-2"/> Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">Customer Type</Label>
                  <Select 
                    value={formData.customerType} 
                    onValueChange={(value) => setFormData({ ...formData, customerType: value })}
                  >
                    <SelectTrigger id="type" className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="returning">Returning</SelectItem>
                      <SelectItem value="high-value">High Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="membership" className="text-sm font-medium text-gray-700">Membership Tier</Label>
                  <Select 
                    value={formData.membership} 
                    onValueChange={(value) => setFormData({ ...formData, membership: value })}
                  >
                    <SelectTrigger id="membership" className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        <SelectValue placeholder="Select membership" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 text-base font-medium border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="h-11 px-8 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Save Changes
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}