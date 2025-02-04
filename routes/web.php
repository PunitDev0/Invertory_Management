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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});

Route::post('/add-product', [ProductController::class, 'addProduct']);
