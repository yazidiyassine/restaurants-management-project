<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

# composer require flynsarmy/csvs-seeder
# php artisan make:seeder CountriesTableSeeder
class CountryController extends Controller
{

    public function get(): JsonResponse
    {
        // TODO: Implement __invoke() method.
        $countries = Cache::rememberForever('countries', function () {
            return Country::all();
        });

        return response()->json([
            'countries' => $countries
        ], 200);
    }

    public function show($id): JsonResponse
    {
        $country = Country::with('states')->find($id);
        return response()->json([
            'country' => $country
        ], 200);
    }
}

