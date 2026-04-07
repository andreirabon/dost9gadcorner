<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateScholarshipSummaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'school_year_label' => ['required', 'string', 'max:50'],
            'as_of_date' => ['nullable', 'date'],
            'female_count' => ['required', 'integer', 'min:0'],
            'male_count' => ['required', 'integer', 'min:0'],
        ];
    }
}
