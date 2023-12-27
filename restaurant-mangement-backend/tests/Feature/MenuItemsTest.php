<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MenuItemsTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $restaurant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->restaurant = Restaurant::factory()->create([
            'user_id' => $this->user->id,
        ]);

        Sanctum::actingAs($this->user, ['*']);
    }
    /**
     * A basic feature test example.
     */
    # testing cached menu items
    public function testMenuItemsAreCached()
    {
        MenuItem::factory()->count(3)->create([
            'restaurant_id' => $this->restaurant->id,
        ]);

        $this->json('GET', '/api/menu_items/list', [
            'restaurant_id' => $this->restaurant->id,
        ]);

        $this->assertTrue(Cache::has('menu_items_of_' . $this->restaurant->id));

        $this->postJson('/api/menu_items/add', [
            'restaurant_id' => $this->restaurant->id,
            'name' => 'Test',
            'price' => 100,
        ]);

        $this->assertTrue(Cache::missing('menu_items_of_' . $this->restaurant->id));
    }

    public function test_MenuItemsAreCached()
    {
        // Cache a menu item first
        $menuItem = Cache::rememberForever('menu_items_of_' . $this->restaurant->id, function () {
            return MenuItem::where('restaurant_id', $this->restaurant->id)->get();
        });

        // Make a request to the list endpoint for the specific restaurant
        $response = $this->getJson('/api/menu_items/list?restaurant_id=' . $this->restaurant->id);

        // Assert that the response has the 'menuItems' key
        $response->assertJson(fn ($json) => $json->has('menuItems'));

        // Retrieve the menu items from the response
        $menuItemsFromResponse = $response->json('menuItems');

        // Assert that the menu items from the response match the cached menu items
        $this->assertEquals(
            $menuItem->pluck('id')->toArray(),
            array_column($menuItemsFromResponse, 'id')
        );
    }


    # Add a test to ensure that calling any of these API endpoints without passing restaurant_id
    public function test_menu_items_api_without_restaurant_id(): void
    {
        $response = $this->getJson('/api/menu_items/list');

        $response->assertStatus(422);
    }

    # Add one more test to confirm that the passed restaurant_id is owned by the logged-in user.
    public function test_menu_items_api_with_valid_restaurant_id(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a restaurant owned by the authenticated user
        $restaurant = Restaurant::factory()->create(['user_id' => $user->id]);
        $menuItem = MenuItem::factory()->create(['restaurant_id' => $restaurant->id]);
        $response = $this->getJson("/api/menu_items/list/".$menuItem->id."/?restaurant_id={$restaurant->id}");

        $response->assertStatus(200);
    }

    public function test_menu_items_api_with_restaurant_id_not_owned_by_logged_in_user(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);


        $otherRestaurant = Restaurant::factory()->create();

        $response = $this->getJson("/api/menu_items/list?restaurant_id={$otherRestaurant->id}");

        $response->assertStatus(404);
    }

    # Confirm that the list API returns the menu items as expected and does not return menu items from any other restaurant, whether or not it is owned by the user.
    public function test_menu_items_api_with_valid_restaurant_id_returns_menu_items(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a restaurant owned by the authenticated user
        $restaurant = Restaurant::factory()->create(['user_id' => $user->id]);

        $menuItem = MenuItem::factory()->create(['restaurant_id' => $restaurant->id]);

        $response = $this->getJson("/api/menu_items/list/{$menuItem->id}/?restaurant_id={$restaurant->id}");

        $response->assertStatus(200);
    }

    # Test that the validation for add and update menu items is working.
    public function test_add_menu_item_validation(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $restaurantId =  Restaurant::factory()->create(['user_id' => $user->id])->id;
        $this->postJson('/api/menu_items/add/?restaurant_id={$restaurantId}', [
            'name' => 'Test',
            'description' => 'Test',
            'price' => '50.5',
            'restaurant_id' => $restaurantId,
        ])->assertOk()
            ->assertJsonStructure(['menu_item_id']);
    }

    public function test_update_menu_item_validation(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $restaurantId =  Restaurant::factory()->create(['user_id' => $user->id])->id;
        $menuItem = MenuItem::factory()->create(['restaurant_id' => $restaurantId]);
        $this->postJson('/api/menu_items/update/' . $menuItem->id . '/?restaurant_id={$restaurantId}', [
            'name' => 'Test',
            'description' => 'Test',
            'price' => '50.5',
            'restaurant_id' => $restaurantId,
        ])->assertOk()
            ->assertJsonStructure(['menu_item_id']);
    }

    # Add tests to make sure that menu items can be successfully added, updated, and archived.
    public function test_archive_menu_item(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $restaurantId =  Restaurant::factory()->create(['user_id' => $user->id])->id;
        $menuItem = MenuItem::factory()->create(['restaurant_id' => $restaurantId]);
        $this->deleteJson("/api/menu_items/archive/".$menuItem->id."/?restaurant_id={$restaurantId}")
            ->assertOk()
            ->assertJsonStructure(['menu_item_id']);
    }

    #  verify that attempts to update or archive a menu item that belongs to any other restaurant or owner fail
    public function test_update_menu_item_not_owned_by_logged_in_user(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $restaurantId =  Restaurant::factory()->create()->id;
        $menuItem = MenuItem::factory()->create(['restaurant_id' => $restaurantId]);
        $this->postJson('/api/menu_items/update/' . $menuItem->id . '/?restaurant_id={$restaurantId}', [
            'name' => 'Test',
            'description' => 'Test',
            'price' => '50.5',
            'restaurant_id' => $restaurantId,
        ])->assertStatus(404);
    }
    #  verify that attempts to update or archive a menu item that belongs to any other restaurant or owner fail
    public function test_archive_menu_item_not_owned_by_logged_in_user(): void
    {
        $restaurantId =  Restaurant::factory()->create()->id;
        $menuItem = MenuItem::factory()->create(['restaurant_id' => $restaurantId]);
        $this->deleteJson("/api/menu_items/archive/".$menuItem->id."/?restaurant_id={$restaurantId}")
            ->assertStatus(404);
    }
}
