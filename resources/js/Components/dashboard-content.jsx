import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { FaShoppingCart, FaBox, FaUsers, FaRupeeSign, FaChartLine, FaCalendarAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Custom table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the COLORS array for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function DashboardContent({ GetAllProducts = [], orders = [], AllUsers = [], activities = [] }) {
  const [timeRange, setTimeRange] = useState("week");
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Calculate total revenue from orders
  const totalRevenue = orders.reduce((acc, order) => acc + parseFloat(order.price || 0), 0);

  // Get date ranges based on selected timeRange
  const getDateRange = () => {
    const now = new Date();
    const ranges = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    };
    return ranges[timeRange] || ranges.week;
  };

  const startDate = getDateRange();

  // Filter data based on selected time range
  const filteredOrders = orders.filter(order => new Date(order.updated_at) >= startDate);
  const filteredProducts = GetAllProducts.filter(product => new Date(product.updated_at) >= startDate);
  const filteredUsers = AllUsers.filter(user => new Date(user.created_at) >= startDate);

  // Get previous period data for comparison
  const previousStartDate = new Date(startDate.getTime() - (startDate - new Date().getTime()));
  const previousOrders = orders.filter(order => 
    new Date(order.updated_at) >= previousStartDate && new Date(order.updated_at) < startDate
  );
  const previousProducts = GetAllProducts.filter(product => 
    new Date(product.updated_at) >= previousStartDate && new Date(product.updated_at) < startDate
  );
  const previousUsers = AllUsers.filter(user => 
    new Date(user.created_at) >= previousStartDate && new Date(user.created_at) < startDate
  );
  const previousRevenue = previousOrders.reduce((acc, order) => acc + parseFloat(order.price || 0), 0);

  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const orderChange = calculateChange(filteredOrders.length, previousOrders.length);
  const productChange = calculateChange(filteredProducts.length, previousProducts.length);
  const userChange = calculateChange(filteredUsers.length, previousUsers.length);
  const revenueChange = calculateChange(totalRevenue, previousRevenue);

  // Prepare data for charts
  const prepareTimeSeriesData = () => {
    // Create a map to store data by date
    const dataByDate = new Map();
    
    // Get the appropriate time unit based on selected range
    const getTimeUnit = (date) => {
      switch(timeRange) {
        case 'week': return date.toISOString().split('T')[0]; // Daily for week
        case 'month': return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${Math.ceil(date.getDate() / 7)}`; // Weekly for month
        case 'quarter': return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Monthly for quarter
        case 'year': return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`; // Quarterly for year
        default: return date.toISOString().split('T')[0];
      }
    };
    
    // Initialize the map with all dates in the range
    let currentDate = new Date(startDate);
    while (currentDate <= new Date()) {
      const timeUnit = getTimeUnit(currentDate);
      if (!dataByDate.has(timeUnit)) {
        dataByDate.set(timeUnit, { 
          name: timeUnit,
          orders: 0,
          revenue: 0,
          users: 0,
          products: 0
        });
      }
      
      // Increment by appropriate amount based on time range
      switch(timeRange) {
        case 'week': currentDate.setDate(currentDate.getDate() + 1); break;
        case 'month': currentDate.setDate(currentDate.getDate() + 7); break;
        case 'quarter': currentDate.setMonth(currentDate.getMonth() + 1); break;
        case 'year': currentDate.setMonth(currentDate.getMonth() + 3); break;
        default: currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Populate with actual data
    filteredOrders.forEach(order => {
      const date = new Date(order.updated_at);
      const timeUnit = getTimeUnit(date);
      if (dataByDate.has(timeUnit)) {
        const data = dataByDate.get(timeUnit);
        data.orders += 1;
        data.revenue += parseFloat(order.price || 0);
      }
    });
    
    filteredUsers.forEach(user => {
      const date = new Date(user.created_at);
      const timeUnit = getTimeUnit(date);
      if (dataByDate.has(timeUnit)) {
        const data = dataByDate.get(timeUnit);
        data.users += 1;
      }
    });
    
    filteredProducts.forEach(product => {
      const date = new Date(product.updated_at);
      const timeUnit = getTimeUnit(date);
      if (dataByDate.has(timeUnit)) {
        const data = dataByDate.get(timeUnit);
        data.products += 1;
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(dataByDate.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const timeSeriesData = prepareTimeSeriesData();

  // Group users by role
  const usersByRole = filteredUsers.reduce((acc, user) => {
    const role = user.role || 'unknown';
    if (!acc[role]) {
      acc[role] = 0;
    }
    acc[role] += 1;
    return acc;
  }, {});

  // Transform role data for charts
  const roleData = Object.keys(usersByRole).map(role => ({
    name: role,
    value: usersByRole[role],
  }));

  // Find top products by order frequency
  useEffect(() => {
    // Count orders per product
    const productOrderCount = {};
    filteredOrders.forEach(order => {
      const productId = order.product_id;
      if (productId) {
        if (!productOrderCount[productId]) {
          productOrderCount[productId] = 0;
        }
        productOrderCount[productId] += 1;
      }
    });

    // Match with product data and sort
    const productsWithCount = GetAllProducts
      .map(product => ({
        ...product,
        orderCount: productOrderCount[product.id] || 0,
        revenue: (productOrderCount[product.id] || 0) * parseFloat(product.price || 0)
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5); // Get top 5

    setTopProducts(productsWithCount);

    // Get recent orders
    const recent = [...orders]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);
    setRecentOrders(recent);
  }, [filteredOrders, GetAllProducts, orders, timeRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 relative">
      <div className="max-w-[2000px] mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendarAlt />
              <span>View data for:</span>
            </div>
            <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Orders Card */}
          <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaShoppingCart className="text-blue-600" />
                  <span className="font-medium">Total Orders</span>
                </div>
                <div className="text-3xl font-bold mt-2">{filteredOrders.length}</div>
              </div>
              <Badge className={orderChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {orderChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(orderChange).toFixed(1)}%
              </Badge>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0070f3" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0070f3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#0070f3"
                    strokeWidth={2}
                    fill="url(#colorOrders)"
                    dot={false} />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Total Products Card */}
          <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBox className="text-amber-600" />
                  <span className="font-medium">Total Products</span>
                </div>
                <div className="text-3xl font-bold mt-2">{GetAllProducts.length}</div>
              </div>
              <Badge className={productChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {productChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(productChange).toFixed(1)}%
              </Badge>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="products"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#colorProducts)"
                    dot={false} />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Unique Customers Card */}
          <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUsers className="text-purple-600" />
                  <span className="font-medium">Unique Customers</span>
                </div>
                <div className="text-3xl font-bold mt-2">{AllUsers.length}</div>
              </div>
              <Badge className={userChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {userChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(userChange).toFixed(1)}%
              </Badge>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                    dot={false} />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Total Revenue Card */}
          <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaRupeeSign className="text-green-600" />
                  <span className="font-medium">Total Revenue</span>
                </div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</div>
              </div>
              <Badge className={revenueChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {revenueChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(revenueChange).toFixed(1)}%
              </Badge>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    dot={false} />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} formatter={(value) => formatCurrency(value)} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section - spans 2 columns */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-xl font-semibold">Performance Overview</h3>
              <p className="text-sm text-gray-500">
                Track your key metrics over time
              </p>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <defs>
                    <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0070f3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0070f3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      // Format based on time range
                      switch(timeRange) {
                        case 'week': return value.split('-').slice(1).join('-'); // Show MM-DD
                        case 'month': return value.split('-').slice(1).join('-'); // Show MM-W
                        case 'quarter': return value.split('-')[1]; // Show MM
                        case 'year': return value.split('-')[1]; // Show Q#
                        default: return value;
                      }
                    }}
                  />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#0070f3"
                    strokeWidth={2}
                    fill="url(#colorOrders2)" />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorRevenue2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* User Role Distribution */}
          <Card className="p-6">
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-xl font-semibold">Customer Segments</h3>
              <p className="text-sm text-gray-500">
                Distribution of users by role
              </p>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip formatter={(value) => `${value} users`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom Section - Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Top Selling Products</h3>
                <p className="text-sm text-gray-500">Products with highest order count</p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name || product.title || 'Unknown'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price || 0)}</TableCell>
                      <TableCell className="text-right">{product.orderCount}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                    </TableRow>
                  ))}
                  {topProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                        No product data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Recent Orders</h3>
                <p className="text-sm text-gray-500">Latest customer purchases</p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id || 'N/A'}</TableCell>
                      <TableCell>{order.customer_name || order.user_name || 'Unknown'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.price || 0)}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {order.status || 'Processing'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                        No recent orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        {activities.length > 0 && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest actions in your store</p>
              </div>
              <Button variant="outline" size="sm">View All Activity</Button>
            </div>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FaUsers />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{activity.action}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {activity.user}: {activity.details || 'Performed an action'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Keep the custom PieChart component
function PieChart({ data }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#E5EDE5"
          strokeWidth="20"
          strokeDasharray={`${data[0].value * 2.51} ${100 * 2.51}`}
          transform="rotate(-90) translate(-100 0)" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#8B8BFF"
          strokeWidth="20"
          strokeDasharray={`${data[1].value * 2.51} ${100 * 2.51}`}
          transform="rotate(-90) translate(-100 0)"
          strokeDashoffset={`${-data[0].value * 2.51}`} />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#FFE9B6"
          strokeWidth="20"
          strokeDasharray={`${data[2].value * 2.51} ${100 * 2.51}`}
          transform="rotate(-90) translate(-100 0)"
          strokeDashoffset={`${-(data[0].value + data[1].value) * 2.51}`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold">$76,356</div>
          <div className="text-sm text-gray-500">Revenue</div>
        </div>
      </div>
    </div>
  );
}