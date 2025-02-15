<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAllOrders(Request $request)
    {
        // Fetch all orders and return as JSON
        $orders = Order::select(
                'id',
                'user_name',
                'user_email',
                'user_phone',
                'user_address',
                'user_city',
                'user_zip',
                'paid_payment',
                'total_amount',
                'pending_payment',
                'products',
                'created_at',
                'updated_at'
            )
            ->orderBy('created_at', 'desc')
            ->get();

        // Decode the JSON `products` field
        $orders->transform(function ($order) {
            $order->products = json_decode($order->products, true);
            return $order;
        });

        return response()->json(['userorders' => $orders], 200);
    }
}
