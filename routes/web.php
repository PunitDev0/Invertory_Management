<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductNameController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UpdateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/store', [AuthController::class, 'store']);
Route::get('/logout', [AuthController::class, 'logout']);
Route::get('/logged-in-user', [AuthController::class, 'getLoggedInUser']);

Route::group(['middleware' => 'auth'], function() {

    
});
// NikatbyIMS@4077
Route::get('/admin/dashboard', [OrderController::class, 'getAllOrders']);

Route::post('/add-product', [ProductController::class, 'addProduct']);
Route::post('/add-product-name', [ProductController::class, 'AddProductName']);
Route::get('/get-product-names', [ProductController::class, 'getAllProductNames']);
Route::get('/get-all-products', [ProductController::class, 'getAllProduct']);
Route::post('/add-roles', [AuthController::class, 'Role']);
Route::get('/get-all-roles', [AuthController::class, 'getAllRoles']);
Route::get('/get-all-users', [AuthController::class, 'getAllUsers']);
Route::put('/update-user/{id}', [UpdateController::class, 'updateUser']);
Route::delete('/delete-user/{id}', [UpdateController::class, 'deleteUser']);
Route::put('/product-update/{id}', [ProductController::class, 'updateProduct']);
Route::delete('/product-delete/{id}', [ProductController::class, 'deleteProduct']);
Route::get('/get-all-orders', [OrderController::class, 'getAllOrders']);


Route::prefix('shops')->group(function () {
Route::get('/', [ShopController::class, 'index']); // GET /shops
Route::post('/', [ShopController::class, 'store']); // POST /shops
Route::put('/{id}', [ShopController::class, 'update']); // PUT /shops/{id}
Route::delete('/{id}', [ShopController::class, 'destroy']); // DELETE /shops/{id}
});

Route::prefix('categories')->group(function () {
Route::post('/', [CategoryController::class, 'addCategory']); // Add category
Route::get('/', [CategoryController::class, 'getAllCategories']); // Get all categories
Route::get('{id}', [CategoryController::class, 'getCategory']); // Get a category by ID
Route::put('{id}', [CategoryController::class, 'updateCategory']); // Update category
Route::delete('{id}', [CategoryController::class, 'deleteCategory']); // Delete category
});

// Product Name routes
Route::prefix('product-names')->group(function () {
Route::post('/', [ProductNameController::class, 'addProductName']); // Add a product name
Route::get('/', [ProductNameController::class, 'getAllProductNames']); // Get all product names
Route::get('{id}', [ProductNameController::class, 'getProductName']); // Get a product name by ID
Route::put('{id}', [ProductNameController::class, 'updateProductName']); // Update a product name by ID
Route::delete('{id}', [ProductNameController::class, 'deleteProductName']); // Delete a product name by ID
});

Route::prefix('products')->group(function () {
Route::get('/', [ProductController::class, 'getAllProduct']);
Route::post('/add', [ProductController::class, 'addProduct']);
Route::put('/update/{id}', [ProductController::class, 'updateProduct']);
Route::delete('/delete/{id}', [ProductController::class, 'deleteProduct']);
});
