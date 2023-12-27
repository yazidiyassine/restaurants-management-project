<?php

namespace App\Http\Controllers;

use App\Http\Requests\TableValidation;
use App\Http\Resources\TableResource;
use App\Models\Table;
use Illuminate\Http\JsonResponse;

class TableController extends Controller
{

    public function store(TableValidation $request): JsonResponse
    {
        $table = Table::create($request->validated());
        return response()->json([
            'message' => 'Table created successfully',
            'table_id' => $table->id
        ]);
    }

    public function list(): JsonResponse
    {
        if (request()->has('restaurant_id')) {
            $tables = Table::where('restaurant_id', request('restaurant_id'))->get();
            return response()->json([
                'tables' => TableResource::collection($tables)
            ]);
        } else {
            $tables = Table::all();
            return response()->json([
                'tables' => TableResource::collection($tables)
            ]);
        }
    }

    public function update(TableValidation $request, $table_id): JsonResponse
    {
        $table = Table::find($table_id);
        $table->update($request->validated());
        return response()->json([
            'message' => 'Table updated successfully',
            'table_id' => $table->id
        ]);
    }

    public function archive($table_id): JsonResponse
    {
        $table = Table::find($table_id);
        $table->delete();
        return response()->json([
            'message' => 'Table archived successfully',
            'table_id' => $table->id
        ]);
    }

    public function show($restaurant_id): JsonResponse
    {
        if (!is_numeric($restaurant_id)) {
            return response()->json([
                'message' => 'Invalid restaurant id'
            ]);
        } else {
            $tables = Table::where('restaurant_id', $restaurant_id)->get();
            if ($tables->isEmpty()) {
                return response()->json([
                    'message' => 'No tables found for this restaurant'
                ]);
            }
            return response()->json([
                'tables' => TableResource::collection($tables)
            ]);
        }
    }
}
