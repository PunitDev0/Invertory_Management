import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { FaShoppingCart, FaBox, FaUsers, FaRupeeSign } from 'react-icons/fa';

const weeklyData = [
  { day: "Mon", value: 10000 },
  { day: "Tue", value: 33567 },
  { day: "Wed", value: 45000 },
  { day: "Thu", value: 20000 },
  { day: "Fri", value: 10000 },
  { day: "Sat", value: 35000 },
  { day: "Sun", value: 25000 },
]

export function DashboardContent({ productData = [], orders = [], UserData = [] }) {
  // Calculate total revenue from orders
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  console.log(productData);
  
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
              <div className="text-sm text-green-600">+17%</div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyData}>
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
              <div className="text-2xl font-bold mb-4">{productData.length}</div>
              {productData}
              <div className="text-sm text-yellow-600">+23%</div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FFA000"
                  strokeWidth={2}
                  dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Unique Customers Card */}
          <Card className="p-6 bg-[#ffb6b6] items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <FaUsers />
                Unique Customers
              </div>
              <div className="text-2xl font-bold mb-4">{UserData.length}</div>
              <div className="text-sm text-green-600">+23%</div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyData}>
                <Line
                  type="monotone"
                  dataKey="value"
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
              <div className="text-sm text-green-600">+23%</div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={weeklyData}>
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
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
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
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2D2D2D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 h-fit">
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
          </Card>
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
          strokeDasharray={`${60 * 2.51} ${100 * 2.51}`}
          transform="rotate(-90) translate(-100 0)" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#8B8BFF"
          strokeWidth="20"
          strokeDasharray={`${24 * 2.51} ${100 * 2.51}`}
          transform="rotate(-90) translate(-100 0)"
          strokeDashoffset={`${-60 * 2.51}`} />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#FFE9B6"
          strokeWidth="20"
          strokeDasharray={`${16 * 2.51} ${100 * 2.51}`}
          transform="rotate(-90) translate(-100 0)"
          strokeDashoffset={`${-84 * 2.51}`} />
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