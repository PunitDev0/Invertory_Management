<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Auth/Login');
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/store', [AuthController::class, 'store']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/admin/dashboard', function () {
    return Inertia::render('Dashboard');
});
Route::get('/dashboard', function () {
    return Inertia::render('UserDashboard');
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
