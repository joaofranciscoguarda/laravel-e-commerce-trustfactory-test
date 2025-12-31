<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'author',
        'image_path',
        'base_price',
        'discount_percentage',
        'final_price',
        'total_stock',
        'available_stock',
        'low_stock_threshold',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'discount_percentage' => 'decimal:2',
            'final_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function batches(): HasMany
    {
        return $this->hasMany(ItemBatch::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function calculateFinalPrice(): void
    {
        $this->final_price = $this->base_price * (1 - ($this->discount_percentage / 100));
        $this->save();
    }

    public function updateStockFromBatches(): void
    {
        $totalStock = $this->batches()->sum('initial_quantity');
        $availableStock = $this->batches()->sum('remaining_quantity');

        $this->update([
            'total_stock' => $totalStock,
            'available_stock' => $availableStock,
        ]);
    }

    public function isLowStock(): bool
    {
        return $this->available_stock <= $this->low_stock_threshold;
    }

    public function hasStock(int $quantity = 1): bool
    {
        return $this->available_stock >= $quantity;
    }

    public function reserveStock(int $quantity): bool
    {
        if (! $this->hasStock($quantity)) {
            return false;
        }

        $remainingToReserve = $quantity;

        $batches = $this->batches()
            ->where('remaining_quantity', '>', 0)
            ->orderBy('received_date')
            ->orderBy('id')
            ->get();

        foreach ($batches as $batch) {
            if ($remainingToReserve <= 0) {
                break;
            }

            $quantityFromBatch = min($remainingToReserve, $batch->remaining_quantity);
            $batch->remaining_quantity -= $quantityFromBatch;
            $batch->save();

            $remainingToReserve -= $quantityFromBatch;
        }

        $this->updateStockFromBatches();

        return $remainingToReserve === 0;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('available_stock', '>', 0);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('available_stock', '<=', 'low_stock_threshold');
    }
}
