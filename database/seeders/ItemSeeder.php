<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\ItemBatch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ItemSeeder extends Seeder
{
    private array $darkFantasyBooks = [
        [
            'title' => 'The Shadows of Azrael',
            'author' => 'Morgana Blackwood',
            'description' => 'A haunting tale of ancient curses and forgotten magic that threatens to consume the realm. When a young apprentice discovers a forbidden tome, she unleashes forces beyond comprehension.',
            'base_price' => 34.99,
            'discount' => 15,
        ],
        [
            'title' => 'Crimson Moon Rising',
            'author' => 'Draven Nightshade',
            'description' => 'In the depths of darkness, where demons whisper and shadows dance, a hero must rise. The blood moon awakens an ancient evil that has slumbered for millennia.',
            'base_price' => 29.99,
            'discount' => 0,
        ],
        [
            'title' => 'The Necromancer\'s Grimoire',
            'author' => 'Lucian Graveheart',
            'description' => 'An epic journey through lands corrupted by dark sorcery and malevolent forces. The grimoire holds secrets of resurrection, but at what terrible cost?',
            'base_price' => 44.99,
            'discount' => 20,
        ],
        [
            'title' => 'Blood of the Ancients',
            'author' => 'Seraphina Darkmoor',
            'description' => 'Blood-soaked pages reveal the terrible price of immortality and forbidden power. An ancient bloodline awakens, bringing chaos to the mortal realm.',
            'base_price' => 39.99,
            'discount' => 10,
        ],
        [
            'title' => 'Dark Whispers in the Abyss',
            'author' => 'Theron Bloodworth',
            'description' => 'When the veil between worlds grows thin, unspeakable horrors emerge from beyond. Listen carefully, for the whispers speak of doom and salvation alike.',
            'base_price' => 27.99,
            'discount' => 0,
        ],
        [
            'title' => 'The Cursed Crown',
            'author' => 'Isolde Shadowvale',
            'description' => 'A gripping saga of betrayal, revenge, and the darkest corners of the human soul. The crown promises power, but curses all who wear it.',
            'base_price' => 42.99,
            'discount' => 25,
        ],
        [
            'title' => 'Ashes of the Fallen Kingdom',
            'author' => 'Cassius Thornhart',
            'description' => 'Ancient prophecies awaken as the world teeters on the brink of eternal darkness. From the ashes of a forgotten empire, new horrors arise.',
            'base_price' => 36.99,
            'discount' => 15,
        ],
        [
            'title' => 'The Demon\'s Contract',
            'author' => 'Ravenna Duskbane',
            'description' => 'In a realm where death is just the beginning, the true nightmare awaits. Sign the contract in blood, and gain everything you desire.',
            'base_price' => 31.99,
            'discount' => 0,
        ],
        [
            'title' => 'Veil of Eternal Night',
            'author' => 'Malachi Grimwood',
            'description' => 'A masterfully woven tale of necromancy, dark rituals, and the cost of resurrection. Behind the veil lies a world of perpetual twilight.',
            'base_price' => 38.99,
            'discount' => 20,
        ],
        [
            'title' => 'The Warlock\'s Redemption',
            'author' => 'Evangeline Nightfall',
            'description' => 'Where light fears to tread and hope is but a distant memory, legends are born. Can a warlock steeped in darkness find redemption?',
            'base_price' => 33.99,
            'discount' => 10,
        ],
        [
            'title' => 'Echoes from the Void',
            'author' => 'Viktor Ashenborne',
            'description' => 'The boundaries of mortality blur in this chilling exploration of dark fantasy. The void calls, and some foolishly answer.',
            'base_price' => 29.99,
            'discount' => 0,
        ],
        [
            'title' => 'The Black Cathedral',
            'author' => 'Lilith Crowmore',
            'description' => 'A visceral journey into madness, magic, and the monsters that lurk within. The cathedral stands as a monument to forgotten gods.',
            'base_price' => 45.99,
            'discount' => 15,
        ],
        [
            'title' => 'Serpent\'s Covenant',
            'author' => 'Alaric Deathwhisper',
            'description' => 'Forbidden tomes and eldritch knowledge spell doom for those who dare to seek. The serpent offers wisdom, but demands terrible sacrifices.',
            'base_price' => 37.99,
            'discount' => 20,
        ],
        [
            'title' => 'The Bone Collector\'s Tale',
            'author' => 'Selene Darkwater',
            'description' => 'In the shadow of the dark moon, ancient evils stir from their slumber. Each bone tells a story of death and dark magic.',
            'base_price' => 32.99,
            'discount' => 0,
        ],
        [
            'title' => 'Nightmare\'s Embrace',
            'author' => 'Damian Soulreaver',
            'description' => 'A tale of cursed bloodlines and the unbreakable chains of destiny. In the embrace of nightmares, truth becomes horror.',
            'base_price' => 35.99,
            'discount' => 10,
        ],
        [
            'title' => 'The Obsidian Blade',
            'author' => 'Morgana Blackwood',
            'description' => 'Forged in darkness and tempered in blood, the obsidian blade hungers for souls. Its wielder gains power beyond measure.',
            'base_price' => 41.99,
            'discount' => 25,
        ],
        [
            'title' => 'Chronicles of the Damned',
            'author' => 'Draven Nightshade',
            'description' => 'These chronicles document the fall of heroes and the rise of monsters. Read at your own peril, for knowledge brings madness.',
            'base_price' => 43.99,
            'discount' => 15,
        ],
        [
            'title' => 'The Witch Queen\'s Legacy',
            'author' => 'Lucian Graveheart',
            'description' => 'The witch queen\'s power echoes through the ages, corrupting all who seek her legacy. Her throne awaits a worthy successor.',
            'base_price' => 39.99,
            'discount' => 20,
        ],
        [
            'title' => 'Souls of the Forgotten',
            'author' => 'Seraphina Darkmoor',
            'description' => 'Forgotten souls wander the twilight realm, seeking release from eternal torment. But some secrets are meant to stay buried.',
            'base_price' => 28.99,
            'discount' => 0,
        ],
        [
            'title' => 'The Dark Prophecy',
            'author' => 'Theron Bloodworth',
            'description' => 'The prophecy speaks of the end times, when darkness shall consume all light. Its words are written in blood and shadow.',
            'base_price' => 36.99,
            'discount' => 10,
        ],
        [
            'title' => 'Throne of Thorns and Ash',
            'author' => 'Isolde Shadowvale',
            'description' => 'Built from the remnants of fallen empires, this throne promises power to those brave enough to claim it. But thorns draw blood.',
            'base_price' => 40.99,
            'discount' => 15,
        ],
        [
            'title' => 'The Vampire\'s Lament',
            'author' => 'Cassius Thornhart',
            'description' => 'Immortality is a curse disguised as a blessing. This is the tale of one vampire\'s eternal suffering and quest for redemption.',
            'base_price' => 34.99,
            'discount' => 20,
        ],
    ];

    public function run(): void
    {
        $this->command->info('Starting Item Seeder...');

        // Copy images from dark-images directory to storage
        $this->copyDarkImages();

        // Create items with batches
        $this->command->info('Creating items with batches...');

        foreach ($this->darkFantasyBooks as $index => $bookData) {
            $imageNumber = ($index % 22) + 1;
            $basePrice = $bookData['base_price'];
            $discount = $bookData['discount'];
            $finalPrice = $basePrice * (1 - ($discount / 100));

            $item = Item::create([
                'title' => $bookData['title'],
                'description' => $bookData['description'],
                'author' => $bookData['author'],
                'image_path' => "items/{$imageNumber}.jpg",
                'base_price' => $basePrice,
                'discount_percentage' => $discount,
                'final_price' => $finalPrice,
                'total_stock' => 0,
                'available_stock' => 0,
                'low_stock_threshold' => rand(5, 15),
                'is_active' => true,
            ]);

            // Create 2-4 batches per item for FIFO demonstration
            $batchCount = rand(2, 4);

            for ($i = 0; $i < $batchCount; $i++) {
                $initialQuantity = rand(20, 80);
                $remainingQuantity = $i === 0
                    ? rand(5, intval($initialQuantity * 0.3)) // First batch partially depleted
                    : $initialQuantity;

                ItemBatch::create([
                    'item_id' => $item->id,
                    'batch_number' => 'BATCH-'.strtoupper(substr(md5($item->id.$i.time()), 0, 8)),
                    'initial_quantity' => $initialQuantity,
                    'remaining_quantity' => $remainingQuantity,
                    'cost_price' => $basePrice * 0.6,
                    'received_date' => now()->subMonths($batchCount - $i)->subDays(rand(0, 30)),
                    'expiry_date' => rand(0, 1) ? now()->addYears(rand(1, 3)) : null,
                ]);
            }

            // Update item stock from batches
            $item->updateStockFromBatches();

            $this->command->info("Created: {$item->title} ({$item->available_stock} in stock)");
        }

        $this->command->info('Item Seeder completed successfully!');
    }

    private function copyDarkImages(): void
    {
        $this->command->info('Copying dark fantasy images...');

        $sourceDir = base_path('../dark-images');
        $destinationDir = storage_path('app/public/items');

        if (! File::exists($sourceDir)) {
            $this->command->warn("Source directory not found: {$sourceDir}");
            $this->command->warn('Skipping image copy. Please ensure dark-images directory exists.');

            return;
        }

        // Create destination directory if it doesn't exist
        if (! File::exists($destinationDir)) {
            File::makeDirectory($destinationDir, 0755, true);
        }

        // Copy images 1-22
        for ($i = 1; $i <= 22; $i++) {
            $sourceFile = "{$sourceDir}/{$i}.jpg";
            $destinationFile = "{$destinationDir}/{$i}.jpg";

            if (File::exists($sourceFile)) {
                File::copy($sourceFile, $destinationFile);
                $this->command->info("Copied: {$i}.jpg");
            } else {
                $this->command->warn("Image not found: {$sourceFile}");
            }
        }

        $this->command->info('Image copying completed!');
    }
}
