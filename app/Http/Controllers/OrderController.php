<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAllOrders(Request $request)
    {
        // Fetch all orders (add pagination or filtering as needed)
        $orders = Order::all(); 

        // Return the orders as a JSON response
        return response()->json(['orders' => $orders], 200);
    }
}
