<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportYearRequest extends FormRequest
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
            'year' => ['required', 'integer', 'min:2000', 'max:2100', 'unique:report_years,year'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:4000'],
            'status' => ['required', Rule::in([ReportYear::STATUS_PENDING, ReportYear::STATUS_PUBLISHED])],
            'color_theme' => ['nullable', Rule::in(['violet', 'purple', 'indigo'])],
            'background_image' => ['nullable', 'string', 'max:255'],
        ];
    }
}
