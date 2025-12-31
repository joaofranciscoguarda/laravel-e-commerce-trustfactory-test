<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemBatchResource extends JsonResource
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
            'batch_number' => $this->batch_number,
            'initial_quantity' => $this->initial_quantity,
            'remaining_quantity' => $this->remaining_quantity,
            'received_date' => $this->received_date->format('M d, Y'),
            'cost_per_unit' => (float) $this->cost_per_unit,
        ];
    }
}
