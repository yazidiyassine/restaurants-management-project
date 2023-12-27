<?php

namespace Database\Factories;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'menu_item_id' => MenuItem::inRandomOrder()->first()->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'total' => $this->faker->numberBetween(100, 1000),
            'order_id' => Order::inRandomOrder()->first()->id
        ];
    }
}
