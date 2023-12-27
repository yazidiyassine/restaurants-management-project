<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Table;
use App\ModelStates\Table\Available;
use App\ModelStates\Table\Occupied;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function bookATable(int $tableId): JsonResponse
    {
        $table = Table::where('restaurant_id', request("restaurant_id"))
            ->where('id', $tableId)
            ->firstOrFail();

        $table->changeStatusTo(Occupied::class);

        $order = Order::create([
            'restaurant_id' => request("restaurant_id"),
            'table_id' => $table->id,
            'user_id' => auth()->user()->id,
        ]);

        return response()->json([
            'message' => 'Table '.$table->id.' has been booked successfully',
            'order_id' => $order->id
        ]);
    }

    public function details(int $orderId): array
    {
        $order = Order::with(['table', 'items', 'items.menuItem'])
            ->where('restaurant_id', request("restaurant_id"))
            ->findOrFail($orderId);

        return [
            'order' => new OrderResource($order)
        ];
    }

    public function listOpen(): array
    {

        $orders = Order::with(['table', 'items', 'items.menuItem'])
            ->where('restaurant_id', request("restaurant_id"))
            ->open()
            ->get();

        return [
            'orders' => OrderResource::collection($orders)
        ];
    }

    public function  listCompleted(): array
    {
        $orders = Order::with(['table', 'items', 'items.menuItem'])
            ->where('restaurant_id', request("restaurant_id"))
            ->completed()
            ->get();

        return [
            'orders' => OrderResource::collection($orders)
        ];
    }

    public function complete(int $orderId): JsonResponse
    {
        $order = Order::with('table')
            ->where('restaurant_id', request("restaurant_id"))
            ->findOrFail($orderId);

        $order->table->changeStatusTo(Available::class);
        $order->complete();
        return response()->json([
            'message' => 'Order '.$order->id.' has been completed successfully',
            'order_id' => $order->id
        ]);
    }

    public function list(): array
    {
        $orders = Order::with(['table', 'items', 'items.menuItem'])
            ->where('restaurant_id', request("restaurant_id"))
            ->get();

        return [
            'orders' => OrderResource::collection($orders)
        ];
    }

    public function allUserOrders(): array
    {
        $orders = Order::with(['table', 'items', 'items.menuItem'])
            ->where('user_id', auth()->user()->id)
            ->get();

        return [
            'orders' => OrderResource::collection($orders)
        ];
    }

}
