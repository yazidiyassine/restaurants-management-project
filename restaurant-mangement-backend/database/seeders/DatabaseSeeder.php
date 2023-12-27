<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\AdminUserSeeder;
use App\Models\Country;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\State;
use App\Models\Table;
use App\Models\User;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        # Cache invalidation code can be added to the seeder files, but it's not necessary
        # because the cache is cleared when the database is refreshed.
        $this->call([
            RolesTableSeeder::class,
        ]);

        $this->call([
            AdminUserSeeder::class,
        ]);
        User::factory(5)->create();
        Country::factory()->count(5)->create();
        State::factory()->count(5)->create();
        /*Restaurant::factory()->count(5)->create();
        MenuItem::factory()->count(5)->create();
        Table::factory()->count(5)->create();
        Order::factory()->count(5)->create();
        OrderItem::factory()->count(5)->create();*/


    }
}
# q: how to run this seeder?
# a: php artisan db:seed
