<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\CountriesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CountryTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    public function testCountriesCanBeFetched()
    {
        $this->seed(CountriesSeeder::class);
        #Sanctum::actingAs(User::factory()->create(), ['create-post', 'edit-post', 'delete-post']);
        Sanctum::actingAs(User::factory()->create(), ['*']);

        $this->getJson('/api/get-countries')
            ->assertOk()
            ->assertJson(fn(AssertableJson $json) =>
            $json->has('countries')->has('countries.0'));

        // $this->getJson('/api/get-countries')
        //     ->assertOk()
        //     ->assertJsonStructure(['countries' => ['*' => ['id', 'name']]]);
    }
    # testing cached countries
    public function testCountriesAreCached()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        // Clear the cache to ensure a clean start
        Cache::forget('countries');

        # seed the database
        $this->seed(CountriesSeeder::class);

        // Fetch countries for the first time
        $response1 = $this->getJson('/api/get-countries');
        $data1 = $response1->json();

        // Assert a successful response and non-empty countries array
        $response1->assertStatus(200);
        $this->assertArrayHasKey('countries', $data1);
        $this->assertNotEmpty($data1['countries']);

        // Fetch countries for the second time
        $response2 = $this->getJson('/api/get-countries');
        $data2 = $response2->json();

        // Assert a successful response and non-empty countries array
        $response2->assertStatus(200);
        $this->assertArrayHasKey('countries', $data2);
        $this->assertNotEmpty($data2['countries']);

        // Assert that the data in the second response matches the first
        $this->assertEquals($data1['countries'], $data2['countries']);

        // Ensure that the cache key 'countries' exists
        $this->assertTrue(Cache::has('countries'));
    }
}
