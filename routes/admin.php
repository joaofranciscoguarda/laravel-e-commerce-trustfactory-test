<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Inventory
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory');
    // Route::get('/inventory/{item}', [InventoryController::class, 'show'])->name('inventory.show');
    // Route::put('/inventory/{item}', [InventoryController::class, 'update'])->name('inventory.update');
    // Route::post('/inventory/{item}/toggle', [InventoryController::class, 'toggleActive'])->name('inventory.toggle');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    // Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    // Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
});
