<?php

namespace App\Http\Requests\Concerns;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

/**
 * Shared field handling for the two report-year attribute endpoints.
 *
 * Only the fields are shared. The authorization gates stay on each request:
 * `update` is administrator-only because it can publish, while
 * `updateMetadata` is open to every full-section editor.
 */
trait EditsReportYearAttributes
{
    /**
     * @return array<string, array<int, ValidationRule|string>>
     */
    protected function reportYearAttributeRules(): array
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'year' => ['sometimes', 'required', 'integer', 'min:2000', 'max:2100', Rule::unique('report_years', 'year')->ignore($reportYear->id)],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:4000'],
        ];
    }

    /**
     * Trim and strip tags from the free-text fields before validation, so a
     * pasted markup fragment never reaches the database or the report page.
     */
    protected function sanitizeReportYearText(): void
    {
        foreach (['title', 'description'] as $field) {
            if (! $this->has($field)) {
                continue;
            }

            $value = $this->input($field);

            $this->merge([$field => $value !== null ? trim(strip_tags($value)) : null]);
        }
    }
}
