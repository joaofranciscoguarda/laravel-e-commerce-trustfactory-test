<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
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
            'order_number' => $this->order_number,
            'customer' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'items' => $this->items->map(fn ($orderItem) => [
                'id' => $orderItem->id,
                'item_id' => $orderItem->item_id,
                'title' => $orderItem->item_title,
                'author' => $orderItem->item_author,
                'quantity' => $orderItem->quantity,
                'unit_price' => (float) $orderItem->unit_price,
                'subtotal' => (float) $orderItem->subtotal,
                'batch_number' => $orderItem->batch?->batch_number,
                'image_path' => $orderItem->item?->image_path,
            ]),
            'subtotal' => (float) $this->subtotal,
            'discount' => (float) $this->discount,
            'total' => (float) $this->total,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'shipping_address' => $this->shipping_address,
            'notes' => $this->notes,
            'created_at' => $this->created_at->format('M d, Y H:i'),
        ];
    }
}
