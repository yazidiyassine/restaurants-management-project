<?php

namespace Database\Factories;

use App\Models\Country;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Restaurant>
 */
class RestaurantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    # q: explain how to generate 20 restaurants with 20 users and 20 countries and 20 states?
    # a: https://laravel.com/docs/8.x/database-testing#relationships

    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $state = State::inRandomOrder()->first();
        $country = Country::inRandomOrder()->first();
        $images = ['1_1703168788_aWWTtaq3is.png',
            '1_1703170285_i86kn22nmk.webp',
            '1_1703170480_3ZYIB6SAGR.png'];

        return [
            'user_id' => $user ? $user->id : User::factory(),
            'name' => $this->faker->unique()->company(),
            'address_line_1' => $this->faker->streetAddress(),
            'address_line_2' => $this->faker->streetAddress(),
            'pincode' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'ispromoting' => false,
            #'image' => 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/490629b70f89da8a5b93fc199ece335e',
            'image' => $this->faker->randomElement($images),
            'state_id' => $state ? $state->id : State::factory(),
            'country_id' => $country ? $country->id : Country::factory(),
        ];
        /*return [
            'user_id' => User::factory()->create()->id,
            'name' => $this->faker->unique()->company(),
            'address_line_1' => $this->faker->streetAddress(),
            'address_line_2' => $this->faker->streetAddress(),
            'pincode' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'state_id' => State::factory()->create()->id,
            'country_id' => Country::factory()->create()->id,
        ];*/
    }

}
