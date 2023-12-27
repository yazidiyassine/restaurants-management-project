<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItemsValidation;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MenuItemsController extends Controller
{

    public function store(MenuItemsValidation $request): JsonResponse
    {
        $user = Auth::userOrFail();
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = $user->id . '_' . time() . '_' . Str::random(10) . '.' . $file->extension();
            $filePath = $file->storeAs('images', $fileName, 'public');

            if ($filePath) {
                $data['image'] = $filePath;
            } else {
                throw new \Exception('Image upload failed');
            }
        }

        $menuItem = MenuItem::create(array_merge($data, ['user_id' => Auth::id()]));

        Cache::forget('menu_items_of_' . $menuItem->restaurant_id);
        # why do we need to forget the cache?
        # because we want to update the cache with the new menu item
        return response()->json([
            'message' => 'Menu Item created successfully',
            'menu_item_id' => $menuItem->id
        ], 200);
    }

    # menu items for a specific restaurant
    public function list(): JsonResponse
    {
        # checks for restaurant_id in the request and only returns menu items for that restaurant
        if (request()->has('restaurant_id')) {
            # implementing caching
            # why caching? because we don't want to hit the database every time we make a request to this endpoint
            # we want to cache the menu items for a specific restaurant
            $menuItems = Cache::rememberForever('menu_items_of_' . request('restaurant_id'), function () {
                return MenuItem::where('restaurant_id', request('restaurant_id'))->get();
            });
        } else {
            $menuItems = MenuItem::all();
        }

        return response()->json([
            'menuItems' => MenuItemResource::collection($menuItems)
        ], 200);

    }

    public function update(MenuItemsValidation $request, int $menuItemId): JsonResponse
    {
        try {
            $menuItem = MenuItem::findOrFail($menuItemId);
            $data = $request->validated();

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = Auth::id() . '_' . time() . '_' . Str::random(10) . '.' . $file->extension();
                $filePath = $file->storeAs('images', $fileName, 'public');

                if ($filePath) {
                    $data['image'] = $fileName;
                } else {
                    throw new \Exception('Image upload failed');
                }
            }

            // Merge the validated data with the user_id
            $menuItem->update(array_merge($data, ['user_id' => Auth::id()]));

            return response()->json([
                'message' => 'Menu Item updated successfully',
                'menu_item_id' => $menuItem->id
            ], 200);
        } catch (ModelNotFoundException $exception) {
            // Return a 404 response when the menu item is not found
            return response()->json(['message' => 'Menu Item not found'], 404);
        }
    }

    public function listItems(int $restaurant_id): JsonResponse
    {
        $user = Auth::user();
        $restaurant = $user->restaurants()->where('id', $restaurant_id)->first();

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }
        $menuItes = MenuItem::where("restaurant_id", $restaurant_id)->get();

        return response()->json([
            'menuItems' => MenuItemResource::collection($menuItes)
        ], 200);
    }

    public function archive(int $menuItemId): JsonResponse
    {
        try {
            $menuItem = MenuItem::findOrFail($menuItemId);

            if ($menuItem->image) {
                // Delete the image file when archiving
                Storage::disk('public')->delete('images/items/' . $menuItem->image);
            }

            $menuItem->delete();

            return response()->json([
                'message' => 'Menu Item archived successfully',
                'menu_item_id' => $menuItem->id
            ], 200);
        } catch (ModelNotFoundException $exception) {
            // Return a 404 response when the menu item is not found
            return response()->json(['message' => 'Menu Item not found'], 404);
        }
    }

    public function listMenuItems(): JsonResponse
    {
        $menuItems = MenuItem::all()->sortBy('restaurant_id');

        return response()->json([
            'menuItems' => MenuItemResource::collection($menuItems)
        ], 200);
    }
}
