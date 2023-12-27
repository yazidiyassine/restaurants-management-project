<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\ModelStates\Table\Available;
use App\ModelStates\Table\NonOperational;
use App\ModelStates\Table\Occupied;
use App\ModelStates\Table\Reserved;
use Illuminate\Http\JsonResponse;

class TableStatusController extends Controller
{
    public function markAsNonOperational(int $tableId): JsonResponse
    {
        $table = $this->fetchTable($tableId);

        $table->changeStatusTo(NonOperational::class);

        return response()->json([
            'message' => 'Table marked as non-operational successfully',
            'table_id' => $table->id
        ]);
    }

    public function markAsAvailable(int $tableId): JsonResponse
    {
        $table = $this->fetchTable($tableId);

        $table->changeStatusTo(Available::class);

        return response()->json([
            'message' => 'Table marked as available successfully',
            'table_id' => $table->id
        ]);
    }

    public function markAsReserved(int $tableId): JsonResponse
    {
        $table = $this->fetchTable($tableId);

        $table->changeStatusTo(Reserved::class);

        return response()->json([
            'message' => 'Table marked as reserved successfully',
            'table_id' => $table->id
        ]);
    }

    public function markAsOccupied(int $tableId): JsonResponse
    {
        $table = $this->fetchTable($tableId);

        $table->changeStatusTo(Occupied::class);

        return response()->json([
            'message' => 'Table marked as occupied successfully',
            'table_id' => $table->id
        ]);
    }

    private function fetchTable(int $tableId): Table
    {
        return Table::where('restaurant_id', request('restaurant_id'))
            ->where('id', $tableId)
            ->firstOrFail();
    }
}
