<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UpdateController;
use Illuminate\Foundation\Application;
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
Route::get('/admin/dashboard', function () {
    return Inertia::render('Dashboard');
});
Route::post('/add-product', [ProductController::class, 'addProduct']);
Route::post('/add-product-name', [ProductController::class, 'AddProductName']);
Route::post('/add-categories', [ProductController::class, 'AddCategory']);
Route::get('/getcategories', [ProductController::class, 'getAllCategories']);
Route::get('/get-product-names', [ProductController::class, 'getAllProductNames']);
Route::get('/get-all-products', [ProductController::class, 'getAllProduct']);
Route::post('/add-roles', [AuthController::class, 'Role']);
Route::get('/get-all-roles', [AuthController::class, 'getAllRoles']);
Route::get('/get-all-users', [AuthController::class, 'getAllUsers']);
Route::put('/update-user/{id}', [UpdateController::class, 'updateUser']);
Route::delete('/delete-user/{id}', [UpdateController::class, 'deleteUser']);
Route::put('/product-update/{id}', [UpdateController::class, 'updateProduct']);
Route::delete('/product-delete/{id}', [UpdateController::class, 'deleteProduct']);
Route::get('/get-all-orders', [OrderController::class, 'getAllOrders']);
    // NikatbyIMS@4077