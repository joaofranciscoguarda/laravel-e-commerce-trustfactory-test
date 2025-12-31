<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'last_activity',
    ];

    protected function casts(): array
    {
        return [
            'last_activity' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function addItem(Item $item, int $quantity = 1): CartItem
    {
        $cartItem = $this->items()->where('item_id', $item->id)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->price_snapshot = $item->final_price;
            $cartItem->save();
        } else {
            $cartItem = $this->items()->create([
                'item_id' => $item->id,
                'quantity' => $quantity,
                'price_snapshot' => $item->final_price,
            ]);
        }

        $this->touch('last_activity');

        return $cartItem;
    }

    public function updateItemQuantity(Item $item, int $quantity): bool
    {
        if ($quantity <= 0) {
            return $this->removeItem($item);
        }

        $cartItem = $this->items()->where('item_id', $item->id)->first();

        if (! $cartItem) {
            return false;
        }

        $cartItem->quantity = $quantity;
        $cartItem->price_snapshot = $item->final_price;
        $cartItem->save();

        $this->touch('last_activity');

        return true;
    }

    public function removeItem(Item $item): bool
    {
        $deleted = $this->items()->where('item_id', $item->id)->delete();

        $this->touch('last_activity');

        return $deleted > 0;
    }

    public function clear(): void
    {
        $this->items()->delete();
        $this->touch('last_activity');
    }

    public function getTotal(): float
    {
        return $this->items()->get()->sum(function ($cartItem) {
            return $cartItem->quantity * $cartItem->price_snapshot;
        });
    }

    public function getItemCount(): int
    {
        return $this->items()->sum('quantity');
    }

    public function isEmpty(): bool
    {
        return $this->items()->count() === 0;
    }
}
