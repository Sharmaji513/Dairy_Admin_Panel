import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, BarChart3, ArrowLeft, Phone, Calendar, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { customerService } from '../lib/api/services/customerService';
import { Skeleton } from '../components/ui/skeleton';

export function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        
        // ✨ FIX: Fetch ALL customers instead of just one (since the backend might not support GET /:id)
        const response = await customerService.getCustomers();
        
        // Handle response structure
        const customersList = response.customers || (response.data && response.data.customers) || [];
        
        // ✨ FIX: Find the specific customer from the list
        // We check both 'id' and '_id' and ensure we compare strings
        const foundCustomer = customersList.find(c => 
          String(c.id) === String(id) || String(c._id) === String(id)
        );
        
        if (!foundCustomer) {
          throw new Error("Customer not found");
        }

        // Normalize the data structure
        setCustomer({
          ...foundCustomer,
          id: foundCustomer._id || foundCustomer.id, // Ensure ID is consistent
          name: foundCustomer.name || (foundCustomer.firstName ? `${foundCustomer.firstName} ${foundCustomer.lastName}` : "Unknown Customer"),
          status: foundCustomer.status || 'Active', 
          joinDate: foundCustomer.joinDate || foundCustomer.createdAt,
          totalSpent: foundCustomer.totalSpent || 0,
          totalOrders: foundCustomer.totalOrders || 0,
          membership: foundCustomer.membership || 'Bronze'
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
         <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Skeleton className="h-64 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error || "Customer not found"}</p>
        <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
      </div>
    );
  }

  // Safe safeName for initials
  const safeName = customer.name || "Unknown";
  const initials = safeName.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header / Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/customers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">Edit Customer</Button>
           <Button variant="destructive">Delete Customer</Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Customer Profile */}
            <Card className="p-6 space-y-6">
                <h3 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
                    Profile Information
                </h3>
                
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-2xl font-bold">{initials}</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                        <Badge className="mt-2 px-3 py-1" style={{ backgroundColor: (customer.status || '').toLowerCase() === 'active' ? '#e8f5e9' : '#f3f4f6', color: (customer.status || '').toLowerCase() === 'active' ? '#2e7d32' : '#374151' }}>
                            {customer.status}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-4 text-sm bg-gray-50 p-5 rounded-xl border">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border">
                            <Mail className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Email Address</p>
                            <p className="font-medium">{customer.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border">
                            <Phone className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Phone Number</p>
                            <p className="font-medium">{customer.phone || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border">
                            <Calendar className="h-4 w-4 text-orange-500" />
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground">Member Since</p>
                            <p className="font-medium">
                                {customer.joinDate 
                                ? new Date(customer.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                                : 'Unknown'}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Right Column - Membership Info */}
            <Card className="p-6 space-y-6">
                <h3 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
                    Membership & Activity
                </h3>
                
                <div className="grid gap-4">
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-amber-800 mb-1 font-medium">Current Tier</p>
                            <p className="text-3xl font-bold text-amber-900">
                                {customer.membership || 'Bronze'}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-white/50 rounded-full flex items-center justify-center text-2xl">
                            👑
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white border rounded-xl shadow-sm">
                            <p className="text-sm text-muted-foreground mb-1">Customer Type</p>
                            <p className="font-semibold capitalize text-gray-900">{customer.customerType || 'Regular'}</p>
                        </div>
                        <div className="p-4 bg-white border rounded-xl shadow-sm">
                            <p className="text-sm text-muted-foreground mb-1">Preferred Payment</p>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-500" />
                                <p className="font-semibold">Credit Card</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Order Summary */}
        <Card className="p-6 space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" /> Order Statistics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <p className="text-3xl font-bold text-blue-700">{customer.totalOrders || 0}</p>
                    <p className="text-sm text-blue-600 font-medium mt-1">Total Orders</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <p className="text-3xl font-bold text-green-700">₹{(customer.totalSpent || 0).toLocaleString()}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">Total Spend</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                    <p className="text-2xl font-bold text-purple-700">
                    ₹{customer.totalOrders ? Math.round((customer.totalSpent || 0) / customer.totalOrders) : 0}
                    </p>
                    <p className="text-sm text-purple-600 font-medium mt-1">Avg Order Value</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                    <p className="text-2xl font-bold text-orange-700">{(customer.totalOrders || 0) * 10}</p>
                    <p className="text-sm text-orange-600 font-medium mt-1">Loyalty Points</p>
                </div>
            </div>
        </Card>

        {/* Recent Activity (Placeholder) */}
        <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium">Recent Orders</h3>
            </div>
            <div className="p-8 text-center text-muted-foreground text-sm">
                No recent orders found for this customer.
            </div>
        </Card>
      </div>
    </div>
  );
}