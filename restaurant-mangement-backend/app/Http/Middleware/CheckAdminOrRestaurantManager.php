<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdminOrRestaurantManager
{
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated and has either 'admin' or 'restaurant_manager' role
        if (Auth::check() && (Auth::user()->hasRole('admin') || Auth::user()->hasRole('restaurant_manager'))) {
            return $next($request);
        }

        // If not, you can customize the response or redirect as needed
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
