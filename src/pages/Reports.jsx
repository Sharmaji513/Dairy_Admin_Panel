import React, { useState, useEffect } from "react";
// --- Mock Dependencies (from original file) ---
// The original file imports these, then immediately re-defines them as mocks.
// We will keep the mock definitions as they were part of the provided code.
// import { Button } from "../components/ui/button";
// import { Card } from "../components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Building2,
  Download,
  BarChart3,
  TrendingUp,
  Package,
} from "lucide-react";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import {
//   usePersistentOrders,
//   usePersistentProducts,
//   usePersistentCustomers,
//   usePersistentBranches,
// } from "../lib/usePersistentData";

// --- START: Mock Dependencies ---
// As the original ../components/ui/ and ../lib/ files are not accessible,
// here are simple placeholders to make the component runnable.

// --- Mock Data ---
const sampleOrders = [
  {
    id: "1",
    date: "2025-10-25T10:30:00Z",
    customerName: "Ahmed Al Mansouri",
    status: "completed",
    total: 150.0,
    products: [
      {
        productId: "p1",
        productName: "Full Cream Milk",
        quantity: 2,
      },
      { productId: "p2", productName: "Paneer", quantity: 1 },
    ],
  },
  {
    id: "2",
    date: "2025-10-28T14:45:00Z",
    customerName: "Sarah Johnson",
    status: "completed",
    total: 220.5,
    products: [
      {
        productId: "p3",
        productName: "Fresh Curd",
        quantity: 3,
      },
    ],
  },
  {
    id: "3",
    date: "2025-11-01T09:15:00Z",
    customerName: "Mohammed Hassan",
    status: "pending",
    total: 85.0,
    products: [
      {
        productId: "p1",
        productName: "Full Cream Milk",
        quantity: 1,
      },
    ],
  },
  {
    id: "4",
    date: "2025-01-15T11:00:00Z",
    customerName: "Ahmed Al Mansouri",
    status: "completed",
    total: 3456.5,
    products: [
      { productId: "p4", productName: "Butter", quantity: 5 },
    ],
  },
  {
    id: "5",
    date: "2025-03-20T16:20:00Z",
    customerName: "Sarah Johnson",
    status: "cancelled",
    total: 130.0,
    products: [
      { productId: "p2", productName: "Paneer", quantity: 2 },
    ],
  },
];

const sampleCustomers = [
  { id: "c1", name: "Ahmed Al Mansouri", membership: "Gold" },
  { id: "c2", name: "Sarah Johnson", membership: "Silver" },
  { id: "c3", name: "Mohammed Hassan", membership: "Bronze" },
  { id: "c4", name: "Emily Wilson", membership: "Gold" },
];

const sampleProducts = [
  { id: "p1", name: "Full Cream Milk", category: "Dairy" },
  { id: "p2", name: "Paneer", category: "Dairy" },
  { id: "p3", name: "Fresh Curd", category: "Dairy" },
  { id: "p4", name: "Butter", category: "Dairy" },
];

const sampleBranches = [
  { id: "b1", name: "Main Branch", status: "active" },
  { id: "b2", name: "Downtown Branch", status: "active" },
  { id: "b3", name: "Westside Branch", status: "inactive" },
];

// --- Mock Hooks ---
const usePersistentOrders = () => [sampleOrders];
const usePersistentProducts = () => [sampleProducts];
const usePersistentCustomers = () => [
  sampleCustomers,
];
const usePersistentBranches = () => [
  sampleBranches,
];

// --- Mock UI Components ---
const Button = React.forwardRef(
  ({ children, className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${variant === "outline" ? "border border-gray-300 bg-white hover:bg-gray-50" : "bg-blue-600 text-white hover:bg-blue-700"}
      ${size === "sm" ? "h-9 text-xs" : "h-10"}
      ${className}`}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";

const Card = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const Select = ({
  children,
  ...props
}) => <div {...props}>{children}</div>;
const SelectContent = ({
  children,
  ...props
}) => <div {...props}>{children}</div>;
const SelectItem = ({
  children,
  ...props
}) => <option {...props}>{children}</option>;
const SelectTrigger = React.forwardRef(
  ({ children, className, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={`border border-gray-300 rounded-md px-3 py-2 ${className}`}
    >
      {children}
    </select>
  ));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({
  placeholder,
}) => (
  <option value="" disabled>
    {placeholder}
  </option>
);

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`px-3 py-2 border border-gray-300 rounded-md w-full text-sm ${className}`}
  />
));
Input.displayName = "Input";

const Label = React.forwardRef(({ children, className, ...props }, ref) => (
  <label
    ref={ref}
    {...props}
    className={`block text-sm font-medium text-gray-700 ${className}`}
  >
    {children}
  </label>
));
Label.displayName = "Label";

const Tabs = ({
  children,
  value,
  onValueChange,
  className,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.type === TabsList ||
            child.type === TabsContent)
        ) {
          return React.cloneElement(
            child,
            { activeTab: value, onTabChange: onValueChange },
          );
        }
        return child;
      })}
    </div>
  );
};
const TabsList = ({
  children,
  className,
  activeTab,
  onTabChange,
}) => (
  <div className={`flex border-b ${className}`}>
    {React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type === TabsTrigger
      ) {
        return React.cloneElement(
          child,
          {
            isActive: child.props.value === activeTab,
            onClick: () => onTabChange?.(child.props.value),
          },
        );
      }
      return child;
    })}
  </div>
);
const TabsTrigger = ({
  children,
  className,
  isActive,
  ...props
}) => (
  <button
    {...props}
    data-state={isActive ? "active" : "inactive"}
    className={`px-4 py-2 text-sm font-medium ${isActive ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"} ${className}`}
  >
    {children}
  </button>
);
const TabsContent = ({
  children,
  value,
  activeTab,
  className,
}) => {
  if (value !== activeTab) return null;
  return <div className={className}>{children}</div>;
};

// --- END: Mock Dependencies ---

export const Reports = () => {
  const [orders] = usePersistentOrders();
  const [products] = usePersistentProducts();
  const [customers] = usePersistentCustomers();
  const [branches] = usePersistentBranches();

  const [membership, setMembership] = useState("all");
  const [dateRange, setDateRange] = useState("year");
  const [activeTab, setActiveTab] =
    useState("overview");
  const [showCustomRange, setShowCustomRange] =
    useState(false);
  const [fromDate, setFromDate] =
    useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");

  // Filtered data state
  const [filteredOrders, setFilteredOrders] =
    useState(orders);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    activeBranches: 0,
  });

  // Handle date range change
  useEffect(() => {
    if (dateRange === "custom") {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
    }
  }, [dateRange]);

  // Get date range based on selection
  const getDateRange = () => {
    const now = new Date("2025-11-01"); // Current date from context
    let startDate = new Date();
    let endDate = new Date(now);

    switch (dateRange) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setDate(1); // First day of current month
        break;
      case "quarter":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setMonth(0, 1); // January 1st
        break;
      case "custom":
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

  // Filter orders based on membership and date range
  const filterData = () => {
    let filtered = [...orders];
    const { startDate, endDate } = getDateRange();

    // Filter by membership
    if (membership !== "all") {
      filtered = filtered.filter((o) => {
        const customer = customers.find(
          (c) => c.name === o.customerName,
        );
        return customer?.membership === membership;
      });
    }

    // Filter by date range
    filtered = filtered.filter((o) => {
      const orderDate = new Date(o.date);
      return orderDate >= startDate && orderDate <= endDate;
    });

    return filtered;
  };

  const handleApplyFilters = () => {
    const filtered = filterData();
    setFilteredOrders(filtered);

    // Calculate stats based on filtered data
    const completedOrders = filtered.filter(
      (o) => o.status === "completed",
    );
    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + o.total,
      0,
    );

    // Get unique customers from filtered orders
    const uniqueCustomers = new Set(
      filtered.map((o) => o.customerName),
    );

    // Get active branches
    const activeBranchesCount = branches.filter(
      (b) => b.status === "active",
    ).length;

    setStats({
      totalOrders: filtered.length,
      totalRevenue,
      totalCustomers: uniqueCustomers.size,
      activeBranches: activeBranchesCount,
    });
  };

  // Initialize with default filters and update when data changes
  useEffect(() => {
    handleApplyFilters();
  }, [
    orders,
    customers,
    branches,
    membership,
    dateRange,
    fromDate,
    toDate,
  ]); // Added customers and branches dependencies

  // Calculate revenue data based on filtered orders
  const getRevenueData = () => {
    const revenueByDate = {};

    filteredOrders.forEach((order) => {
      if (order.status === "completed") {
        const dateObj = new Date(order.date);
        const dateKey = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        revenueByDate[dateKey] =
          (revenueByDate[dateKey] || 0) + order.total;
      }
    });

    return Object.entries(revenueByDate)
      .map(([name, revenue]) => ({
        name,
        revenue,
      }))
      .slice(-7); // Last 7 days
  };

  // Get top selling products from filtered orders
  const getTopSellingProducts = () => {
    const productSales = {};

    filteredOrders.forEach((order) => {
      order.products.forEach((p) => {
        if (!productSales[p.productId]) {
          productSales[p.productId] = {
            count: 0,
            product: p,
          };
        }
        productSales[p.productId].count += p.quantity;
      });
    });

    const sorted =
      Object.values(productSales)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const colors = [
      "#EF5350",
      "#26C6DA",
      "#42A5F5",
      "#FFA726",
      "#AB47BC",
    ];

    return sorted.map((item, index) => ({
      name: item.product.productName,
      value: item.count,
      color: colors[index] || "#999999",
    }));
  };

  // Get branch performance
  const getBranchPerformance = () => {
    const membershipStats = {};

    filteredOrders.forEach((order) => {
      const customer = customers.find(
        (c) => c.name === order.customerName,
      );
      const membershipTier = customer?.membership || "Bronze";

      if (!membershipStats[membershipTier]) {
        membershipStats[membershipTier] = {
          revenue: 0,
          orders: 0,
        };
      }
      membershipStats[membershipTier].revenue += order.total;
      membershipStats[membershipTier].orders += 1;
    });

    return Object.entries(membershipStats).map(
      ([tier, stats]) => ({
        name: tier,
        revenue: stats.revenue,
        orders: stats.orders,
      }),
    );
  };

  // Get orders by status
  const getOrdersByStatus = () => {
    const statusCounts = {
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    filteredOrders.forEach((order) => {
      if (order.status in statusCounts) {
        statusCounts[
          order.status
        ]++;
      }
    });

    const total = filteredOrders.length || 1;

    return [
      {
        status: "Completed",
        count: statusCounts.completed,
        percentage: `${((statusCounts.completed / total) * 100).toFixed(1)}%`,
        color: "#10B981",
      },
      {
        status: "Pending",
        count: statusCounts.pending,
        percentage: `${((statusCounts.pending / total) * 100).toFixed(1)}%`,
        color: "#F59E0B",
      },
      {
        status: "Cancelled",
        count: statusCounts.cancelled,
        percentage: `${((statusCounts.cancelled / total) * 100).toFixed(1)}%`,
        color: "#EF4444",
      },
    ];
  };

  // Sales trend data
  const getSalesTrendData = () => {
    const dailySales = {};

    filteredOrders.forEach((order) => {
      if (order.status === "completed") {
        const dateObj = new Date(order.date);
        const dateKey = dateObj.toISOString().split("T")[0]; // Use ISO date as key for proper sorting

        if (!dailySales[dateKey]) {
          dailySales[dateKey] = {
            dateObj,
            orders: 0,
            revenue: 0,
            profit: 0,
          };
        }
        dailySales[dateKey].orders += 1;
        dailySales[dateKey].revenue += order.total;
        // Calculate profit as 30% of revenue (you can adjust this percentage)
        dailySales[dateKey].profit += order.total * 0.3;
      }
    });

    // Sort by date and format for display
    return Object.entries(dailySales)
      .sort(
        (a, b) =>
          a[1].dateObj.getTime() - b[1].dateObj.getTime(),
      ) // Sort chronologically
      .map(([dateKey, data]) => ({
        date: data.dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sales: data.revenue, // Renamed from revenue to sales
        profit: data.profit,
        orders: data.orders,
      }))
      .slice(-7); // Last 7 days
  };

  // Get popular items for the chart legend
  const getPopularItems = () => {
    const itemCounts = {};

    filteredOrders.forEach((order) => {
      // Check if order has products array
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product) => {
          const itemName =
            product.productName || product.name;
          if (itemName) {
            itemCounts[itemName] =
              (itemCounts[itemName] || 0) +
              (product.quantity || 1);
          }
        });
      }
    });

    // If no items found, return default popular items
    if (Object.keys(itemCounts).length === 0) {
      return [
        { name: "Full Cream Milk", count: 45 },
        { name: "Paneer", count: 32 },
        { name: "Fresh Curd", count: 28 },
        { name: "Butter", count: 21 },
      ];
    }

    return Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));
  };

  const revenueData = getRevenueData();
  const topSellingProducts = getTopSellingProducts();
  const branchPerformance = getBranchPerformance();
  const ordersByStatus = getOrdersByStatus();
  const salesTrendData = getSalesTrendData();
  const popularItems = getPopularItems();

  const newVsReturningData = [
    { name: "New", value: 2845, color: "#3B82F6" },
    { name: "Returning", value: 5697, color: "#F59E0B" },
  ];

  const highValueCustomers = [
    {
      initials: "AAM",
      name: "Ahmed Al Mansouri",
      revenue: 3456.5,
      orders: 24,
      vip: true,
    },
    {
      initials: "SJ",
      name: "Sarah Johnson",
      revenue: 2890.25,
      orders: 18,
      vip: true,
    },
    {
      initials: "MH",
      name: "Mohammed Hassan",
      revenue: 2654.8,
      orders: 22,
      vip: true,
    },
    {
      initials: "EW",
      name: "Emily Wilson",
      revenue: 2340.9,
      orders: 15,
      vip: true,
    },
  ];

  const peakHoursData = [
    { hour: "9 AM", orders: 55 },
    { hour: "10 AM", orders: 75 },
    { hour: "11 AM", orders: 95 },
    { hour: "12 PM", orders: 145 },
    { hour: "1 PM", orders: 165 },
    { hour: "2 PM", orders: 125 },
    { hour: "3 PM", orders: 95 },
    { hour: "4 PM", orders: 85 },
    { hour: "5 PM", orders: 105 },
    { hour: "6 PM", orders: 135 },
    { hour: "7 PM", orders: 175 },
    { hour: "8 PM", orders: 185 },
    { hour: "9 PM", orders: 155 },
    { hour: "10 PM", orders: 105 },
  ];

  const handleExport = () => {
    console.log("Exporting report data...");
  };

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
  };

  const handleRefresh = () => {
    handleApplyFilters();
  };

  // --- MOCK SELECT HANDLERS ---
  // These are needed because the mock <select> is now a real <select>
  const handleMembershipChange = (
    e,
  ) => {
    setMembership(e.target.value);
  };

  const handleDateRangeChange = (
    e,
  ) => {
    setDateRange(e.target.value);
  };
  // --- END MOCK SELECT HANDLERS ---

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select
              value={membership}
              onValueChange={setMembership}
            >
              <SelectTrigger
                value={membership}
                onChange={handleMembershipChange}
                className="w-40 h-9 text-xs border border-gray-300"
              >
                <SelectValue placeholder="All Membership" />
                <SelectItem value="all" className="text-xs">
                  All Membership
                </SelectItem>
                <SelectItem value="Gold" className="text-xs">
                  Gold
                </SelectItem>
                <SelectItem value="Silver" className="text-xs">
                  Silver
                </SelectItem>
                <SelectItem value="Bronze" className="text-xs">
                  Bronze
                </SelectItem>
              </SelectTrigger>
            </Select>

            <Select
              value={dateRange}
              onValueChange={setDateRange}
            >
              <SelectTrigger
                value={dateRange}
                onChange={handleDateRangeChange}
                className="w-36 h-9 text-xs border border-gray-300"
              >
                <SelectValue placeholder="This Year" />
                <SelectItem value="today" className="text-xs">
                  Today
                </SelectItem>
                <SelectItem value="week" className="text-xs">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-xs">
                  This Month
                </SelectItem>
                <SelectItem value="quarter" className="text-xs">
                  This Quarter
                </SelectItem>
                <SelectItem value="year" className="text-xs">
                  This Year
                </SelectItem>
                <SelectItem value="custom" className="text-xs">
                  Custom Range
                </SelectItem>
              </SelectTrigger>
            </Select>

            {showCustomRange && (
              <>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(
                    e,
                  ) => setFromDate(e.target.value)}
                  className="w-36 h-9 text-xs"
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(
                    e,
                  ) => setToDate(e.target.value)}
                  className="w-36 h-9 text-xs"
                  placeholder="To"
                />
              </>
            )}

            <Button
              onClick={handleApplyFilters}
              className="h-9 text-xs bg-blue-500 hover:bg-blue-600"
            >
              Apply Filters
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-9 text-xs border border-gray-300"
            >
              Refresh
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
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Orders
              </p>
              <h3 className="text-lg font-semibold">
                {stats.totalOrders.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Revenue
              </p>
              <h3 className="text-lg font-semibold">
                ₹{stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Customers
              </p>
              <h3 className="text-lg font-semibold">
                {stats.totalCustomers.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Active Branches
              </p>
              <h3 className="text-lg font-semibold">
                {stats.activeBranches}
              </h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center">
              <Building2 className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-white border border-gray-200 rounded-md p-1">
          <TabsTrigger
            value="overview"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <BarChart3 className="h-4 w-4 mr-1" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <TrendingUp className="h-4 w-4 mr-1" /> Sales
            Reports
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <Users className="h-4 w-4 mr-1" /> Customer Reports
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <Package className="h-4 w-4 mr-1" /> Order Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">Revenue</h3>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#3B82F6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 text-xs">
                  No data available for selected filters
                </div>
              )}
            </Card>

            {/* Top Selling Products */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">
                Top Selling Products
              </h3>
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
                        {topSellingProducts.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 w-1/2 pr-4">
                    {topSellingProducts.map(
                      (product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: product.color,
                              }}
                            />
                            <span className="text-xs truncate">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium">
                            {product.value} units
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 text-xs">
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e0e0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#666" }}
                    tickLine={false}
                    axisLine={{
                      stroke: "e0e0e0",
                      strokeWidth: 2,
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#666" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e0e0e0", strokeWidth: 2, }}
                    domain={[0, "auto"]}
                    ticks={[
                      0, 200, 400, 600, 800, 1000, 1200, 1400,
                      1600, 1800,
                    ]}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      fontSize: "11px",
                      padding: "2px 0",
                    }}
                    formatter={(
                      value,
                      name,
                    ) => {
                      if (name === "sales") {
                        return [
                          `₹${Number(value).toLocaleString()}`,
                          "Sales",
                        ];
                      }
                      if (name === "profit") {
                        return [
                          `₹${Number(value).toLocaleString()}`,
                          "Profit",
                        ];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="line"
                    formatter={(value) => {
                      if (!value) return "";
                      return (
                        value.charAt(0).toUpperCase() +
                        value.slice(1)
                      );
                    }}
                  />
                  {/* Sales line - Dark Blue */}
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#15eeeeff"
                    strokeWidth={2.5}
                    dot={{
                      r: 5,
                      fill: "#15eeeeff",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                    name="Sales"
                  />
                  {/* Profit line - Green */}
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{
                      r: 5,
                      fill: "#10B981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 text-xs">
                No data available for selected filters
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Membership Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  Membership Performance
                </h3>
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
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">
                            {branch.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {branch.orders} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹
                            {branch.revenue.toLocaleString(
                              "en-IN",
                              { minimumFractionDigits: 2 },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No data available for selected filters
                  </div>
                )}
              </div>
            </Card>

            {/* Average Order Value */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">
                Average Order Value
              </h3>
              <div className="text-center py-6">
                <h2 className="text-4xl font-bold text-blue-600 mb-2">
                  ₹
                  {stats.totalOrders > 0
                    ? (
                      stats.totalRevenue / stats.totalOrders
                    ).toFixed(2)
                    : "0.00"}
                </h2>
                <p className="text-xs text-green-600 mb-6 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Based on
                  filtered data
                </p>
                <div className="space-y-2 text-left mt-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Total Orders:
                    </span>
                    <span className="font-medium">
                      {stats.totalOrders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Total Revenue:
                    </span>
                    <span className="font-medium">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </span>
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
              <h3 className="font-medium mb-4">
                New vs Returning Customers
              </h3>
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
                      {newVsReturningData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* High-Value Customers */}
            <Card className="p-6">
              <h3 className="font-medium mb-4">
                High-Value Customers
              </h3>
              <div className="space-y-3">
                {highValueCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-blue-600">
                          {customer.initials}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {customer.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {customer.orders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ₹
                          {customer.revenue.toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 },
                          )}
                        </p>
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
              <h3 className="font-medium mb-6">
                Orders by Status
              </h3>
              <div className="space-y-4">
                {ordersByStatus.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: status.color,
                        }}
                      />
                      <span className="text-sm">
                        {status.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        {status.count.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {status.percentage}
                      </span>
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar
                    dataKey="orders"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};