<?php

namespace App\Console\Commands;

use App\Models\Item;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Console\Command;

class SimulateStockConsumption extends Command
{
    protected $signature = 'simulate:stock-consumption
                            {--item= : Specific item ID to consume}
                            {--quantity=1 : Quantity to consume per iteration}
                            {--interval=5 : Seconds between each consumption}
                            {--stop-at=5 : Stop when stock reaches this level}';

    protected $description = 'Simulate stock consumption by creating orders every N seconds to trigger low stock notifications';

    public function handle(): int
    {
        $itemId = $this->option('item');
        $quantity = (int) $this->option('quantity');
        $interval = (int) $this->option('interval');
        $stopAt = (int) $this->option('stop-at');

        // Get or create a test customer
        $customer = User::where('email', 'customer@darkfantasy.com')->first();

        if (! $customer) {
            $this->error('Customer user not found. Please run seeders first.');

            return Command::FAILURE;
        }

        // Get item
        if ($itemId) {
            $item = Item::find($itemId);
            if (! $item) {
                $this->error("Item with ID {$itemId} not found.");

                return Command::FAILURE;
            }
        } else {
            // Pick a random item with stock
            $item = Item::inStock()->lowStock()->first();
            if (! $item) {
                $item = Item::inStock()->first();
            }

            if (! $item) {
                $this->error('No items with stock found.');

                return Command::FAILURE;
            }
        }

        $this->info("Starting stock consumption simulation for: {$item->title}");
        $this->info("Current stock: {$item->available_stock} units");
        $this->info("Low stock threshold: {$item->low_stock_threshold} units");
        $this->info("Will stop at: {$stopAt} units");
        $this->newLine();

        $orderService = new OrderService;
        $ordersCreated = 0;

        while ($item->available_stock > $stopAt) {
            try {
                // Refresh item data
                $item->refresh();

                if (! $item->hasStock($quantity)) {
                    $this->warn('Insufficient stock remaining. Stopping simulation.');
                    break;
                }

                // Create an order
                $order = $orderService->createOrder($customer, [
                    ['item_id' => $item->id, 'quantity' => $quantity],
                ]);

                $ordersCreated++;
                $item->refresh();

                $stockStatus = $item->isLowStock() ? '<fg=red>LOW STOCK</>' : '<fg=green>OK</>';

                $this->line(sprintf(
                    '[%s] Order #%d created - Consumed: %d units | Remaining: <fg=yellow>%d</> units | Status: %s',
                    now()->format('H:i:s'),
                    $ordersCreated,
                    $quantity,
                    $item->available_stock,
                    $stockStatus
                ));

                if ($item->isLowStock()) {
                    $this->warn('⚠️  Low stock notification should be triggered!');
                }

                if ($item->available_stock > $stopAt) {
                    $this->line("Waiting {$interval} seconds...");
                    sleep($interval);
                }
            } catch (\Exception $e) {
                $this->error("Error creating order: {$e->getMessage()}");
                break;
            }
        }

        $this->newLine();
        $this->info('✓ Simulation completed!');
        $this->info("Orders created: {$ordersCreated}");
        $this->info("Final stock level: {$item->available_stock} units");

        if ($item->isLowStock()) {
            $this->warn('⚠️  Item is now at low stock level!');
            $this->info('Check your mail logs at storage/logs/laravel.log for the notification email.');
        }

        return Command::SUCCESS;
    }
}
