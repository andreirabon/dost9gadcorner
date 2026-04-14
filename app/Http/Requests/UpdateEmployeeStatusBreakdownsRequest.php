<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeStatusBreakdownsRequest extends FormRequest
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
        return [
            'breakdowns' => ['required', 'array', 'min:1'],
            'breakdowns.*.employment_status_id' => ['required', 'integer', Rule::exists('employment_statuses', 'id')],
            'breakdowns.*.female_count' => ['required', 'integer', 'min:0'],
            'breakdowns.*.male_count' => ['required', 'integer', 'min:0'],
        ];
    }
}
