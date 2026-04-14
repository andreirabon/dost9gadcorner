<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGfpsAssemblyAttendancesRequest extends FormRequest
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
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.period_id' => ['required', 'integer', Rule::exists('gfps_assembly_periods', 'id')],
            'attendances.*.female_count' => ['required', 'integer', 'min:0'],
            'attendances.*.male_count' => ['required', 'integer', 'min:0'],
        ];
    }
}
