<?php

namespace App\Http\Middleware;

use App\Models\Restaurant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequireRestaurant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (! $request->has('restaurant_id')) {
            return response()->json(['message' => 'Restaurant ID is required'], 422);
        }

        $ownedByUser = Restaurant::query()
            ->where('id', $request->input('restaurant_id'))
            ->exists();

        if (! $ownedByUser) {
            return response()->json(['message' => 'Restaurant not found or not owned by the authenticated user'], 404);
        }
        return $next($request);
    }
}
