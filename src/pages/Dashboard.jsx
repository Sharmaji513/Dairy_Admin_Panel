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
import { revenueDataMonthly, revenueDataWeekly, revenueDataToday, orderSummaryDataWeekly, orderSummaryDataMonthly, orders, products } from '../lib/mockData';
import { DeliveryBoysCard } from '../components/DeliveryBoysCard';
import { useState } from 'react';
import { motion } from 'motion/react';

export function Dashboard() {
  const [revenueView, setRevenueView] = useState('monthly');
  const [orderView, setOrderView] = useState('weekly');
  const [dateFilter, setDateFilter] = useState('last30');

  // Filter orders based on date filter
  const getFilteredOrders = () => {
    const now = new Date('2025-11-01');
    let startDate = new Date();

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last7':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last30':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last90':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        break;
      case 'thisYear':
        startDate = new Date(now);
        startDate.setMonth(0, 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
    }

    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= now;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Calculate stats based on filtered orders
  const getTotalOrdersCount = () => filteredOrders.length;

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
  };

  const getTotalCustomersCount = () => {
    const uniqueCustomers = new Set(filteredOrders.map(o => o.customerName));
    return uniqueCustomers.size;
  };

  const getAverageOrderValue = () => {
    const completedOrders = filteredOrders.filter(o => o.status === 'completed');
    if (completedOrders.length === 0) return 0;
    const total = completedOrders.reduce((sum, o) => sum + o.total, 0);
    return Math.round(total / completedOrders.length);
  };

  const getRevenueData = () => {
    switch (revenueView) {
      case 'monthly':
        return revenueDataMonthly;
      case 'weekly':
        return revenueDataWeekly;
      case 'today':
        return revenueDataToday;
      default:
        return revenueDataMonthly;
    }
  };

  const getOrderData = () => {
    return orderView === 'weekly' ? orderSummaryDataWeekly : orderSummaryDataMonthly;
  };

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
              <DropdownMenuItem onClick={() => setDateFilter('today')}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last7')}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last30')}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last90')}>
                Last 90 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('thisYear')}>
                This Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-red-500 hover:bg-red-600 transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={getTotalOrdersCount().toString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue"
          value={`₹${getTotalRevenue().toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <StatCard
          title="Customers"
          value={getTotalCustomersCount().toString()}
          icon={Users}
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${getAverageOrderValue()}`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Revenue</h3>
              <p className="text-sm text-muted-foreground">Income vs Expenses analysis</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={revenueView === 'monthly' ? 'default' : 'outline'}
                onClick={() => setRevenueView('monthly')}
                className={revenueView === 'monthly' ? 'bg-gray-900 hover:bg-gray-800 transition-all duration-200' : 'transition-all duration-200'}
              >
                Monthly
              </Button>
              <Button
                size="sm"
                variant={revenueView === 'weekly' ? 'default' : 'outline'}
                onClick={() => setRevenueView('weekly')}
                className={revenueView === 'weekly' ? 'bg-gray-900 hover:bg-gray-800 transition-all duration-200' : 'transition-all duration-200'}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                variant={revenueView === 'today' ? 'default' : 'outline'}
                onClick={() => setRevenueView('today')}
                className={revenueView === 'today' ? 'bg-gray-900 hover:bg-gray-800 transition-all duration-200' : 'transition-all duration-200'}
              >
                Today
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={getRevenueData()} key={revenueView}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip
                contentStyle={{ fontSize: '11px' }}
                labelStyle={{ fontSize: '11px' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '11px' }}
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#9ca3af"
                strokeWidth={2}
                name="Expenses"
                animationDuration={800}
                animationBegin={0}
                dot={{ r: 3, animationBegin: 800, animationDuration: 400 }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#ef4444"
                strokeWidth={2}
                name="Income"
                animationDuration={800}
                animationBegin={0}
                dot={{ r: 3, animationBegin: 800, animationDuration: 400 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Order Summary</h3>
              <p className="text-sm text-muted-foreground">Completed vs Pending orders</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={orderView === 'weekly' ? 'default' : 'outline'}
                onClick={() => setOrderView('weekly')}
                className={orderView === 'weekly' ? 'bg-gray-900 hover:bg-gray-800 transition-all duration-200' : 'transition-all duration-200'}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                variant={orderView === 'monthly' ? 'default' : 'outline'}
                onClick={() => setOrderView('monthly')}
                className={orderView === 'monthly' ? 'bg-gray-900 hover:bg-gray-800 transition-all duration-200' : 'transition-all duration-200'}
              >
                Monthly
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={getOrderData()} key={orderView}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip
                contentStyle={{ fontSize: '11px' }}
                labelStyle={{ fontSize: '11px' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '11px' }}
                iconSize={8}
              />
              <Bar
                dataKey="completed"
                fill="#ef4444"
                name="Completed"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                fill="#9ca3af"
                name="Pending"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <h3 className="mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 4).map((order) => {
                  const initials = order.customerName.split(' ').map(n => n[0]).join('');
                  return (
                    <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4">
                        <span className="text-red-500">#</span>
                        <span className="text-red-500">{order.id.split('-')[1]}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-900 text-white text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{order.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{order.items}</td>
                      <td className="py-3 px-4">₹{order.total}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={order.status === 'completed'
                            ? 'bg-green-50 text-green-700 hover:bg-green-50'
                            : order.status === 'pending'
                              ? 'bg-orange-50 text-orange-700 hover:bg-orange-50'
                              : 'bg-red-50 text-red-700 hover:bg-red-50'}
                        >
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Top Products</h3>
          <div className="space-y-4">
            {products.slice(0, 4).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded bg-red-50 text-red-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">₹{product.price} / {product.unit}</p>
                  </div>
                </div>
                <span className="text-sm text-green-600">+{Math.floor(Math.random() * 20) + 5}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryBoysCard />

        <Card className="p-6">
          <h3 className="mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {products.slice(0, 5).map((item, index) => {
              const mockOrders = Math.floor(Math.random() * 300) + 100;
              const mockRevenue = mockOrders * item.price;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded bg-red-50 text-red-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{mockOrders} orders</p>
                    </div>
                  </div>
                  <p>₹{mockRevenue.toLocaleString('en-IN')}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}