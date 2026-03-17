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
        // Create Roles
        \Spatie\Permission\Models\Role::create(['name' => 'Admin']);
        \Spatie\Permission\Models\Role::create(['name' => 'Encoder']);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345'),
            'role' => 'Admin',
        ]);
        $admin->assignRole('Admin');

        $encoder = User::factory()->create([
            'name' => 'Encoder User',
            'email' => 'encoder@gmail.com',
            'password' => bcrypt('12345'),
            'role' => 'Encoder',
        ]);
        $encoder->assignRole('Encoder');

        $this->call(MockDataSeeder::class);
    }
}
