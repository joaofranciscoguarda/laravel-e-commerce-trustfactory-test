<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\ItemBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ItemBatch>
 */
class ItemBatchFactory extends Factory
{
    protected $model = ItemBatch::class;

    public function definition(): array
    {
        $initialQuantity = fake()->numberBetween(10, 100);
        $receivedDate = fake()->dateTimeBetween('-6 months', 'now');

        return [
            'item_id' => Item::factory(),
            'batch_number' => 'BATCH-'.strtoupper(fake()->bothify('??##??##')),
            'initial_quantity' => $initialQuantity,
            'remaining_quantity' => $initialQuantity,
            'cost_price' => fake()->randomFloat(2, 8.00, 50.00),
            'received_date' => $receivedDate,
            'expiry_date' => fake()->optional(0.3)->dateTimeBetween('+1 year', '+3 years'),
        ];
    }

    public function forItem(Item $item): static
    {
        return $this->state(fn (array $attributes) => [
            'item_id' => $item->id,
        ]);
    }

    public function depleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'remaining_quantity' => 0,
        ]);
    }

    public function partiallyDepleted(): static
    {
        return $this->state(function (array $attributes) {
            $initialQuantity = $attributes['initial_quantity'];

            return [
                'remaining_quantity' => fake()->numberBetween(1, intval($initialQuantity * 0.5)),
            ];
        });
    }

    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'received_date' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function old(): static
    {
        return $this->state(fn (array $attributes) => [
            'received_date' => fake()->dateTimeBetween('-2 years', '-6 months'),
        ]);
    }
}
