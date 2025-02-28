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
            'companyName' => 'sometimes|string|max:255', // Changed 'sometimes' to 'nullable' for clarity
            'shop_name' => 'sometimes|string|max:255',    // Changed 'sometimes' to 'nullable'
            'category' => 'required|string|max:255',
            'owned_imported' => 'required|in:owned,imported',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'description' => 'required|string',
        ]);
    
        // Check if a product with the same name already exists for the same shop or company
        $existingProduct = Product::where('productName', $request->productName)
            ->where(function ($query) use ($request) {
                // Check for same shop_name or companyName (if provided)
                if ($request->shop_name) {
                    $query->where('shop_name', $request->shop_name);
                }
                if ($request->companyName) {
                    $query->orWhere('companyName', $request->companyName);
                }
            })
            ->first();
    
        if ($existingProduct) {
            return response()->json([
                'message' => 'A product with this name already exists for this shop or company!',
                'existing_product' => $existingProduct
            ], 409); // HTTP 409 Conflict
        }
    
        // Create the product
        $product = Product::create([
            'productName' => $request->productName,
            'companyName' => $request->companyName,
            'shop_name' => $request->shop_name,
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
        try {
            $request->validate([
                'productName' => 'sometimes|string|max:255',
                'companyName' => 'sometimes|string|max:255',
                'shop_name' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|max:255',
                'owned_imported' => 'sometimes|in:owned,imported',
                'price' => 'sometimes|numeric|min:0',
                'stock_quantity' => 'sometimes|integer|min:0',
                'description' => 'sometimes|string',
            ]);

            $product = Product::findOrFail($id);
            
            $updateData = $request->only([
                'productName',
                'category',
                'owned_imported',
                'price',
                'stock_quantity',
                'description',
                'companyName',
                'shop_name'
            ]);

            if ($request->owned_imported === 'owned') {
                $updateData['shop_name'] = null;
            } else {
                $updateData['companyName'] = null;
            }

            $product->update($updateData);

            return response()->json([
                'message' => 'Product updated successfully!',
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
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
