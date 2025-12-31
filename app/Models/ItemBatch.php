<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'batch_number',
        'initial_quantity',
        'remaining_quantity',
        'cost_price',
        'received_date',
        'expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'cost_price' => 'decimal:2',
            'received_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function hasStock(): bool
    {
        return $this->remaining_quantity > 0;
    }

    public function scopeAvailable($query)
    {
        return $query->where('remaining_quantity', '>', 0);
    }

    public function scopeOldestFirst($query)
    {
        return $query->orderBy('received_date')->orderBy('id');
    }
}
