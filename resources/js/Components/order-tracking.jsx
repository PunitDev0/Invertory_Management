import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { fetchOrders } from "@/lib/Apis"; // Import the fetchOrders function
import { IndianRupee } from "lucide-react";

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
  const [selectedOrder, setSelectedOrder] = useState(null); // to store the selected order details

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
  const successOrders = orders.filter(order => order.status === "Success").length;

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', year: 'numeric' });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
    

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
                  <TableRow key={order.id} className="border-b hover:bg-gray-100" onClick={() => handleOrderClick(order)}>
                    <TableCell className="p-4 text-gray-700">{order.product_name}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.user_id}</TableCell>
                    <TableCell className="p-4 text-gray-700">{formatDate(order.created_at)} at {formatTime(order.created_at)}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.product_price}</TableCell>
                    <TableCell className="p-4 text-gray-700">{order.quantity}</TableCell>
                    <TableCell className="p-4 flex items-center gap-2 justify-end">
                      <Badge
                        className={cn(
                          "px-3 py-1 text-white text-sm rounded-full",
                          order.pending_payment !== "0" ? "bg-red-500" : "bg-green-500"
                        )}
                      >
                        {order.pending_payment !== "0" ? "Pending" : "Paid"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-1/2 p-6">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <div className="space-y-4">
                <p><strong>ID:</strong> {selectedOrder.id}</p>
                <p><strong>User ID:</strong> {selectedOrder.user_id}</p>
                <p><strong>Product ID:</strong> {selectedOrder.product_id}</p>
                <p><strong>Product Name:</strong> {selectedOrder.product_name}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.created_at)} at {formatTime(selectedOrder.created_at)}</p>
                <p><strong>Updated At:</strong> {formatDate(selectedOrder.updated_at)} at {formatTime(selectedOrder.updated_at)}</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p className="flex items-center"><strong>Product Price:</strong> <IndianRupee size={20}/>{selectedOrder.product_price}</p>
                <p><strong>User Name:</strong> {selectedOrder.user_name}</p>
                <p><strong>User Email:</strong> {selectedOrder.user_email}</p>
                <p><strong>User Phone:</strong> {selectedOrder.user_phone}</p>
                <p><strong>User Address:</strong> {selectedOrder.user_address}</p>
                <p><strong>User City:</strong> {selectedOrder.user_city}</p>
                <p><strong>User Zip:</strong> {selectedOrder.user_zip}</p>
                <p className="flex items-center"><strong>Paid Payment:</strong> <IndianRupee size={20}/>{selectedOrder.paid_payment}</p>
                <p className="flex items-center"><strong>Pending Payment:</strong> <IndianRupee size={20}/>{selectedOrder.pending_payment}</p>
                <p className="flex items-center"><strong>Total Amount:</strong> <IndianRupee size={20}/>{selectedOrder.total_amount}</p>
              </div>
              <Button onClick={closeModal} className="mt-4">Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
