<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\productName;
use Illuminate\Support\Facades\Storage;

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
    
    // Function to add product name
    public function AddProductName(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        $product = productName::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Product name added successfully!', 'product' => $product], 201);
    }

    // Function to add category
    public function AddCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories,name|max:255',
        ]);

        $category = Category::create(['name' => $request->name]);
        return response()->json(['message' => 'Category added successfully!', 'category' => $category], 201);
    }

    // Function to get all categories
    public function getAllCategories()
    {
        $categories = Category::all();
        return response()->json(['categories' => $categories], 200);
    }

    // Function to get all product names
    public function getAllProductNames()
    {
        $productNames = productName::all();
        return response()->json(['productNames' => $productNames], 200);
    }

    // Function to get all products with category details
    public function getAllProduct()
    {
        $products = Product::all();
        return response()->json(['products' => $products], 200);
    }
}
