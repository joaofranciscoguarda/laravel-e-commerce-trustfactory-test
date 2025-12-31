<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ShopController::class, 'index'])->name('home');

// Image thumbnails
Route::get('/thumbnails/{path}', [ImageController::class, 'thumbnail'])
    ->where('path', '.*')
    ->name('thumbnail');

// Shop routes (public)
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/search', [ShopController::class, 'search'])->name('shop.search');
Route::get('/shop/{item}', [ShopController::class, 'show'])->name('shop.show');

// Cart routes (public - store cart in session for guests)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::put('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

Route::middleware(['auth', 'verified'])->group(function () {
    // Customer Dashboard
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

    // Checkout routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Order routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Inventory
    Route::get('/inventory', [AdminInventoryController::class, 'index'])->name('inventory');
    // Route::get('/inventory/{item}', [AdminInventoryController::class, 'show'])->name('inventory.show');
    // Route::put('/inventory/{item}', [AdminInventoryController::class, 'update'])->name('inventory.update');
    // Route::post('/inventory/{item}/toggle', [AdminInventoryController::class, 'toggleActive'])->name('inventory.toggle');

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders');
    // Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    // Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
});

require __DIR__.'/settings.php';
