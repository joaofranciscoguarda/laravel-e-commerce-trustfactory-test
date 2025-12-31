<?php

use App\Models\Cart;
use App\Models\Item;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates cart for user when adding first item', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    expect($user->cart)->toBeNull();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 2);

    expect($user->fresh()->cart)->not->toBeNull();
    expect($cart->items)->toHaveCount(1);
});

it('adds item to cart with quantity', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create([
        'base_price' => 29.99,
        'discount_percentage' => 0,
        'final_price' => 29.99,
    ]);

    $cart = $user->getOrCreateCart();
    $cartItem = $cart->addItem($item, 3);

    expect($cartItem->quantity)->toBe(3);
    expect((float) $cartItem->price_snapshot)->toBe(29.99);
    expect($cart->items)->toHaveCount(1);
});

it('increments quantity when adding existing item', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $cart = $user->getOrCreateCart();

    $cart->addItem($item, 2);
    $cart->addItem($item, 3);

    $cart->refresh();

    expect($cart->items)->toHaveCount(1);
    expect($cart->items->first()->quantity)->toBe(5);
});

it('updates item quantity in cart', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 5);

    $result = $cart->updateItemQuantity($item, 10);

    expect($result)->toBeTrue();
    expect($cart->items->first()->quantity)->toBe(10);
});

it('removes item from cart when quantity set to zero', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 5);

    $cart->updateItemQuantity($item, 0);

    expect($cart->items()->count())->toBe(0);
});

it('removes item from cart', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 2);

    $result = $cart->removeItem($item);

    expect($result)->toBeTrue();
    expect($cart->items()->count())->toBe(0);
});

it('calculates cart total correctly', function () {
    $user = User::factory()->create();

    $item1 = Item::factory()->create([
        'base_price' => 29.99,
        'discount_percentage' => 0,
        'final_price' => 29.99,
    ]);
    $item2 = Item::factory()->create([
        'base_price' => 49.99,
        'discount_percentage' => 0,
        'final_price' => 49.99,
    ]);

    $cart = $user->getOrCreateCart();
    $cart->addItem($item1, 2); // 2 * 29.99 = 59.98
    $cart->addItem($item2, 1); // 1 * 49.99 = 49.99

    $total = $cart->getTotal();

    expect($total)->toBe(109.97);
});

it('calculates item count correctly', function () {
    $user = User::factory()->create();

    $item1 = Item::factory()->create();
    $item2 = Item::factory()->create();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item1, 3);
    $cart->addItem($item2, 5);

    $count = $cart->getItemCount();

    expect($count)->toBe(8);
});

it('clears cart', function () {
    $user = User::factory()->create();

    $item1 = Item::factory()->create();
    $item2 = Item::factory()->create();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item1, 2);
    $cart->addItem($item2, 3);

    expect($cart->items()->count())->toBe(2);

    $cart->clear();

    expect($cart->items()->count())->toBe(0);
    expect($cart->isEmpty())->toBeTrue();
});

it('snapshots price at time of adding to cart', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create([
        'base_price' => 50.00,
        'discount_percentage' => 20,
        'final_price' => 40.00,
    ]);

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 1);

    $cartItem = $cart->items->first();
    expect((float) $cartItem->price_snapshot)->toBe(40.00);

    // Update item price
    $item->update([
        'base_price' => 60.00,
        'final_price' => 48.00,
    ]);

    // Cart should still have old price
    $cartItem->refresh();
    expect((float) $cartItem->price_snapshot)->toBe(40.00);
});

it('updates price snapshot when adding more of existing item', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create([
        'final_price' => 30.00,
    ]);

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 1);

    // Change price
    $item->update(['final_price' => 25.00]);

    // Add more
    $cart->addItem($item, 1);

    $cartItem = $cart->items->first();
    expect((float) $cartItem->price_snapshot)->toBe(25.00);
    expect($cartItem->quantity)->toBe(2);
});

it('creates order from cart successfully', function () {
    $user = User::factory()->create();

    $item1 = Item::factory()->create([
        'base_price' => 29.99,
        'discount_percentage' => 0,
        'final_price' => 29.99,
    ]);
    $item2 = Item::factory()->create([
        'base_price' => 39.99,
        'discount_percentage' => 0,
        'final_price' => 39.99,
    ]);

    // Create batches for stock
    \App\Models\ItemBatch::factory()->create([
        'item_id' => $item1->id,
        'initial_quantity' => 100,
        'remaining_quantity' => 100,
    ]);

    \App\Models\ItemBatch::factory()->create([
        'item_id' => $item2->id,
        'initial_quantity' => 100,
        'remaining_quantity' => 100,
    ]);

    $item1->updateStockFromBatches();
    $item2->updateStockFromBatches();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item1, 2);
    $cart->addItem($item2, 1);

    $orderService = new OrderService;
    $order = $orderService->createOrderFromCart($user);

    expect($order)->not->toBeNull();
    expect($order->user_id)->toBe($user->id);
    expect($order->status)->toBe('pending');
    expect($cart->fresh()->isEmpty())->toBeTrue();
});

it('throws exception when creating order from empty cart', function () {
    $user = User::factory()->create();
    $cart = $user->getOrCreateCart();

    $orderService = new OrderService;

    expect(fn () => $orderService->createOrderFromCart($user))
        ->toThrow(Exception::class);
});

it('validates stock availability before creating order from cart', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    \App\Models\ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 5,
        'remaining_quantity' => 5,
    ]);

    $item->updateStockFromBatches();

    $cart = $user->getOrCreateCart();
    $cart->addItem($item, 10); // More than available

    $orderService = new OrderService;

    expect(fn () => $orderService->createOrderFromCart($user))
        ->toThrow(Exception::class);
});

it('updates last activity timestamp when cart is modified', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $cart = $user->getOrCreateCart();

    $initialActivity = $cart->last_activity;

    sleep(1);

    $cart->addItem($item, 1);

    $cart->refresh();

    expect($cart->last_activity)->not->toBe($initialActivity);
});
