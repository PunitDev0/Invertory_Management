import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { fetchOrders } from "@/lib/Apis"; // Import the fetchOrders function

const weeklyData = [
  { day: "Mon", value: 10000 },
  { day: "Tue", value: 33567 },
  { day: "Wed", value: 45000 },
  { day: "Thu", value: 20000 },
  { day: "Fri", value: 10000 },
  { day: "Sat", value: 35000 },
  { day: "Sun", value: 25000 },
];

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // to show loading state

  useEffect(() => {
    // Fetch orders on component mount
    const getOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const totalOrders = orders.length;
  // const totalPrice = orders.reduce((sum, order) => sum + order.price, 0).toFixed(2);
  // const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);
  const successOrders = orders.filter(order => order.status === "Success").length;

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
      <Card className="grid gap-6 grid-cols-2 xl:grid-cols-4 w-full sticky top-16 z-50 p-4 mb-4 shadow-xl">
        <Card className="p-6 bg-[#E5EDE5]">
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-2xl font-bold mb-4">{totalOrders}</div>
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
            <div className="text-sm text-gray-600">Total Price</div>
          </div>
          {/* <div className="text-2xl font-bold mb-4">${totalPrice}</div> */}
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

        <Card className="p-6 bg-[#8B8BFF] text-white">
          <div className="text-lg font-semibold mb-2">Total Quantity</div>
          {/* <div className="text-2xl font-bold mb-4">{totalQuantity}</div> */}
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

        <Card className="p-6 bg-[#8D6E63] text-white sm:col-span-2 xl:col-span-1">
          <div className="text-lg font-semibold mb-2">Success Orders</div>
          <p className="text-sm mb-4">{successOrders} Orders</p>
          <ResponsiveContainer height={50}>
            <LineChart data={weeklyData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FF5722"
                strokeWidth={2}
                dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <Button variant="secondary" className="w-full mt-4">
            View Details
          </Button>
        </Card>
      </Card>

      <Card className="w-full shadow-xl rounded-xl bg-white">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Order Tracking</h2>

          {loading ? (
            <div className="text-center text-gray-600">Loading orders...</div>
          ) : (
            <Table className="w-full border-collapse mt-8">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead className="text-left p-4 text-lg font-semibold">Product</TableHead>
                  <TableHead className="text-left p-4 text-lg font-semibold">User Id</TableHead>
                  <TableHead className="text-left p-4 text-lg font-semibold">Order Date</TableHead>
                  <TableHead className="text-left p-4 text-lg font-semibold">Price</TableHead>
                  <TableHead className="text-left p-4 text-lg font-semibold">Quantity</TableHead>
                  <TableHead className="text-right p-4 text-lg font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-b hover:bg-gray-100">
                    <TableCell className="p-4 text-gray-700">{order.id}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.user_id}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.created_at}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.price}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.quantity}</TableCell>
                    <TableCell className="p-4 flex items-center gap-2 justify-end">
                      {/* <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[130px] border-gray-300 rounded-md text-gray-700">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Success">Success</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <Badge
                        className={cn(
                          "px-3 py-1 text-white text-sm rounded-full",
                          order.status === "Success" ? "bg-green-500" : "bg-yellow-500"
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
