<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'menu_item' => new MenuItemResource($this->whenLoaded('menuItem')),
            'quantity' => $this->quantity,
            'total' => $this->total,
        ];
    }
}
