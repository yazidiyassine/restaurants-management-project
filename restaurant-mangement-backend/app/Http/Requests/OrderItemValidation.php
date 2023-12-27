<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderItemValidation extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'menu_items' => ['required', 'array'],
            'menu_items.*' => ['array'],
            // existence will be checked when we fetch menu items
            'menu_items.*.id' => ['required', 'integer'],
            'menu_items.*.quantity' => ['required', 'integer'],
        ];
    }
}
