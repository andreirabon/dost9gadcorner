<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use App\Support\FundingProgramScope;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProgramFundingSummariesRequest extends FormRequest
{
    use ValidatesSparsePatchPayload;

    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateProgramFunding', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'summaries' => ['required', 'array', 'min:1'],
            'summaries.*.funding_program_id' => ['required', 'integer', Rule::exists('funding_programs', 'id')],
            'summaries.*.female_projects' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'summaries.*.female_amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:999999999999.99'],
            'summaries.*.male_projects' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'summaries.*.male_amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:999999999999.99'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var array<int, array<string, mixed>> $summaries */
            $summaries = $this->input('summaries', []);

            $this->assertEachItemHasPatchField(
                $validator,
                $summaries,
                'funding_program_id',
                ['female_projects', 'female_amount', 'male_projects', 'male_amount'],
                'summaries',
            );

            $this->assertEveryProgramIsInScope($validator, $summaries);
        });
    }

    /**
     * Reject the whole patch when it touches a funding program outside the
     * user's regional scope. The edit screen already hides those rows, but that
     * is presentation only — this is where the restriction is actually enforced.
     *
     * @param  array<int, array<string, mixed>>  $summaries
     */
    private function assertEveryProgramIsInScope(Validator $validator, array $summaries): void
    {
        $allowedProgramIds = FundingProgramScope::allowedProgramIdsFor($this->user());

        if ($allowedProgramIds === null) {
            return;
        }

        foreach ($summaries as $index => $summary) {
            if (! is_array($summary) || ! array_key_exists('funding_program_id', $summary)) {
                continue;
            }

            if (! in_array((int) $summary['funding_program_id'], $allowedProgramIds, true)) {
                $validator->errors()->add(
                    "summaries.{$index}.funding_program_id",
                    'You may only update funding programs assigned to you.',
                );
            }
        }
    }
}
