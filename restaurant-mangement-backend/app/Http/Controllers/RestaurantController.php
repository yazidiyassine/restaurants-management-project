<?php

namespace App\Http\Controllers;

use App\Http\Requests\RestaurantValidation;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use function PHPUnit\Framework\isEmpty;

class RestaurantController extends Controller
{

    public function store(RestaurantValidation $request): JsonResponse
    {
        try {
            // Attempt to authenticate the user using the token
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

            $restaurant = $user->restaurants()->create($data);

            return response()->json([
                'message' => 'Restaurant created successfully',
                'restaurant_id' => $restaurant->id
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function list(): JsonResponse
    {
        # $restaurants = Restaurant::withTrashed(['state', 'country']) to
        # get all restaurants including archived ones
        $restaurants = Restaurant::with(['state', 'country'])
            ->where('user_id', Auth::id())
            ->get();
        #->sortBy('name');

        return response()->json([
            'restaurants' => RestaurantResource::collection($restaurants)
        ], 200);
    }

    public function update(RestaurantValidation $request, int $restaurantId): JsonResponse
    {
        try {
            # Ensure that the user can only update their own restaurants
            $restaurant = Restaurant::where('user_id', Auth::id())
                ->where('id', $restaurantId)
                ->firstOrFail();

            # Update the restaurant with the validated data
            $data = $request->validated();

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = Auth::id() . '_' . time() . '_' . Str::random(10) . '.' . $file->extension();
                $filePath = $file->storeAs('images', $fileName, 'public');

                if ($filePath) {
                    $data['image'] = $filePath;
                } else {
                    throw new \Exception('Image upload failed');
                }
            }

            $restaurant->update($data);

            return response()->json([
                'message' => 'Restaurant updated successfully',
                'restaurant_id' => $restaurant->id
            ], 200);
        } catch (ModelNotFoundException $exception) {
            # Return a 404 response when the restaurant is not found or doesn't belong to the authenticated user
            return response()->json(['message' => 'Restaurant not found or not owned by the authenticated user'], 404);
        }
    }


    public function archive(int $restaurantId): JsonResponse
    {
        try {
            # Ensure that the user can only archive their own restaurants
            $restaurant = Restaurant::where('user_id', Auth::id())
                ->where('id', $restaurantId)
                ->firstOrFail();

            # Archive the restaurant
            if ($restaurant->image) {
                // Delete the image file when archiving
                Storage::disk('public')->delete($restaurant->image);
            }

            $restaurant->delete();

            return response()->json([
                'message' => 'Restaurant'.$restaurant->id.' archived successfully',
                'restaurant_id' => $restaurant->id
            ], 200);
        } catch (ModelNotFoundException $exception) {
            # Return a 404 response when the restaurant is not found or doesn't belong to the authenticated user
            return response()->json(['message' => 'Restaurant not found or not owned by the authenticated user'], 404);
        }
    }


    public function show(int $restaurantId): JsonResponse
    {
        try {
            # Ensure that the user can only view their own restaurants
            $restaurant = Restaurant::where('id', $restaurantId)
                ->firstOrFail();

            return response()->json([
                'restaurant' => new RestaurantResource($restaurant)
            ], 200);
        } catch (ModelNotFoundException $exception) {
            # Return a 404 response when the restaurant is not found or doesn't belong to the authenticated user
            return response()->json(['message' => 'Restaurant not found or not owned by the authenticated user'], 404);
        }
    }

    public function all()
    {
        $restaurants = Restaurant::with(['state', 'country'])
            ->get()
            ->sortBy('name');

        return response()->json([
            'restaurants' => RestaurantResource::collection($restaurants)
        ], 200);
    }

    public function getInfo(int $restaurantId)
    {
        try {
            $restaurant = Restaurant::where('id', $restaurantId)
                ->firstOrFail();

            return response()->json([
                'restaurant' => new RestaurantResource($restaurant)
            ], 200);
        } catch (ModelNotFoundException $exception) {
            # Return a 404 response when the restaurant is not found or doesn't belong to the authenticated user
            return response()->json(['message' => 'Restaurant not found'], 404);
        }
    }
}
