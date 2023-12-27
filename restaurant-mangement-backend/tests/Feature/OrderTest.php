<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Restaurant;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class OrderTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $restaurant;

    private $table;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->restaurant = Restaurant::factory()->create([
            'user_id' => $this->user->id,
        ]);
        $this->table = Table::factory()->create([
            'restaurant_id' => $this->restaurant->id,
        ]);

        Sanctum::actingAs($this->user, ['*']);
    }

    public function testRestaurantMustMatchBeforeBookingATable()
    {
        $table = Table::factory()->create();

        $this->postJson('/api/orders/book-a-table/' . $table->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertStatus(404);
    }

    public function testATableCanBeBooked()
    {
        $this->postJson('/api/orders/book-a-table/' . $this->table->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertOk()
            ->assertJsonStructure(['order_id']);

        $this->assertDatabaseHas('orders', [
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);

        $this->assertDatabaseHas('tables', [
            'id' => $this->table->id,
            'state' => 'App\ModelStates\Table\Occupied',
        ]);
    }

    public function testOtherRestaurantOrderDetailsArentFetched()
    {
        $order = Order::factory()->create();

        $this->json('GET', '/api/orders/details/' . $order->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertStatus(404);
    }

    public function testOrderDetailsCanBeFetched()
    {
        $order = Order::factory()->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);

        $this->json('GET', '/api/orders/details/' . $order->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertOk()
            ->assertJson(
                fn (AssertableJson $json) => $json->where('order.id', $order->id)
                    ->where('order.table.id', $this->table->id)
                    ->where('order.status', 'Open')
                    ->has('order.items', 0)
                    ->etc()
            );
    }

    public function testOtherRestaurantOrdersArentListed()
    {
        Order::factory()->create();

        Order::factory()->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);

        $this->json('GET', '/api/orders/list-open/', [
            'restaurant_id' => $this->restaurant->id,
        ])->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json->has('orders', 1));
    }

    public function testOpenOrdersCanBeListed()
    {
        Order::factory()->count(3)->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);
        Order::factory()->completed()->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);

        $this->json('GET', '/api/orders/list-open/', [
            'restaurant_id' => $this->restaurant->id,
        ])->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json->has('orders', 3));
    }

    public function testCompletedOrdersCanBeListed()
    {
        Order::factory()->completed()->count(3)->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);
        Order::factory()->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);

        $this->json('GET', '/api/orders/list-completed/', [
            'restaurant_id' => $this->restaurant->id,
        ])->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json->has('orders', 3));
    }
}
