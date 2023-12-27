<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /*
         * The whenLoaded method removes the specified element from the array
         *  if the relationship data is not loaded on the Eloquent model object.
         *  This comes in handy when using the API resource for multiple API endpoints.*/
        return [
            'id' => $this->id,
            'table' => new TableResource($this->whenLoaded('table')),
            'total' => $this->total,
            'user_id' => $this->user_id,
            'status' => $this->getStatusLabel(),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
