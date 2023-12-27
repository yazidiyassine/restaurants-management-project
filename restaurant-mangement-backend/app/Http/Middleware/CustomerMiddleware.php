<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and has 'customer' role
        if ($request->user() && $request->user()->hasRole('customer')) {
            return $next($request);
        }
        // If not, you can customize the response or redirect as needed
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
