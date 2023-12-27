<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if roles exist before creating them
        if (!Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin']);
        }

        if (!Role::where('name', 'restaurant_manager')->exists()) {
            Role::create(['name' => 'restaurant_manager']);
        }

        if (!Role::where('name', 'customer')->exists()) {
            Role::create(['name' => 'customer']);
        }
    }
}
