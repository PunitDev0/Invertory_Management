<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductName;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProductController extends Controller
{
    // Function to add a product
    public function addProduct(Request $request)
    {
        $request->validate([
            'productName' => 'required|string|max:255',
            'companyName' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'owned_imported' => 'required|in:owned,imported',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'description' => 'required|string',
        ]);
    
        $product = Product::create([
            'productName' => $request->productName,
            'companyName' => $request->companyName,
            'category' => $request->category,
            'owned_imported' => $request->owned_imported,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'description' => $request->description,
        ]);
    
        return response()->json(['message' => 'Product added successfully!', 'product' => $product], 201);
    }
    

    public function updateProduct(Request $request, $id)
    {
        $request->validate([
            'productName' => 'sometimes|string|max:255',
            'companyName' => 'sometimes|string|max:255',
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
