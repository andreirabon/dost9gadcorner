<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('update', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return [
            'year' => ['required', 'integer', 'min:2000', 'max:2100', Rule::unique('report_years', 'year')->ignore($reportYear->id)],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:4000'],
            'status' => ['required', Rule::in([ReportYear::STATUS_PENDING, ReportYear::STATUS_PUBLISHED])],
            'color_theme' => ['nullable', Rule::in(['violet', 'purple', 'indigo'])],
        ];
    }
}
