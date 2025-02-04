import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Navbar } from "./navbar"

const weeklyData = [
  { day: "Mon", value: 10000 },
  { day: "Tue", value: 33567 },
  { day: "Wed", value: 45000 },
  { day: "Thu", value: 20000 },
  { day: "Fri", value: 10000 },
  { day: "Sat", value: 35000 },
  { day: "Sun", value: 25000 },
]

const recentSales = [
  { name: "Steven Summer", amount: 52.0, time: "02 Minutes Ago" },
  { name: "Jordan Maizee", amount: 83.0, time: "02 Minutes Ago" },
  { name: "Jessica Alba", amount: 61.6, time: "05 Minutes Ago" },
  { name: "Anna Armas", amount: 2351.0, time: "05 Minutes Ago" },
  { name: "Angelina Boo", amount: 152.0, time: "10 Minutes Ago" },
  { name: "Anastasia Koss", amount: 542.0, time: "12 Minutes Ago" },
]

const lastOrders = [
  { name: "David Astee", amount: 1456, status: "Chargeback", date: "11 Sep 2022" },
  { name: "Maria Hulama", amount: 42437.8, status: "Completed", date: "11 Sep 2022" },
  { name: "Arnold Swarz", amount: 3412, status: "Completed", date: "11 Sep 2022" },
]

export function DashboardContent() {
  return (
    (<div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 relative">
      {/* <Navbar/> */}
      <div className="max-w-[2000px] mx-auto space-y-8">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="p-6 bg-[#E5EDE5]">
            <div className="flex justify-between mb-4">
              <div className="text-sm text-gray-600">Balance</div>
              <div className="text-sm text-green-600">+17%</div>
            </div>
            <div className="text-2xl font-bold mb-4">$ 56,874</div>
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

          <Card className="p-6 bg-[#FFE9B6]">
            <div className="flex justify-between mb-4">
              <div className="text-sm text-gray-600">Sales</div>
              <div className="text-sm text-yellow-600">+23%</div>
            </div>
            <div className="text-2xl font-bold mb-4">$ 24,575</div>
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

          <Card className="p-6 bg-[#8B8BFF] text-white sm:col-span-2 xl:col-span-1">
            <div className="text-lg font-semibold mb-2">Upgrade</div>
            <p className="text-sm mb-4">Get more information and opportunities</p>
            <Button variant="secondary" className="w-full">
              Go Pro
            </Button>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="p-6">
            <div
              className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">User in The Last Week</h3>
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

          <Card className="p-6">
            <div
              className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">Monthly Profits</h3>
              <div className="text-sm text-gray-500">Total Profit Growth of 26%</div>
            </div>
            <div className="h-[300px] sm:h-[400px]">
              <PieChart
                data={[
                  { name: "Giveaway", value: 60 },
                  { name: "Affiliate", value: 24 },
                  { name: "Offline", value: 16 },
                ]} />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="p-6">
            <div
              className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">Last Orders</h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="text-sm text-gray-500">Data Updates Every 3 Hours</div>
                <Button variant="ghost" className="text-sm">
                  View All Orders
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {lastOrders.map((order) => (
                <div
                  key={order.name}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.name}</div>
                      <div className="text-sm text-gray-500">${order.amount}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:gap-8">
                    <div className="text-sm text-gray-500">{order.status}</div>
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div
              className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">Recent Sales</h3>
              <Button variant="ghost" className="text-sm">
                See All
              </Button>
            </div>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    </Avatar>
                    <div>
                      <div className="font-medium">{sale.name}</div>
                      <div className="text-sm text-gray-500">{sale.time}</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-medium">+${sale.amount}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>)
  );
}

function PieChart({
  data
}) {
  return (
    (<div className="relative">
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
    </div>)
  );
}

