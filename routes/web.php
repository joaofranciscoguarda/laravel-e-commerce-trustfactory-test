<?php


use App\Http\Controllers\CartController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ShopController::class, 'index'])->name('home');

// Image thumbnails
Route::get('/thumbnails/{path}', [ImageController::class, 'thumbnail'])
    ->where('path', '.*')
    ->name('thumbnail');

// Shop routes
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

require __DIR__.'/admin.php';
require __DIR__.'/customer.php';
require __DIR__.'/settings.php';
