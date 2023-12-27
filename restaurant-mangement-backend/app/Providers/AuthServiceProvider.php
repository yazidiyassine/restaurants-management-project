<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot(): void
    {
        /*$this->registerPolicies();

        // Check if roles exist before creating them
        if (!Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin']);
        }

        if (!Role::where('name', 'restaurant_manager')->exists()) {
            Role::create(['name' => 'restaurant_manager']);
        }

        if (!Role::where('name', 'customer')->exists()) {
            Role::create(['name' => 'customer']);
        }*/

    }
}
