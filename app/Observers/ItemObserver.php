<?php

namespace App\Observers;

use App\Jobs\SendLowStockNotification;
use App\Models\Item;

class ItemObserver
{
    public function updated(Item $item): void
    {
        // Check if stock was updated and is now low
        if ($item->wasChanged('available_stock') && $item->isLowStock()) {
            SendLowStockNotification::dispatch($item);
        }

        // Auto-deactivate when stock reaches zero
        if ($item->wasChanged('available_stock') && $item->available_stock === 0 && $item->is_active) {
            $item->update(['is_active' => false]);
        }
    }

    public function saving(Item $item): void
    {
        // Automatically calculate final price before saving
        if ($item->isDirty('base_price') || $item->isDirty('discount_percentage')) {
            $item->final_price = $item->base_price * (1 - ($item->discount_percentage / 100));
        }
    }
}
