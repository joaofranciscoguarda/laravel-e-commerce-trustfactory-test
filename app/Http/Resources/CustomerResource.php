<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->format('M d, Y H:i'),
            'orders_count' => $this->whenCounted('orders'),
            'total_spent' => $this->when(isset($this->orders_sum_total), fn () => (float) $this->orders_sum_total),
            'created_at' => $this->created_at->format('M d, Y'),
        ];
    }
}
