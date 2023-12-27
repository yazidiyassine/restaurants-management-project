<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\Table;
use App\Models\User;
use App\ModelStates\Table\Occupied;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class OrderItemTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $restaurant;

    private $table;

    private $menuItem;

    private $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->restaurant = Restaurant::factory()->create([
            'user_id' => $this->user->id,
        ]);
        $this->menuItem = MenuItem::factory()->create([
            'restaurant_id' => $this->restaurant->id,
        ]);
        $this->table = Table::factory()->create([
            'restaurant_id' => $this->restaurant->id,
        ]);
        $this->order = Order::factory()->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);

        Sanctum::actingAs($this->user, ['*']);
    }

    public function testAddOrderItemsValidationWorks()
    {
        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['menu_items']);
    }

    public function testOtherRestaurantOrderItemsCannotBeAdded()
    {
        $order = Order::factory()->create();

        $this->postJson('/api/order-items/add/' . $order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 1,
            ]],
        ])->assertStatus(404);
    }

    public function testOtherRestaurantenMenuItemsCannotBeAdded()
    {
        $menuItem = MenuItem::factory()->create();

        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $menuItem->id,
                'quantity' => 1,
            ]],
        ])->assertStatus(417);
    }

    public function testOrderItemsCanBeAdded()
    {
        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 1,
            ]],
        ])->assertOk()
            ->assertJson(
                fn (AssertableJson $json) => $json->where('order.id', $this->order->id)
                    ->where('order.table.id', $this->table->id)
                    ->where('order.status', 'Open')
                    ->has('order.items', 1)
                    ->etc()
            );

        $this->assertDatabaseHas('orders', [
            'id' => $this->order->id,
            'total' => $this->menuItem->price,
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $this->order->id,
            'menu_item_id' => $this->menuItem->id,
            'total' => $this->menuItem->price,
        ]);
    }

    public function testOrderItemQuantityIsUpdatedWhenAddedAgain()
    {
        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 1,
            ]],
        ])->assertOk();

        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 1,
            ]],
        ])->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $this->order->id,
            'total' => $this->menuItem->price * 2,
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $this->order->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 2,
            'total' => $this->menuItem->price * 2,
        ]);
    }
    public function testOrderItemsQuantityCanBeChanged()
    {
        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 5,
            ]],
        ])->assertOk();

        $this->postJson('/api/order-items/change-quantity/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 3,
            ]],
        ])->assertOk()
            ->assertJson(
                fn (AssertableJson $json) => $json->where('order.id', $this->order->id)
                    ->where('order.table.id', $this->table->id)
                    ->where('order.status', 'Open')
                    ->has('order.items', 1)
                    ->etc()
            );

        $this->assertDatabaseHas('orders', [
            'id' => $this->order->id,
            'total' => $this->menuItem->price * 3,
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $this->order->id,
            'menu_item_id' => $this->menuItem->id,
            'quantity' => 3,
            'total' => $this->menuItem->price * 3,
        ]);
    }

    # using the assertDatabaseMissing() method to ensure that order items are removed from the table.
    public function testOrderItemsCanBeRemoved()
    {
        $this->postJson('/api/order-items/add/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_items' => [[
                'id' => $this->menuItem->id,
                'quantity' => 5,
            ]],
        ])->assertOk();

        $this->postJson('/api/order-items/remove/' . $this->order->id, [
            'restaurant_id' => $this->restaurant->id,
            'menu_item_ids' => [$this->menuItem->id],
        ])->assertOk();

        $this->assertDatabaseMissing('order_items', [
            'order_id' => $this->order->id,
            'menu_item_id' => $this->menuItem->id,
        ]);
    }
    public function testOtherRestaurantOrderCannotBeCompleted()
    {
        $order = Order::factory()->create();

        $this->postJson('/api/orders/complete/' . $order->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertStatus(404);
    }

    public function testOrderCanBeCompleted()
    {
        $time = now();
        $this->travelTo($time);

        $order = Order::factory()->create([
            'restaurant_id' => $this->restaurant->id,
            'table_id' => $this->table->id,
        ]);
        $this->table->changeStatusTo(Occupied::class);

        $this->postJson('/api/orders/complete/' . $order->id, [
            'restaurant_id' => $this->restaurant->id,
        ])->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'completed_at' => $time,
        ]);

        $this->assertDatabaseHas('tables', [
            'id' => $this->table->id,
            'state' => 'App\ModelStates\Table\Available',
        ]);
    }
}
