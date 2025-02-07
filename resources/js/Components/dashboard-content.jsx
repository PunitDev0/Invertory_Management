import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { FaShoppingCart, FaBox, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { Button } from "./ui/button";

export function DashboardContent({ GetAllProducts = [], orders = [], AllUsers = [] }) {
  // Calculate total revenue from orders
  const totalRevenue = orders.reduce((acc, order) => acc + parseFloat((order.price || 0)), 0);

  // Previous week's total data (you can modify this as per your requirement)
  const previousOrders = orders.filter(order => new Date(order.updated_at) < new Date().setDate(new Date().getDate() - 7));
  const previousProducts = GetAllProducts.filter(product => new Date(product.updated_at) < new Date().setDate(new Date().getDate() - 7));
  const previousUsers = AllUsers.filter(user => new Date(user.created_at) < new Date().setDate(new Date().getDate() - 7));

  // Calculate percentage change for Total Orders
  const orderChange = previousOrders.length
    ? ((orders.length - previousOrders.length) / previousOrders.length) * 100
    : 0;

  // Calculate percentage change for Total Products
  const productChange = previousProducts.length
    ? ((GetAllProducts.length - previousProducts.length) / previousProducts.length) * 100
    : 0;

  // Calculate percentage change for Unique Customers
  const userChange = previousUsers.length
    ? ((AllUsers.length - previousUsers.length) / previousUsers.length) * 100
    : 0;

  // Calculate percentage change for Total Revenue
  const previousRevenue = previousOrders.reduce((acc, order) => acc + parseFloat((order.price || 0)), 0);
  const revenueChange = previousRevenue
    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  // Data for charts (weekly data or any specific period)
  const weeklyOrders = orders.map(order => ({
    date: order.updated_at,
    value: order.price, // Total price for the order
  }));

  const weeklyProducts = GetAllProducts.map(Products => ({
    date: Products.updated_at,
    value: Products.price, // Price of the product
  }));

  const weeklyUsers = AllUsers.reduce((acc, user) => {
    const createdAt = new Date(user.created_at);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Check if the user was created in the last week
    if (createdAt >= lastWeek) {
      const role = user.role;
      if (!acc[role]) {
        acc[role] = 0;
      }
      acc[role] += 1; // Increment the count for that role
    }
    return acc;
  }, {});

  // Transform the data to be used in the chart
  const formattedData = Object.keys(weeklyUsers).map(role => ({
    role: role,
    count: weeklyUsers[role],
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 relative">
      <div className="max-w-[2000px] mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Orders Card */}
          <Card className="p-6 bg-[#E5EDE5] items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <FaShoppingCart />
                Total Orders
              </div>
              <div className="text-2xl font-bold mb-4">{orders.length}</div>
              <div className={`text-sm ${orderChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {orderChange >= 0 ? '+' : ''}{orderChange.toFixed(2)}%
              </div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyOrders}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Total Products Card */}
          <Card className="p-6 bg-[#FFE9B6] items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <FaBox />
                Total Products
              </div>
              <div className="text-2xl font-bold mb-4">{GetAllProducts.length}</div>
              <div className={`text-sm ${productChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {productChange >= 0 ? '+' : ''}{productChange.toFixed(2)}%
              </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyProducts}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FFA000"
                  strokeWidth={2}
                  dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </Card>

          {/* Unique Customers Card */}
          <Card className="p-6 bg-[#ffb6b6] items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <FaUsers />
                Unique Customers
              </div>
              <div className="text-2xl font-bold mb-4">{AllUsers.length}</div>
              <div className={`text-sm ${userChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {userChange >= 0 ? '+' : ''}{userChange.toFixed(2)}%
              </div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={formattedData}>
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="red"
                  strokeWidth={2}
                  dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Total Revenue Card */}
          <Card className="p-6 bg-[#cdffb6] items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <FaRupeeSign />
                Total Revenue
              </div>
              <div className="text-2xl font-bold mb-4 flex items-center">
                <FaRupeeSign size={20} />
                {totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className={`text-sm ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(2)}%
              </div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyOrders}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="green"
                  strokeWidth={2}
                  dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="">
          <Card className="p-6">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Users in The Last Week</h3>
                <div className="text-2xl font-bold text-green-600">+ 3.2%</div>
              </div>
              <Button variant="ghost" className="shrink-0">
                See statistics for all time
              </Button>
            </div>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2D2D2D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* <Card className="p-6 h-fit">
            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">Monthly Profits</h3>
              <div className="text-sm text-gray-500">Total Profit Growth of 26%</div>
            </div>
            <div className="">
              <PieChart
                data={[
                  { name: "Giveaway", value: 60 },
                  { name: "Affiliate", value: 24 },
                  { name: "Offline", value: 16 },
                ]} />
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

// PieChart component remains the same
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
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
}
