<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAllOrders(Request $request)
    {
        $orders = Order::select(
            'orders.id',
            'orders.quantity',
            'orders.total_price',
            'orders.Paid_Amount',
            'orders.Remaing_Amount',
            'orders.status',
            'orders.created_at',
            'orders.updated_at',
            'products.productName as product_name',
            'users.name as user_name'
        )
        ->leftJoin('products', 'orders.product_id', '=', 'products.id')
        ->leftJoin('users', 'orders.user_id', '=', 'users.id')
        ->get();
       
    
        return response()->json(['orders' => $orders], 200);
    }
    
}
