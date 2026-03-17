<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'manage users',
            'create users',
            'view users',
            'create cases',
            'edit cases',
            'delete cases',
            'view cases',
            'create documents',
            'edit documents',
            'delete documents',
            'view documents',
            'manage roles'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // create roles and assign existing permissions
        $roleAdmin = Role::firstOrCreate(['name' => 'Admin']);
        $roleAdmin->givePermissionTo(Permission::all());

        $roleSecretary = Role::firstOrCreate(['name' => 'Lupon Secretary']);
        $roleSecretary->syncPermissions([
            'manage users',
            'view users',
            'view cases',
            'view documents',
            'manage roles'
        ]);

        $roleEncoder = Role::firstOrCreate(['name' => 'Data Encoder']);
        $roleEncoder->syncPermissions([
            'view cases',
            'create cases',
            'edit cases',
            'view documents',
            'create documents',
            'edit documents'
        ]);
    }
}
