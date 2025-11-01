import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, DollarSign, Users, Building2, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { branches, orders, products, customers } from '../lib/mockData';

export function Reports() {
  const [branch, setBranch] = useState('all');
  const [dateRange, setDateRange] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-12-31');

  // Filtered data state
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    activeBranches: 0,
  });

  // Handle date range change
  useEffect(() => {
    if (dateRange === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
    }
  }, [dateRange]);

  // Get date range based on selection
  const getDateRange = () => {
    const now = new Date('2025-11-01'); // Current date from context
    let startDate = new Date();
    let endDate = new Date(now);

    switch (dateRange) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setDate(1); // First day of current month
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setMonth(0, 1); // January 1st
        break;
      case 'custom':
        startDate = new Date(fromDate);
        endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(0, 1);
    }

    return { startDate, endDate };
  };

  // Filter orders based on branch and date range
  const filterData = () => {
    let filtered = [...orders];
    const { startDate, endDate } = getDateRange();

    // Filter by branch
    if (branch !== 'all') {
      const selectedBranch = branches.find(b => b.id === branch);
      if (selectedBranch) {
        filtered = filtered.filter(o => o.branch === selectedBranch.name);
      }
    }

    // Filter by date range
    filtered = filtered.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= startDate && orderDate <= endDate;
    });

    return filtered;
  };

  const handleApplyFilters = () => {
    const filtered = filterData();
    setFilteredOrders(filtered);

    // Calculate stats based on filtered data
    const completedOrders = filtered.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // Get unique customers from filtered orders
    const uniqueCustomers = new Set(filtered.map(o => o.customerName));

    // Get active branches
    const activeBranches = branch === 'all'
      ? branches.filter(b => b.status === 'active').length
      : 1;

    setStats({
      totalOrders: filtered.length,
      totalRevenue,
      totalCustomers: uniqueCustomers.size,
      activeBranches,
    });
  };

  // Initialize with default filters
  useEffect(() => {
    handleApplyFilters();
  }, []);

  // Calculate chart data based on filtered orders
  const getRevenueByBranch = () => {
    const branchRevenue = {};

    filteredOrders.forEach(order => {
      if (order.status === 'completed') {
        branchRevenue[order.branch] = (branchRevenue[order.branch] || 0) + order.total;
      }
    });

    return Object.entries(branchRevenue).map(([name, revenue]) => ({
      name,
      revenue
    }));
  };

  // Get top selling products from filtered orders
  const getTopSellingProducts = () => {
    const productSales = {};

    filteredOrders.forEach(order => {
      order.products.forEach(p => {
        if (!productSales[p.productId]) {
          productSales[p.productId] = {
            count: 0,
            product: p
          };
        }
        productSales[p.productId].count += p.quantity;
      });
    });

    const sorted = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const colors = ['#EF5350', '#26C6DA', '#42A5F5', '#FFA726', '#AB47BC'];

    return sorted.map((item, index) => ({
      name: item.product.productName,
      value: item.count,
      color: colors[index] || '#999999'
    }));
  };

  // Get branch performance
  const getBranchPerformance = () => {
    const branchStats = {};

    filteredOrders.forEach(order => {
      if (!branchStats[order.branch]) {
        branchStats[order.branch] = { revenue: 0, orders: 0 };
      }
      if (order.status === 'completed') {
        branchStats[order.branch].revenue += order.total;
      }
      branchStats[order.branch].orders += 1;
    });

    return Object.entries(branchStats).map(([name, data]) => ({
      name,
      revenue: data.revenue,
      orders: data.orders,
      growth: '+12.5%'
    }));
  };

  // Get orders by status
  const getOrdersByStatus = () => {
    const statusCounts = {
      completed: 0,
      pending: 0,
      cancelled: 0
    };

    filteredOrders.forEach(order => {
      if (order.status in statusCounts) {
        statusCounts[order.status]++;
      }
    });

    const total = filteredOrders.length || 1;

    return [
      {
        status: 'Completed',
        count: statusCounts.completed,
        percentage: `${((statusCounts.completed / total) * 100).toFixed(1)}%`,
        color: '#10B981'
      },
      {
        status: 'Pending',
        count: statusCounts.pending,
        percentage: `${((statusCounts.pending / total) * 100).toFixed(1)}%`,
        color: '#F59E0B'
      },
      {
        status: 'Cancelled',
        count: statusCounts.cancelled,
        percentage: `${((statusCounts.cancelled / total) * 100).toFixed(1)}%`,
        color: '#EF4444'
      },
    ];
  };

  // Sales trend data
  const getSalesTrendData = () => {
    const dailySales = {};

    filteredOrders.forEach(order => {
      if (order.status === 'completed') {
        const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailySales[date]) {
          dailySales[date] = { sales: 0, profit: 0 };
        }
        dailySales[date].sales += order.total;
        dailySales[date].profit += Math.round(order.total * 0.2); // Assume 20% profit margin
      }
    });

    return Object.entries(dailySales)
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        profit: data.profit
      }))
      .slice(-7); // Last 7 days
  };

  const revenueByBranch = getRevenueByBranch();
  const topSellingProducts = getTopSellingProducts();
  const branchPerformance = getBranchPerformance();
  const ordersByStatus = getOrdersByStatus();
  const salesTrendData = getSalesTrendData();

  const newVsReturningData = [
    { name: 'New', value: 2845, color: '#4DD0E1' },
    { name: 'Returning', value: 5697, color: '#26C6DA' },
  ];

  const highValueCustomers = [
    { initials: 'AAM', name: 'Ahmed Al Mansouri', revenue: 3456.50, orders: 24, vip: true },
    { initials: 'SJ', name: 'Sarah Johnson', revenue: 2890.25, orders: 18, vip: true },
    { initials: 'MH', name: 'Mohammed Hassan', revenue: 2654.80, orders: 22, vip: true },
    { initials: 'EW', name: 'Emily Wilson', revenue: 2340.90, orders: 15, vip: true },
  ];

  const peakHoursData = [
    { hour: '9 AM', orders: 55 },
    { hour: '10 AM', orders: 75 },
    { hour: '11 AM', orders: 95 },
    { hour: '12 PM', orders: 145 },
    { hour: '1 PM', orders: 165 },
    { hour: '2 PM', orders: 125 },
    { hour: '3 PM', orders: 95 },
    { hour: '4 PM', orders: 85 },
    { hour: '5 PM', orders: 105 },
    { hour: '6 PM', orders: 135 },
    { hour: '7 PM', orders: 175 },
    { hour: '8 PM', orders: 185 },
    { hour: '9 PM', orders: 155 },
    { hour: '10 PM', orders: 105 },
  ];

  const handleExport = () => {
    console.log('Exporting report data...');
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const handleRefresh = () => {
    handleApplyFilters();
  };

  return (
    <div className="p-4">
      {/* Header Controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-40 h-9 text-xs border border-gray-300">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Branches</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36 h-9 text-xs border border-gray-300">
                <SelectValue placeholder="This Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today" className="text-xs">Today</SelectItem>
                <SelectItem value="week" className="text-xs">This Week</SelectItem>
                <SelectItem value="month" className="text-xs">This Month</SelectItem>
                <SelectItem value="quarter" className="text-xs">This Quarter</SelectItem>
                <SelectItem value="year" className="text-xs">This Year</SelectItem>
                <SelectItem value="custom" className="text-xs">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {showCustomRange && (
              <>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-36 h-9 text-xs"
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-36 h-9 text-xs"
                  placeholder="To"
                />
              </>
            )}

            <Button
              onClick={handleApplyFilters}
              className="h-9 text-xs bg-blue-500 hover:bg-blue-600"
            >
              🔍 Apply Filters
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-9 text-xs border border-gray-300"
            >
              🔄 Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9 text-xs bg-red-500 text-white hover:bg-red-600 border border-red-500"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Orders</p>
              <h3 className="text-lg">{stats.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Revenue</p>
              <h3 className="text-lg">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Customers</p>
              <h3 className="text-lg">{stats.totalCustomers.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Active Branches</p>
              <h3 className="text-lg">{stats.activeBranches}</h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center">
              <Building2 className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            📊 Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            📈 Sales Reports
          </TabsTrigger>
          <TabsTrigger value="customers" className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            👥 Customer Reports
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            📦 Order Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue by Branch */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Revenue by Branch</h3>
              {revenueByBranch.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByBranch}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-xs">
                  No data available for selected filters
                </div>
              )}
            </Card>

            {/* Top Selling Products */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Top Selling Products</h3>
              {topSellingProducts.length > 0 ? (
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="50%" height={300}>
                    <PieChart>
                      <Pie
                        data={topSellingProducts}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {topSellingProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {topSellingProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }} />
                          <span className="text-xs">{product.name}</span>
                        </div>
                        <span className="text-xs font-medium">{product.value} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-xs">
                  No data available for selected filters
                </div>
              )}
            </Card>
          </div>

          {/* Sales Trend */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Sales Trend</h3>
            {salesTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-xs">
                No data available for selected filters
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Branch Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Branch Performance</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={handleExportCSV}
                >
                  Export CSV
                </Button>
              </div>
              <div className="space-y-3">
                {branchPerformance.length > 0 ? (
                  branchPerformance.map((branch, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{branch.name}</h4>
                          <p className="text-xs text-muted-foreground">{branch.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{branch.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                          <p className="text-xs text-green-600">{branch.growth}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    No data available for selected filters
                  </div>
                )}
              </div>
            </Card>

            {/* Average Order Value */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Average Order Value</h3>
              <div className="text-center py-6">
                <h2 className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                </h2>
                <p className="text-xs text-green-600 mb-6">📈 Based on filtered data</p>
                <div className="space-y-2 text-left mt-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span className="font-medium">{stats.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Revenue:</span>
                    <span className="font-medium">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Reports Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* New vs Returning Customers */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">New vs Returning Customers</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={newVsReturningData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {newVsReturningData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* High-Value Customers */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">High-Value Customers</h3>
              <div className="space-y-3">
                {highValueCustomers.map((customer, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-blue-600">{customer.initials}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{customer.name}</h4>
                        <p className="text-xs text-muted-foreground">{customer.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">₹{customer.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        {customer.vip && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                            ⭐ VIP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Order Reports Tab */}
        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Orders by Status */}
            <Card className="p-6">
              <h3 className="font-medium mb-6">Orders by Status</h3>
              <div className="space-y-4">
                {ordersByStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm">{status.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{status.count.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground w-12 text-right">{status.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Peak Hours */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Peak Hours</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}