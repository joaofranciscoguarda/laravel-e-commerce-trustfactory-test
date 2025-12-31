<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'image_path' => $this->image_path,
            'base_price' => (float) $this->base_price,
            'discount_percentage' => (float) $this->discount_percentage,
            'final_price' => (float) $this->final_price,
            'total_stock' => $this->total_stock,
            'available_stock' => $this->available_stock,
            'low_stock_threshold' => $this->low_stock_threshold,
            'is_active' => $this->is_active,
            'is_low_stock' => $this->isLowStock(),
            'batch_count' => $this->whenLoaded('batches', fn () => $this->batches->count()),
        ];
    }
}
