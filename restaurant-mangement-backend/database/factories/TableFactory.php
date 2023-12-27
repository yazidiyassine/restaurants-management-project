<?php

namespace Database\Factories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Table>
 */
class TableFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $restaurant = Restaurant::inRandomOrder()->first();

        return [
            'number' => $this->faker->numberBetween(1, 100),
            'extra_details' => $this->faker->text(100),
            'restaurant_id' => $restaurant ? $restaurant->id : Restaurant::factory(),
        ];
        /*return [
            'number' => $this->faker->numberBetween(1, 100),
            'extra_details' => $this->faker->text(100),
            'restaurant_id' => Restaurant::factory()->create()->id,
        ];*/
    }
}
