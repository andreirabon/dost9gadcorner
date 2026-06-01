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
        return $this->user()?->can('create', ReportYear::class) ?? false;
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
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('title')) {
            $this->merge([
                'title' => $this->input('title') !== null ? trim(strip_tags($this->input('title'))) : null,
            ]);
        }

        if ($this->has('description')) {
            $this->merge([
                'description' => $this->input('description') !== null ? trim(strip_tags($this->input('description'))) : null,
            ]);
        }
    }
}
