<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class StateController extends Controller
{

    public function create(Request $request): JsonResponse
    {
        $this->validate($request, [
            'name' => 'required',
            'country_id' => 'required'
        ]);
        $state = new State([
            'name' => $request->input('name'),
            'country_id' => $request->input('country_id')
        ]);
        $state->save();
        Cache::forget('states');

        return response()->json([
            'message' => 'State created successfully'
        ], 200);
    }

    public function get(): JsonResponse
    {
        $states = Cache::rememberForever("states", function (){
            return State::all();
        });

        $data = [];

        foreach ($states as $state) {
            $data[] = [
                'id' => $state->id,
                'name' => $state->name,
                'country' => $state->country->name
            ];
        }
        return response()->json([
            'states' => $data
        ], 200);
    }

    public function list(): JsonResponse
    {
        $states = Cache::rememberForever("states", function (){
            return State::all();
        });

        return response()->json([
            'states' => $states
        ], 200);
    }
}
