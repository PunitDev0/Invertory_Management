<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function addProduct(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'productName' => 'required|string|max:255',
            'companyName' => 'required|string|max:255',
            'category_id' => 'required|string|max:255',
            'owned_imported' => 'required|in:owned,imported',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'description' => 'required|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif',
        ]);

        // Handle image uploads
        $imageNames = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imageName = time() . '-' . $image->getClientOriginalName();
                $image->storeAs('images', $imageName, 'public');
                $imageNames[] = $imageName;
            }
        }

        // Store product data in the database
        $product = Product::create([
            'productName' => $request->productName,
            'companyName' => $request->companyName,
            'category_id' => $request->category_id,
            'owned_imported' => $request->owned_imported,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'description' => $request->description,
            'images' => json_encode($imageNames), // Store image names as JSON
        ]);

        return response()->json(['message' => 'Product added successfully!', 'product' => $product], 201);
    }
}
