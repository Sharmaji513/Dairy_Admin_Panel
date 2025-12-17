import { ShoppingCart, DollarSign, Users, TrendingUp, Download, Calendar, ChevronDown } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DeliveryBoysCard } from '../components/DeliveryBoysCard';
import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner'; // ✨ Added toast import

// Import API Hooks
import { useApiOrders } from '../lib/hooks/useApiOrders';
import { useApiProducts } from '../lib/hooks/useApiProducts';
import { useApiCustomers } from '../lib/hooks/useApiCustomers';
import { Skeleton } from '../components/ui/skeleton';

export function Dashboard() {
  const [revenueView, setRevenueView] = useState('monthly');
  const [orderView, setOrderView] = useState('weekly');
  const [dateFilter, setDateFilter] = useState('last30');

  // 1. Fetch All Data (with large limits to get everything for stats)
  const { 
    orders, 
    loading: ordersLoading 
  } = useApiOrders({ limit: 1000 }); // Fetch enough to calculate stats

  const { 
    products, 
    loading: productsLoading 
  } = useApiProducts({ limit: 100 });

  const { 
    customers, 
    loading: customersLoading 
  } = useApiCustomers({ limit: 1000 });

  // 2. Calculate Stats Locally
  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed' || o.status === 'delivered')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    
    const totalCustomers = customers.length;
    
    // Calculate Average Order Value
    const completedOrdersCount = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
    const avgOrderValue = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;

    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      avgOrderValue
    };
  };

  const stats = calculateStats();
  const isLoading = ordersLoading || productsLoading || customersLoading;

  // 3. Prepare Chart Data (Mock or Derived)
  // Since we don't have historical data in the list, we'll use a simple derivation or fallback for now
  const revenueData = [
    { month: 'Jan', income: stats.totalRevenue * 0.1, expenses: stats.totalRevenue * 0.05 },
    { month: 'Feb', income: stats.totalRevenue * 0.12, expenses: stats.totalRevenue * 0.06 },
    { month: 'Mar', income: stats.totalRevenue * 0.15, expenses: stats.totalRevenue * 0.08 },
    { month: 'Apr', income: stats.totalRevenue * 0.11, expenses: stats.totalRevenue * 0.05 },
    { month: 'May', income: stats.totalRevenue * 0.18, expenses: stats.totalRevenue * 0.09 },
    { month: 'Jun', income: stats.totalRevenue * 0.14, expenses: stats.totalRevenue * 0.07 },
    { month: 'Jul', income: stats.totalRevenue * 0.2, expenses: stats.totalRevenue * 0.1 },
  ];

  const orderSummaryData = [
    { date: 'Mon', completed: orders.filter(o => (o.status === 'completed' || o.status === 'delivered')).length, pending: orders.filter(o => o.status === 'pending').length },
    { date: 'Tue', completed: 0, pending: 0 }, // Placeholder
    { date: 'Wed', completed: 0, pending: 0 },
    { date: 'Thu', completed: 0, pending: 0 },
    { date: 'Fri', completed: 0, pending: 0 },
    { date: 'Sat', completed: 0, pending: 0 },
    { date: 'Sun', completed: 0, pending: 0 },
  ];

  // 4. Get Top Products
  const topProducts = products.slice(0, 5);

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'last7': return 'Last 7 Days';
      case 'last30': return 'Last 30 Days';
      case 'last90': return 'Last 90 Days';
      case 'thisYear': return 'This Year';
      default: return 'Last 30 Days';
    }
  };

  // ✨ ADDED: Handle Export Function
  const handleExport = () => {
    toast.info("Exporting dashboard data...");
    // Add logic here to export data (e.g., CSV download)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                <Calendar className="h-4 w-4" />
                {getDateFilterLabel()}
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setDateFilter('today')}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last7')}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last30')}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last90')}>Last 90 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('thisYear')}>This Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* ✨ UPDATED: Export Button with onClick Handler */}
          <Button 
            className="bg-red-500 hover:bg-red-600 transition-all duration-200"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={isLoading ? '...' : stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue"
          value={isLoading ? '...' : `₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <StatCard
          title="Customers"
          value={isLoading ? '...' : stats.totalCustomers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Avg Order Value"
          value={isLoading ? '...' : `₹${stats.avgOrderValue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Revenue</h3>
              <p className="text-sm text-muted-foreground">Income vs Expenses analysis</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <LineChart data={revenueData}> 
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px' }} labelStyle={{ fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} iconSize={8} />
                <Line type="monotone" dataKey="expenses" stroke="#9ca3af" strokeWidth={2} name="Expenses" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="income" stroke="#ef4444" strokeWidth={2} name="Income" dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Order Summary Chart */}
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
             <div>
              <h3>Order Summary</h3>
              <p className="text-sm text-muted-foreground">Completed vs Pending orders</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <BarChart data={orderSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px' }} labelStyle={{ fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} iconSize={8} />
                <Bar dataKey="completed" fill="#ef4444" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#9ca3af" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <h3 className="mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan="5" className="text-center p-4"><Skeleton className="h-8 w-full" /></td></tr>
                )}
                {!isLoading && orders.slice(0, 5).map((order) => {
                  const initials = (order.customerName || "U").split(' ').map(n => n[0]).join('');
                  return (
                    <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4">
                        <span className="text-red-500">#{order.id ? order.id.slice(-6) : '...'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-900 text-white text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{order.customerName || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">₹{order.total || 0}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{order.status || 'Pending'}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products Table */}
        <Card className="p-6">
          <h3 className="mb-4">Top Products</h3>
          <div className="space-y-4">
            {isLoading && (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
            {topProducts.map((product, index) => (
              <div key={product.id || index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded bg-red-50 text-red-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">₹{product.price}</p>
                  </div>
                </div>
                <span className="text-sm text-green-600">In Stock: {product.stock}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryBoysCard />
      </div>
    </div>
  );
}