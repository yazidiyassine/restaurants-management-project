<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TableValidation extends FormRequest
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
            'number' => 'required|integer|min:1|max:12',
            'extra_details' => 'string',
            #'state' => 'required',
            'restaurant_id' => 'required|exists:restaurants,id'
        ];
    }
}
# ./vendor/bin/phpunit --filter TableStatusTest
