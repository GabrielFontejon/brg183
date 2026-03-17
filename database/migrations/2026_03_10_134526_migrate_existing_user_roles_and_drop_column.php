<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Spatie\Permission\Models\Role;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First migrate existing users
        foreach (User::all() as $user) {
            if ($user->role) {
                // Determine which role to assign based on string value
                $roleName = match ($user->role) {
                    'Admin' => 'Admin',
                    'Lupon Secretary', 'Secretary' => 'Lupon Secretary',
                    'Data Encoder', 'Encoder', 'Staff' => 'Data Encoder',
                    default => 'Data Encoder'
                };

                // Ensure role exists (in case seeding hasn't run yet)
                Role::firstOrCreate(['name' => $roleName]);

                $user->assignRole($roleName);
            }
        }

        // Then drop the old string column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('Staff');
        });

        // Try to restore old role strings based on assigned Spatie roles
        foreach (User::all() as $user) {
            if ($user->hasRole('Admin')) {
                $user->role = 'Admin';
            } elseif ($user->hasRole('Lupon Secretary')) {
                $user->role = 'Lupon Secretary';
            } else {
                $user->role = 'Data Encoder';
            }
            $user->save();
        }
    }
};
