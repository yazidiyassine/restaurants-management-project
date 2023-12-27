<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderItemValidation;
use App\Http\Resources\OrderResource;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Psy\Util\Json;

class OrderItemController extends Controller
{
    public function add(OrderItemValidation $request, int $orderId):JsonResponse
    {
        $order = Order::with('items')
            ->where('restaurant_id', $request->input('restaurant_id'))
            ->findOrFail($orderId);

        $requestMenuItems = collect($request->input('menu_items'));

        $menuItems = $this->fetchMenuItems($requestMenuItems);
        $order->addItems($requestMenuItems, $menuItems);
        $order->load(['table', 'items', 'items.menuItem']);

        $order->recalculateTotal();

        return response()->json([
            'message' => "Your order has been processed, ENJOY!",
            'order' => new OrderResource($order)
        ]);
    }

    public function changeQuantity(OrderItemValidation $request, int $orderId)
    {
        $order = Order::with('items')
            ->where('restaurant_id', $request->input('restaurant_id'))
            ->findOrFail($orderId);

        $requestMenuItems = collect($request->input('menu_items'));

        $this->checkOrderItemsExistence($requestMenuItems->pluck('id'), $order);
        $menuItems = $this->fetchMenuItems($requestMenuItems);
        $order->changeItemsQuantity($requestMenuItems, $menuItems);
        $order->load(['table', 'items', 'items.menuItem']);

        $order->recalculateTotal();

        return [
            'order' => new OrderResource($order),
        ];
    }

    public function remove(int $orderId)
    {
        $order = Order::with('items')
            ->where('restaurant_id', request('restaurant_id'))
            ->findOrFail($orderId);

        $requestMenuItemIds = collect(request('menu_item_ids'));

        $this->checkOrderItemsExistence($requestMenuItemIds, $order);

        // Log the IDs before deletion
        Log::info('Deleting items with IDs: ' . implode(', ', $requestMenuItemIds->toArray()));

        $order->items()
            ->whereIn('menu_item_id', $requestMenuItemIds)
            ->delete();

        // Log a message after deletion
        Log::info('Items deleted successfully.');

        $order->load(['table', 'items', 'items.menuItem']);

        $order->recalculateTotal();

        return [
            'order' => new OrderResource($order),
        ];
    }


    private function fetchMenuItems(Collection $requestMenuItems): Collection
    {
        $menuItems = MenuItem::where('restaurant_id', request('restaurant_id'))
            ->whereIn('id', $requestMenuItems->pluck('id'))
            ->get(['id', 'price']);

        if ($menuItems->count() !== $requestMenuItems->count()) {
            abort(417, 'Some of the menu items could not be fetched. Please check menu items again.');
        }

        return $menuItems;
    }

    private function checkOrderItemsExistence(Collection $requestMenuItemIds, Order $order): void
    {
        $requestMenuItemIds->each(function ($requestMenuItemId) use ($order) {
            if (! $order->items->contains('menu_item_id', $requestMenuItemId)) {
                abort(417, 'The menu item with id ' . $requestMenuItemId . ' is not a part of order items.');
            }
        });
    }
}
