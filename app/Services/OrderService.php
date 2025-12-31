<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Item;
use App\Models\ItemBatch;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrderFromCart(User $user): Order
    {
        $cart = $user->cart()->with('items.item')->first();

        if (! $cart || $cart->isEmpty()) {
            throw new \Exception('Cart is empty');
        }

        return DB::transaction(function () use ($user, $cart) {
            // Validate stock availability for all items
            foreach ($cart->items as $cartItem) {
                if (! $cartItem->item->hasStock($cartItem->quantity)) {
                    throw new \Exception("Insufficient stock for {$cartItem->item->title}");
                }
            }

            // Create the order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => 0,
                'discount' => 0,
                'total' => 0,
                'status' => 'pending',
            ]);

            $subtotal = 0;
            $totalDiscount = 0;

            // Process each cart item with FIFO stock management
            foreach ($cart->items as $cartItem) {
                $item = $cartItem->item;
                $quantity = $cartItem->quantity;
                $unitPrice = $item->final_price;
                $discountApplied = $item->discount_percentage;

                // Reserve stock using FIFO
                $this->reserveStockFIFO($order, $item, $quantity, $unitPrice, $discountApplied);

                $itemSubtotal = $quantity * $unitPrice;
                $subtotal += $itemSubtotal;
                $totalDiscount += $quantity * $item->base_price * ($discountApplied / 100);
            }

            // Update order totals
            $order->update([
                'subtotal' => $subtotal,
                'discount' => $totalDiscount,
                'total' => $subtotal,
            ]);

            // Clear the cart
            $cart->clear();

            return $order;
        });
    }

    protected function reserveStockFIFO(Order $order, Item $item, int $quantity, float $unitPrice, float $discountApplied): void
    {
        $remainingToReserve = $quantity;

        // Get batches ordered by received_date (FIFO)
        $batches = $item->batches()
            ->where('remaining_quantity', '>', 0)
            ->orderBy('received_date')
            ->orderBy('id')
            ->get();

        foreach ($batches as $batch) {
            if ($remainingToReserve <= 0) {
                break;
            }

            $quantityFromBatch = min($remainingToReserve, $batch->remaining_quantity);

            // Create order item with batch tracking
            $order->items()->create([
                'item_id' => $item->id,
                'item_batch_id' => $batch->id,
                'quantity' => $quantityFromBatch,
                'unit_price' => $unitPrice,
                'discount_applied' => $discountApplied,
                'subtotal' => $quantityFromBatch * $unitPrice,
            ]);

            // Reduce batch quantity
            $batch->remaining_quantity -= $quantityFromBatch;
            $batch->save();

            $remainingToReserve -= $quantityFromBatch;
        }

        if ($remainingToReserve > 0) {
            throw new \Exception("Unable to reserve sufficient stock for {$item->title}");
        }

        // Update item stock
        $item->updateStockFromBatches();
    }

    public function createOrder(User $user, array $items): Order
    {
        return DB::transaction(function () use ($user, $items) {
            // Validate stock availability
            foreach ($items as $itemData) {
                $item = Item::findOrFail($itemData['item_id']);
                if (! $item->hasStock($itemData['quantity'])) {
                    throw new \Exception("Insufficient stock for {$item->title}");
                }
            }

            // Create the order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => 0,
                'discount' => 0,
                'total' => 0,
                'status' => 'pending',
            ]);

            $subtotal = 0;
            $totalDiscount = 0;

            foreach ($items as $itemData) {
                $item = Item::findOrFail($itemData['item_id']);
                $quantity = $itemData['quantity'];
                $unitPrice = $item->final_price;
                $discountApplied = $item->discount_percentage;

                // Reserve stock using FIFO
                $this->reserveStockFIFO($order, $item, $quantity, $unitPrice, $discountApplied);

                $itemSubtotal = $quantity * $unitPrice;
                $subtotal += $itemSubtotal;
                $totalDiscount += $quantity * $item->base_price * ($discountApplied / 100);
            }

            // Update order totals
            $order->update([
                'subtotal' => $subtotal,
                'discount' => $totalDiscount,
                'total' => $subtotal,
            ]);

            return $order;
        });
    }

    public function cancelOrder(Order $order): void
    {
        if (! $order->isPending()) {
            throw new \Exception('Only pending orders can be cancelled');
        }

        DB::transaction(function () use ($order) {
            // Return stock to batches
            foreach ($order->items as $orderItem) {
                if ($orderItem->item_batch_id) {
                    $batch = ItemBatch::find($orderItem->item_batch_id);
                    if ($batch) {
                        $batch->remaining_quantity += $orderItem->quantity;
                        $batch->save();
                    }
                }

                // Update item stock
                $orderItem->item->updateStockFromBatches();
            }

            // Mark order as cancelled
            $order->markAsCancelled();
        });
    }
}
