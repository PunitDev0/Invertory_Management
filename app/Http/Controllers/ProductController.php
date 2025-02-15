<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Function to add a product
    public function addProduct(Request $request)
{
    // Validate the request data
    $request->validate([
        'productName' => 'required|string|max:255',
        'companyName' => 'sometimes|string|max:255',
        'shop_name' => 'sometimes|string|max:20', // Ensure shop_id is numeric
        'category' => 'required|string|max:255',
        'owned_imported' => 'required|in:owned,imported',
        'price' => 'required|numeric',
        'stock_quantity' => 'required|integer',
        'description' => 'required|string',
    ]);

    // Create the product
    $product = Product::create([
        'productName' => $request->productName,
        'companyName' => $request->companyName,
        'shop_name' => $request->shop_name, // Store shop_id instead of shop_name
        'category' => $request->category,
        'owned_imported' => $request->owned_imported,
        'price' => $request->price,
        'stock_quantity' => $request->stock_quantity,
        'description' => $request->description,
    ]);

    // Return a success response
    return response()->json(['message' => 'Product added successfully!', 'product' => $product], 201);
}
    

    public function updateProduct(Request $request, $id)
    {
        $request->validate([
            'productName' => 'sometimes|string|max:255',
            'companyName' => 'sometimes|string|max:255',
            'shop_name' => 'sometimes|numeric|',
            'category' => 'sometimes|string|max:255',
            'owned_imported' => 'sometimes|in:owned,imported',
            'price' => 'sometimes|numeric',
            'stock_quantity' => 'sometimes|integer',
            'description' => 'sometimes|string',
        ]);
    
        $product = Product::findOrFail($id);
        $product->update($request->all());
    
        return response()->json(['message' => 'Product updated successfully!', 'product' => $product], 200);
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        
        $product->delete();
        
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    // Function to get all products with category details
    public function getAllProduct()
    {
        $products = Product::all();
        return response()->json(['products' => $products], 200);
    }
}
