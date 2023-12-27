<?php

namespace Tests\Feature;

use App\Models\State;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Cache;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StateTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        State::factory()->count(10)->create();

    }
    public function test_states_can_be_fetched()
    {
        $this->getJson('/api/get-states')
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) =>
            $json->has('states')->has('states.0'));
    }

    public function test_states_are_cached()
    {
        // Clear the cache to ensure a clean start
        Cache::forget('states');

        // Fetch states for the first time
        $response1 = $this->getJson('/api/get-states');
        $data1 = $response1->json();

        // Assert a successful response and non-empty states array
        $response1->assertStatus(200);
        $this->assertArrayHasKey('states', $data1);
        $this->assertNotEmpty($data1['states']);

        // Fetch states for the second time
        $response2 = $this->getJson('/api/get-states');
        $data2 = $response2->json();

        // Assert a successful response and non-empty states array
        $response2->assertStatus(200);
        $this->assertArrayHasKey('states', $data2);
        $this->assertNotEmpty($data2['states']);

        // Assert that the states are cached
        $this->assertTrue(Cache::has('states'));


    }
    public function test_state_can_be_created(): void
    {
        $this->withoutExceptionHandling();
        # caching

        $response = $this->postJson('/api/add-state', [
            'name' => 'Test State',
            'country_id' => 1
        ]);
        $response->assertStatus(200);
    }
}
