import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { fetchOrders } from "@/lib/Apis"; // Import the fetchOrders function

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

  const dailyOrders = [
    {day:"mon", value: orders.length}
  ];

  const dailyCollection = [
    {day: 'mon', value: orders.total_price}
  ]

  
  
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
    <div className="p-4 flex flex-col items-center bg-gray-50 min-h-screen">
      
      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full p-4 mb-4">
        <Card className="p-6 bg-[#E5EDE5] shadow-md">
          <div className="flex justify-between mb-2 text-gray-600 text-sm">Total Orders</div>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <ResponsiveContainer height={50}>
            <LineChart data={dailyOrders}>
              <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} dot />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-[#FFE9B6] shadow-md">
          <div className="flex justify-between mb-2 text-gray-600 text-sm">Total Price</div>
          <div className="text-2xl font-bold">₹ {totalOrders}</div>
          <ResponsiveContainer height={50}>
            <LineChart data={dailyOrders}>
              <Line type="monotone" dataKey="value" stroke="#FFA000" strokeWidth={2} dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-[#8B8BFF] text-white shadow-md">
          <div className="text-lg font-semibold">Total Quantity</div>
          <ResponsiveContainer height={50}>
            <LineChart data={dailyOrders}>
              <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-[#8D6E63] text-white sm:col-span-2 xl:col-span-1 shadow-md">
          <div className="text-lg font-semibold">Success Orders</div>
          <p className="text-sm">{successOrders} Orders</p>
          <ResponsiveContainer height={50}>
            <LineChart data={dailyOrders}>
              <Line type="monotone" dataKey="value" stroke="#FF5722" strokeWidth={2} dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <Button variant="secondary" className="w-full mt-4">View Details</Button>
        </Card>
      </div>

      {/* Order Table */}
      <Card className="w-full shadow-lg rounded-xl bg-white overflow-x-auto">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Order Tracking</h2>

          {loading ? (
            <div className="text-center text-gray-600">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[700px] border-collapse">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="p-4">Product</TableHead>
                    <TableHead className="p-4">User Name</TableHead>
                    <TableHead className="p-4">Order Date</TableHead>
                    <TableHead className="p-4">Total Amount</TableHead>
                    <TableHead className="p-4">Paid Amount</TableHead>
                    <TableHead className="p-4">Remaining Amount</TableHead>
                    <TableHead className="p-4">Quantity</TableHead>
                    <TableHead className="p-4 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-b hover:bg-gray-100">
                      <TableCell className="p-4">{order.product_name}</TableCell>
                      <TableCell className="p-4">{order.user_name}</TableCell>
                      <TableCell className="p-4">{order.created_at}</TableCell>
                      <TableCell className="p-4">₹ {order.total_price}</TableCell>
                      <TableCell className="p-4">₹ {order.Paid_Amount}</TableCell>
                      <TableCell className="p-4">₹ {order.Remaing_Amount}</TableCell>
                      <TableCell className="p-4">{order.quantity}</TableCell>
                      <TableCell className="p-4 flex items-center gap-2 justify-end">
                        <Badge
                          className={`px-3 py-1 text-white text-sm rounded-full ${
                            order.status === "Success" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
