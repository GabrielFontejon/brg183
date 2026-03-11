<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => 'Admin',
            'password' => bcrypt('12345'),
        ]);

        User::factory()->create([
            'name' => 'Encoder User',
            'email' => 'encoder@gmail.com',
            'role' => 'Encoder',
            'password' => bcrypt('12345'),
        ]);

        $this->call(MockDataSeeder::class);
    }
}
