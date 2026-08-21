<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use App\Support\GfpsMemberStatuses;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGfpsMemberStatusBreakdownsRequest extends FormRequest
{
    use ValidatesSparsePatchPayload;

    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateGfpsMemberStatuses', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'breakdowns' => ['required', 'array', 'min:1'],
            /*
             * Restricted to the reportable statuses, not the whole lookup: the
             * edit screen only offers those, and a write for any other status
             * would create a row nothing renders.
             */
            'breakdowns.*.employment_status_id' => [
                'required',
                'integer',
                Rule::in(GfpsMemberStatuses::allowedIds()),
            ],
            'breakdowns.*.female_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'breakdowns.*.male_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
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
