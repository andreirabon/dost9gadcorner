<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRstlMonthlyBreakdownsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateRstlMonthly', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'breakdowns' => ['required', 'array', 'min:1'],
            'breakdowns.*.report_month_id' => ['required', 'integer', Rule::exists('report_months', 'id')],
            'breakdowns.*.female_count' => ['required', 'integer', 'min:0'],
            'breakdowns.*.female_led_count' => ['required', 'integer', 'min:0'],
            'breakdowns.*.male_count' => ['required', 'integer', 'min:0'],
            'breakdowns.*.male_led_count' => ['required', 'integer', 'min:0'],
        ];
    }
}
