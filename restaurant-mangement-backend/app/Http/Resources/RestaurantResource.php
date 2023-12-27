<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class RestaurantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'ispromoting' =>$this->ispromoting,
            'address' => [
                'line_1' => $this->address_line_1,
                'line_2' => $this->address_line_2,
                'pincode' => $this->pincode,
                'city' => $this->city,
            ],
            'image' => $this->image ? asset(Storage::url($this->image)) : null,
            'state' => optional($this->state)->only(['id', 'name']),
            'country' => optional($this->country)->only(['id', 'name']),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
