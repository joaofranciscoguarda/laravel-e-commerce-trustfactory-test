<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    protected $model = Item::class;

    private static $darkFantasyTitles = [
        'The Shadows of Azrael',
        'Crimson Moon Rising',
        'The Necromancer\'s Grimoire',
        'Blood of the Ancients',
        'Dark Whispers in the Abyss',
        'The Cursed Crown',
        'Ashes of the Fallen Kingdom',
        'The Demon\'s Contract',
        'Veil of Eternal Night',
        'The Warlock\'s Redemption',
        'Echoes from the Void',
        'The Black Cathedral',
        'Serpent\'s Covenant',
        'The Bone Collector\'s Tale',
        'Nightmare\'s Embrace',
        'The Obsidian Blade',
        'Chronicles of the Damned',
        'The Witch Queen\'s Legacy',
        'Souls of the Forgotten',
        'The Dark Prophecy',
        'Throne of Thorns and Ash',
        'The Vampire\'s Lament',
    ];

    private static $darkFantasyAuthors = [
        'Morgana Blackwood',
        'Draven Nightshade',
        'Lucian Graveheart',
        'Seraphina Darkmoor',
        'Theron Bloodworth',
        'Isolde Shadowvale',
        'Cassius Thornhart',
        'Ravenna Duskbane',
        'Malachi Grimwood',
        'Evangeline Nightfall',
        'Viktor Ashenborne',
        'Lilith Crowmore',
        'Alaric Deathwhisper',
        'Selene Darkwater',
        'Damian Soulreaver',
    ];

    private static $descriptions = [
        'A haunting tale of ancient curses and forgotten magic that threatens to consume the realm.',
        'In the depths of darkness, where demons whisper and shadows dance, a hero must rise.',
        'An epic journey through lands corrupted by dark sorcery and malevolent forces.',
        'Blood-soaked pages reveal the terrible price of immortality and forbidden power.',
        'When the veil between worlds grows thin, unspeakable horrors emerge from beyond.',
        'A gripping saga of betrayal, revenge, and the darkest corners of the human soul.',
        'Ancient prophecies awaken as the world teeters on the brink of eternal darkness.',
        'In a realm where death is just the beginning, the true nightmare awaits.',
        'A masterfully woven tale of necromancy, dark rituals, and the cost of resurrection.',
        'Where light fears to tread and hope is but a distant memory, legends are born.',
        'The boundaries of mortality blur in this chilling exploration of dark fantasy.',
        'A visceral journey into madness, magic, and the monsters that lurk within.',
        'Forbidden tomes and eldritch knowledge spell doom for those who dare to seek.',
        'In the shadow of the dark moon, ancient evils stir from their slumber.',
        'A tale of cursed bloodlines and the unbreakable chains of destiny.',
    ];

    public function definition(): array
    {
        $basePrice = fake()->randomFloat(2, 15.99, 89.99);
        $discountPercentage = fake()->optional(0.3)->randomElement([0, 5, 10, 15, 20, 25]);
        $discount = $discountPercentage ?? 0;

        return [
            'title' => fake()->randomElement(self::$darkFantasyTitles),
            'description' => fake()->randomElement(self::$descriptions),
            'author' => fake()->randomElement(self::$darkFantasyAuthors),
            'image_path' => 'items/'.fake()->numberBetween(1, 22).'.jpg',
            'base_price' => $basePrice,
            'discount_percentage' => $discount,
            'final_price' => $basePrice * (1 - ($discount / 100)),
            'total_stock' => 0,
            'available_stock' => 0,
            'low_stock_threshold' => fake()->numberBetween(5, 15),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function withDiscount(float $percentage): static
    {
        return $this->state(function (array $attributes) use ($percentage) {
            $basePrice = $attributes['base_price'];

            return [
                'discount_percentage' => $percentage,
                'final_price' => $basePrice * (1 - ($percentage / 100)),
            ];
        });
    }

    public function noDiscount(): static
    {
        return $this->state(fn (array $attributes) => [
            'discount_percentage' => 0,
            'final_price' => $attributes['base_price'],
        ]);
    }
}
