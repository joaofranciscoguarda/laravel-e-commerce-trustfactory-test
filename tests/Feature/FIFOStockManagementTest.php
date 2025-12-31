<?php

use App\Models\Item;
use App\Models\ItemBatch;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('reserves stock from oldest batch first', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create([
        'base_price' => 29.99,
        'discount_percentage' => 0,
        'final_price' => 29.99,
    ]);

    // Create three batches with different received dates
    $oldBatch = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
        'received_date' => now()->subMonths(3),
    ]);

    $middleBatch = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
        'received_date' => now()->subMonths(2),
    ]);

    $newBatch = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
        'received_date' => now()->subMonth(),
    ]);

    $item->updateStockFromBatches();

    // Create order for 30 units
    $orderService = new OrderService;
    $order = $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 30],
    ]);

    // Refresh batches from database
    $oldBatch->refresh();
    $middleBatch->refresh();
    $newBatch->refresh();

    // Oldest batch should be depleted by 30
    expect($oldBatch->remaining_quantity)->toBe(20);
    // Middle and new batches should be untouched
    expect($middleBatch->remaining_quantity)->toBe(50);
    expect($newBatch->remaining_quantity)->toBe(50);
});

it('reserves stock from multiple batches when first batch insufficient', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create([
        'base_price' => 39.99,
        'discount_percentage' => 10,
        'final_price' => 35.99,
    ]);

    // Create batches with limited stock
    $firstBatch = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 20,
        'remaining_quantity' => 15,
        'received_date' => now()->subMonths(2),
    ]);

    $secondBatch = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
        'received_date' => now()->subMonth(),
    ]);

    $item->updateStockFromBatches();

    // Order 40 units (needs both batches)
    $orderService = new OrderService;
    $order = $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 40],
    ]);

    $firstBatch->refresh();
    $secondBatch->refresh();

    // First batch should be depleted
    expect($firstBatch->remaining_quantity)->toBe(0);
    // Second batch should have 25 remaining (50 - 25)
    expect($secondBatch->remaining_quantity)->toBe(25);

    // Order should have 2 order items (one per batch)
    expect($order->items)->toHaveCount(2);
});

it('updates item stock after reservation', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 100,
        'remaining_quantity' => 100,
    ]);

    $item->updateStockFromBatches();
    expect($item->available_stock)->toBe(100);

    $orderService = new OrderService;
    $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 30],
    ]);

    $item->refresh();
    expect($item->available_stock)->toBe(70);
});

it('throws exception when insufficient stock available', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 10,
        'remaining_quantity' => 10,
    ]);

    $item->updateStockFromBatches();

    $orderService = new OrderService;

    expect(fn () => $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 20],
    ]))->toThrow(Exception::class);
});

it('tracks which batch stock came from in order items', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $batch1 = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 30,
        'remaining_quantity' => 30,
        'received_date' => now()->subMonths(2),
    ]);

    $batch2 = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
        'received_date' => now()->subMonth(),
    ]);

    $item->updateStockFromBatches();

    $orderService = new OrderService;
    $order = $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 50],
    ]);

    // Should have 2 order items
    expect($order->items)->toHaveCount(2);

    $firstOrderItem = $order->items->first();
    $secondOrderItem = $order->items->last();

    // First order item should be from batch1 with 30 units
    expect($firstOrderItem->item_batch_id)->toBe($batch1->id);
    expect($firstOrderItem->quantity)->toBe(30);

    // Second order item should be from batch2 with 20 units
    expect($secondOrderItem->item_batch_id)->toBe($batch2->id);
    expect($secondOrderItem->quantity)->toBe(20);
});

it('returns stock to batches when order is cancelled', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create();

    $batch = ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 100,
        'remaining_quantity' => 100,
    ]);

    $item->updateStockFromBatches();

    $orderService = new OrderService;
    $order = $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 30],
    ]);

    $batch->refresh();
    expect($batch->remaining_quantity)->toBe(70);

    // Cancel the order
    $orderService->cancelOrder($order);

    $batch->refresh();
    $item->refresh();

    // Stock should be returned
    expect($batch->remaining_quantity)->toBe(100);
    expect($item->available_stock)->toBe(100);
    expect($order->fresh()->status)->toBe('cancelled');
});

it('processes multiple items in single order with FIFO', function () {
    $user = User::factory()->create();

    $item1 = Item::factory()->create();
    $item2 = Item::factory()->create();

    ItemBatch::factory()->create([
        'item_id' => $item1->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
        'received_date' => now()->subMonth(),
    ]);

    ItemBatch::factory()->create([
        'item_id' => $item2->id,
        'initial_quantity' => 30,
        'remaining_quantity' => 30,
        'received_date' => now()->subMonth(),
    ]);

    $item1->updateStockFromBatches();
    $item2->updateStockFromBatches();

    $orderService = new OrderService;
    $order = $orderService->createOrder($user, [
        ['item_id' => $item1->id, 'quantity' => 10],
        ['item_id' => $item2->id, 'quantity' => 5],
    ]);

    $item1->refresh();
    $item2->refresh();

    expect($item1->available_stock)->toBe(40);
    expect($item2->available_stock)->toBe(25);
    expect($order->items)->toHaveCount(2);
});

it('correctly calculates order totals with discounts', function () {
    $user = User::factory()->create();
    $item = Item::factory()->create([
        'base_price' => 100.00,
        'discount_percentage' => 20,
        'final_price' => 80.00,
    ]);

    ItemBatch::factory()->create([
        'item_id' => $item->id,
        'initial_quantity' => 50,
        'remaining_quantity' => 50,
    ]);

    $item->updateStockFromBatches();

    $orderService = new OrderService;
    $order = $orderService->createOrder($user, [
        ['item_id' => $item->id, 'quantity' => 5],
    ]);

    // 5 items * $80 (discounted price) = $400
    expect((float) $order->subtotal)->toBe(400.00);
    expect((float) $order->total)->toBe(400.00);
    // Discount saved: 5 * $100 * 0.20 = $100
    expect((float) $order->discount)->toBe(100.00);
});
