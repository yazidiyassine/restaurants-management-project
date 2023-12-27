<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'restaurant_id' => Restaurant::inRandomOrder()->first()->id,
            'table_id' => Table::inRandomOrder()->first()->id,
            #'restaurant_id' => Restaurant::factory(),
            #'table_id' => Table::factory(),
            #'user_id' => User::factory(),
            'total' => $this->faker->randomFloat(2, 1, 100),
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
