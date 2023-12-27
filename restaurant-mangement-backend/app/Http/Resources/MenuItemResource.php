<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MenuItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            # I want the resaurant name to be displayed in the menu item list
            'restaurant' => $this->restaurant->only(['id', 'name']),
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'image' => $this->image ? asset(Storage::url($this->image)) : null,
        ];
    }
}
