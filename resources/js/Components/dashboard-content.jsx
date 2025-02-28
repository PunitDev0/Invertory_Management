import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { FaShoppingCart, FaBox, FaUsers, FaRupeeSign, FaChartLine, FaCalendarAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Convert date strings to Date objects, null means no filter
  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  // Filter data: show all if no date range is set
  const filteredOrders = startDate || endDate
    ? orders.filter(order => {
        const orderDate = new Date(order.updated_at);
        return (!startDateObj || orderDate >= startDateObj) && (!endDateObj || orderDate <= endDateObj);
      })
    : orders;

  const filteredProducts = startDate || endDate
    ? GetAllProducts.filter(product => {
        const productDate = new Date(product.updated_at);
        return (!startDateObj || productDate >= startDateObj) && (!endDateObj || productDate <= endDateObj);
      })
    : GetAllProducts;

  const filteredUsers = startDate || endDate
    ? AllUsers.filter(user => {
        const userDate = new Date(user.created_at);
        return (!startDateObj || userDate >= startDateObj) && (!endDateObj || userDate <= endDateObj);
      })
    : AllUsers;

  // Calculate total revenue from filtered orders
  const totalRevenue = filteredOrders.reduce((acc, order) => acc + parseFloat(order.paid_payment || 0), 0);

  // Previous period for comparison (only when date range is set)
  const getPreviousRange = () => {
    if (!startDateObj || !endDateObj) return { prevStart: null, prevEnd: null };
    const duration = endDateObj - startDateObj;
    const prevEnd = new Date(startDateObj.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return { prevStart, prevEnd };
  };

  const { prevStart, prevEnd } = getPreviousRange();

  const previousOrders = prevStart && prevEnd
    ? orders.filter(order => {
        const orderDate = new Date(order.updated_at);
        return orderDate >= prevStart && orderDate <= prevEnd;
      })
    : [];

  const previousProducts = prevStart && prevEnd
    ? GetAllProducts.filter(product => {
        const productDate = new Date(product.updated_at);
        return productDate >= prevStart && productDate <= prevEnd;
      })
    : [];

  const previousUsers = prevStart && prevEnd
    ? AllUsers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate >= prevStart && userDate <= prevEnd;
      })
    : [];

  const previousRevenue = previousOrders.reduce((acc, order) => acc + parseFloat(order.paid_payment || 0), 0);

  // Calculate percentage changes (0 if no range is set)
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const orderChange = startDate && endDate ? calculateChange(filteredOrders.length, previousOrders.length) : 0;
  const productChange = startDate && endDate ? calculateChange(filteredProducts.length, previousProducts.length) : 0;
  const userChange = startDate && endDate ? calculateChange(filteredUsers.length, previousUsers.length) : 0;
  const revenueChange = startDate && endDate ? calculateChange(totalRevenue, previousRevenue) : 0;

  // Prepare time series data (full range initially)
  const prepareTimeSeriesData = () => {
    const dataByDate = new Map();

    // Determine full range or custom range
    const earliestDate = new Date(Math.min(
      ...orders.map(o => new Date(o.updated_at).getTime()),
      ...GetAllProducts.map(p => new Date(p.updated_at).getTime()),
      ...AllUsers.map(u => new Date(u.created_at).getTime()),
      Date.now() // Ensure we have a valid minimum
    ));
    const latestDate = new Date(Math.max(
      ...orders.map(o => new Date(o.updated_at).getTime()),
      ...GetAllProducts.map(p => new Date(p.updated_at).getTime()),
      ...AllUsers.map(u => new Date(u.created_at).getTime()),
      Date.now() // Ensure we have a valid maximum
    ));

    let currentDate = startDateObj || earliestDate;
    const end = endDateObj || latestDate;

    while (currentDate <= end) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dataByDate.set(dateKey, {
        name: dateKey,
        orders: 0,
        revenue: 0,
        users: 0,
        products: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate with all data initially, filtered data when range is set
    filteredOrders.forEach(order => {
      const date = new Date(order.updated_at).toISOString().split('T')[0];
      if (dataByDate.has(date)) {
        const data = dataByDate.get(date);
        data.orders += 1;
        data.revenue += parseFloat(order.paid_payment || 0);
      }
    });

    filteredUsers.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      if (dataByDate.has(date)) {
        dataByDate.get(date).users += 1;
      }
    });

    filteredProducts.forEach(product => {
      const date = new Date(product.updated_at).toISOString().split('T')[0];
      if (dataByDate.has(date)) {
        dataByDate.get(date).products += 1;
      }
    });

    return Array.from(dataByDate.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const timeSeriesData = prepareTimeSeriesData();

  // Group users by role
  const usersByRole = filteredUsers.reduce((acc, user) => {
    const role = user.role || 'unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const roleData = Object.keys(usersByRole).map(role => ({
    name: role,
    value: usersByRole[role],
  }));

  // Find top products and recent orders
  useEffect(() => {
    const productOrderCount = {};
    filteredOrders.forEach(order => {
      const productId = order.product_id;
      if (productId) {
        productOrderCount[productId] = (productOrderCount[productId] || 0) + 1;
      }
    });

    const productsWithCount = GetAllProducts
      .map(product => ({
        ...product,
        orderCount: productOrderCount[product.id] || 0,
        revenue: (productOrderCount[product.id] || 0) * parseFloat(product.price || 0),
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    setTopProducts(productsWithCount);

    const recent = [...filteredOrders] // Always show latest from filtered orders
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);
    setRecentOrders(recent);
  }, [filteredOrders, GetAllProducts]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendarAlt />
              <span>View data for:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full sm:w-[180px]"
                  />
                  <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full sm:w-[180px]"
                  />
                  <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
                    dot={false}
                  />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBox className="text-amber-600" />
                  <span className="font-medium">Total Products</span>
                </div>
                <div className="text-3xl font-bold mt-2">{filteredProducts.length}</div>
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
                    dot={false}
                  />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUsers className="text-purple-600" />
                  <span className="font-medium">Unique Customers</span>
                </div>
                <div className="text-3xl font-bold mt-2">{filteredUsers.length}</div>
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
                    dot={false}
                  />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

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
                    dot={false}
                  />
                  <Tooltip labelFormatter={(value) => `Date: ${value}`} formatter={(value) => formatCurrency(value)} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 lg:col-span-2">
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-xl font-semibold">Performance Overview</h3>
              <p className="text-sm text-gray-500">Track your key metrics over time</p>
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
                    tickFormatter={(value) => value.split('-').slice(1).join('-')} // Show MM-DD
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
                    fill="url(#colorOrders2)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorRevenue2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-xl font-semibold">Customer Segments</h3>
              <p className="text-sm text-gray-500">Distribution of users by role</p>
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
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Top Selling Products</h3>
                <p className="text-sm text-gray-500">Products with highest order count</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.productName || product.title || 'Unknown'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price || 0)}</TableCell>
                    </TableRow>
                  ))}
                  {topProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500 py-4">
                        No product data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Recent Orders</h3>
                <p className="text-sm text-gray-500">Latest customer purchases</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Pending_Amount</TableHead>
                    <TableHead className="text-right">Paid_Amount</TableHead>
                    <TableHead className="text-right">Total_Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id || 'N/A'}</TableCell>
                      <TableCell>{order.customer_name || order.user_name || 'Unknown'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.pending_payment || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.paid_payment || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.total_amount || 0)}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={
                            `${order.status === "pending" && 'bg-red-500'}
                             ${order.status === "paid" && 'bg-green-500'}
                             ${order.status === "canceled" && 'bg-orange-500'}`
                          }
                        >
                          {order.status === "pending" && 'Processing'}
                          {order.status === "paid" && 'Paid'}
                          {order.status === "canceled" && 'Canceled'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                        No recent orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

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

// Keep the custom PieChart component (unchanged)
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