import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { IndianRupee } from "lucide-react";

export default function OrderTracking({ userorders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

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
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">All User Orders</h2>

          {userorders.length === 0 ? (
            <div className="text-center text-gray-600">No orders found</div>
          ) : (
            <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {userorders.map((order) => (
                <div
                  key={order.id}
                  className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
                  onClick={() => handleOrderClick(order)}
                >
                  <h3 className="text-xl font-semibold text-gray-800">Order ID: {order.id}</h3>
                  <p className="text-gray-600">User: {order.user_name}</p>
                  <p className="text-gray-600">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <IndianRupee size={18} />
                      <span className="text-gray-700">{order.total_amount}</span>
                    </div>
                    <Badge
                      className={cn(
                        "px-3 py-1 text-white text-sm rounded-full",
                        order.pending_payment !== "0.00" ? "bg-red-500" : "bg-green-500"
                      )}
                    >
                      {order.pending_payment !== "0.00" ? "Pending" : "Paid"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
                <p><strong>User Name:</strong> {selectedOrder.user_name}</p>
                <p><strong>User Email:</strong> {selectedOrder.user_email}</p>
                <p><strong>User Phone:</strong> {selectedOrder.user_phone}</p>
                <p><strong>User Address:</strong> {selectedOrder.user_address}</p>
                <p><strong>User City:</strong> {selectedOrder.user_city}</p>
                <p><strong>User Zip:</strong> {selectedOrder.user_zip}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.created_at)} at {formatTime(selectedOrder.created_at)}</p>
                <p><strong>Updated At:</strong> {formatDate(selectedOrder.updated_at)} at {formatTime(selectedOrder.updated_at)}</p>
                <p className="flex items-center"><strong>Total Amount:</strong> <IndianRupee size={20} />{selectedOrder.total_amount}</p>
                <p className="flex items-center"><strong>Paid Payment:</strong> <IndianRupee size={20} />{selectedOrder.paid_payment}</p>
                <p className="flex items-center"><strong>Pending Payment:</strong> <IndianRupee size={20} />{selectedOrder.pending_payment}</p>
                <p><strong>Products:</strong></p>
                <ul>
                  {selectedOrder.products.map((product, index) => (
                    <li key={index}>
                      <strong>Product Name:</strong> {product.product_name}, <strong>Quantity:</strong> {product.quantity}, <strong>Price:</strong> <IndianRupee size={15} />{product.product_price}
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={closeModal} className="mt-4">Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}