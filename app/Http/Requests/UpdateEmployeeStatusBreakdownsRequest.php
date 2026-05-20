<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeStatusBreakdownsRequest extends FormRequest
{
    use ValidatesSparsePatchPayload;

    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateEmployeeStatuses', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'breakdowns' => ['required', 'array', 'min:1'],
            'breakdowns.*.employment_status_id' => ['required', 'integer', Rule::exists('employment_statuses', 'id')],
            'breakdowns.*.female_count' => ['sometimes', 'required', 'integer', 'min:0'],
            'breakdowns.*.male_count' => ['sometimes', 'required', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var array<int, array<string, mixed>> $breakdowns */
            $breakdowns = $this->input('breakdowns', []);

            $this->assertEachItemHasPatchField(
                $validator,
                $breakdowns,
                'employment_status_id',
                ['female_count', 'male_count'],
                'breakdowns',
            );
        });
    }
}
