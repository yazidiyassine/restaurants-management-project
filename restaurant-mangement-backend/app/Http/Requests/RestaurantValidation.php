<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RestaurantValidation extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'pincode' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'ispromoting' => ['required', 'string', 'max:6'],
            ];
    }
}
