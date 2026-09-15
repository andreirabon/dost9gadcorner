<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\EditsReportYearAttributes;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportYearRequest extends FormRequest
{
    use EditsReportYearAttributes;

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
            'status' => [
                'required',
                Rule::in([ReportYear::STATUS_PENDING, ReportYear::STATUS_PUBLISHED]),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value === ReportYear::STATUS_PUBLISHED && ! $this->user()?->can('publish', ReportYear::class)) {
                        $fail('You do not have permission to create published reports.');
                    }
                },
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->sanitizeReportYearText();
    }
}
