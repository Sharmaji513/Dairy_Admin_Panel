import { X, Mail, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function CustomerDetailsModal({ open, onOpenChange, customer }) {
  // Safety check
  if (!customer) return null;

  // Safely handle name
  const safeName = customer.name || "Unknown Customer";
  const initials = safeName.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✨ UPDATED CLASSNAMES: w-screen h-screen max-w-none rounded-none */}
      <DialogContent className="w-screen h-screen max-w-none max-h-none rounded-none flex flex-col overflow-hidden p-0 gap-0 bg-white">
        
        <div className="p-6 border-b">
            <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
                Customer ID: {customer.id}
            </DialogDescription>
            </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Customer Profile */}
                    <div className="space-y-6">
                    <h3 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
                        Customer Profile
                    </h3>
                    
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white text-2xl font-medium">{initials}</span>
                        </div>
                        <div>
                        <p className="text-xl font-bold">{safeName}</p>
                        <Badge className="mt-2 px-3 py-1" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                            {customer.status || 'Active'}
                        </Badge>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-xl border">
                        <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{customer.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-4 flex justify-center">📞</span>
                        <span className="font-medium">Phone:</span>
                        <span>{customer.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-4 flex justify-center">📅</span>
                        <span className="font-medium">Joined:</span>
                        <span>
                            {customer.joinDate 
                            ? new Date(customer.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                            : 'Unknown'}
                        </span>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <p className="text-sm font-medium text-yellow-800">📝 Notes: Frequent business traveler</p>
                    </div>
                    </div>

                    {/* Right Column - Membership Info */}
                    <div className="space-y-6">
                    <h3 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
                        Membership Details
                    </h3>
                    
                    <div className="grid gap-4">
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Current Tier</p>
                        <p className="text-2xl font-bold text-amber-900">
                            {customer.membership || 'Bronze'}
                        </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white border rounded-xl">
                            <p className="text-sm text-muted-foreground mb-1">Customer Type</p>
                            <p className="font-semibold capitalize">{customer.customerType || 'Regular'}</p>
                            </div>
                            <div className="p-4 bg-white border rounded-xl">
                            <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                            <p className="font-semibold capitalize">{customer.status || 'Active'}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6 pt-6 border-t">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Order Summary
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                        <p className="text-3xl font-bold text-blue-700">{customer.totalOrders || 0}</p>
                        <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                        <p className="text-3xl font-bold text-green-700">₹{(customer.totalSpent || 0).toLocaleString()}</p>
                        <p className="text-sm text-green-600 font-medium">Total Spend</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                        <p className="text-2xl font-bold text-purple-700">
                        ₹{customer.totalOrders ? Math.round((customer.totalSpent || 0) / customer.totalOrders) : 0}
                        </p>
                        <p className="text-sm text-purple-600 font-medium">Avg Order Value</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                        <p className="text-2xl font-bold text-orange-700">{(customer.totalOrders || 0) * 10}</p>
                        <p className="text-sm text-orange-600 font-medium">Loyalty Points</p>
                    </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <div className="bg-gray-50 rounded-xl border overflow-hidden">
                        <div className="p-4 border-b bg-white flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">Last Login</p>
                                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Active Now</Badge>
                        </div>
                        <div className="p-4 border-b bg-white flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">Last Order Date</p>
                                <p className="text-xs text-muted-foreground">
                                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No orders yet'}
                                </p>
                            </div>
                            <span className="text-sm font-medium">Credit Card ending in 4242</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="h-10 px-6"
          >
            Close
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white h-10 px-6">
            Edit Customer
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}