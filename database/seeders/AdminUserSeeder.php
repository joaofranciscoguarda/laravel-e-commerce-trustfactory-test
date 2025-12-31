<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creating admin user...');

        $admin = User::firstOrCreate(
            ['email' => 'admin@darkfantasy.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'admin',
            ]
        );

        $this->command->info("Admin user created: {$admin->email}");
        $this->command->info('Password: password');

        // Create a test customer user
        $customer = User::firstOrCreate(
            ['email' => 'customer@darkfantasy.com'],
            [
                'name' => 'Test Customer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'customer',
            ]
        );

        $this->command->info("Customer user created: {$customer->email}");
        $this->command->info('Password: password');
    }
}
