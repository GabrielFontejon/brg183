<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create initial roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $encoderRole = Role::firstOrCreate(['name' => 'Encoder']);

        // Create specific permissions
        $permissions = [
            'manage personnel',
            'view audit trail',
            'manage cases',
            'create documents',
            'edit documents',
            'delete documents',
            'generate reports'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Give admin all permissions initially
        $adminRole->syncPermissions(Permission::all());

        // Give encoder limited permissions initially
        $encoderRole->syncPermissions([
            'manage cases',
            'create documents',
            'edit documents',
            'delete documents',
        ]);

        // Assign Spatie roles to all existing users based on their string 'role' column
        $users = User::all();

        foreach ($users as $user) {
            if ($user->role === 'Admin') {
                $user->assignRole($adminRole);
            } elseif ($user->role === 'Encoder') {
                $user->assignRole($encoderRole);
            }
        }
    }
}
