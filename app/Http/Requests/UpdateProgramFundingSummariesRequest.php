<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ProgramFundingSummary;
use App\Models\ReportYear;
use App\Services\Reports\RowSection;
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
        $valueRules = collect(self::valueFields())->mapWithKeys(fn (string $field): array => [
            "summaries.*.{$field}" => in_array($field, ProgramFundingSummary::DECIMAL_FIELDS, true)
                ? ['sometimes', 'required', 'numeric', 'min:0', 'max:999999999999.99']
                : ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
        ])->all();

        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'summaries' => ['required', 'array', 'min:1'],
            'summaries.*.funding_program_id' => ['required', 'integer', Rule::exists('funding_programs', 'id')],
            ...$valueRules,
        ];
    }

    /**
     * @return list<string>
     */
    private static function valueFields(): array
    {
        return RowSection::config(RowSection::PROGRAM_FUNDING)['valueFields'];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var array<int, array<string, mixed>> $summaries */
            $summaries = $this->input('summaries', []);

            $this->assertEachItemHasPatchField($validator, $summaries, self::valueFields(), 'summaries');

            $this->assertEveryProgramIsInScope($validator, $summaries);
            $this->assertJobsBreakdownSumsToTotal($validator, $summaries);
        });
    }

    /**
     * jobs_male + jobs_female must equal jobs_total when all three are present
     * in the same patch row. The remaining jobs_* columns (PWD, senior citizen,
     * IP, 4Ps, youth) are overlapping subsets of male/female, not additional
     * counts, so they are intentionally excluded from this check.
     *
     * @param  array<int, array<string, mixed>>  $summaries
     */
    private function assertJobsBreakdownSumsToTotal(Validator $validator, array $summaries): void
    {
        foreach ($summaries as $index => $summary) {
            if (! is_array($summary)) {
                continue;
            }

            if (! array_key_exists('jobs_total', $summary) || ! array_key_exists('jobs_male', $summary) || ! array_key_exists('jobs_female', $summary)) {
                continue;
            }

            if ((int) $summary['jobs_male'] + (int) $summary['jobs_female'] !== (int) $summary['jobs_total']) {
                $validator->errors()->add(
                    "summaries.{$index}.jobs_total",
                    'Jobs male + jobs female must equal jobs total.',
                );
            }
        }
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
