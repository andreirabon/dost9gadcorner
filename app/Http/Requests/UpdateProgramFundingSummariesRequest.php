<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
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
            'summaries' => ['required', 'array', 'min:1'],
            'summaries.*.funding_program_id' => ['required', 'integer', Rule::exists('funding_programs', 'id')],
            'summaries.*.female_projects' => ['sometimes', 'required', 'integer', 'min:0'],
            'summaries.*.female_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'summaries.*.male_projects' => ['sometimes', 'required', 'integer', 'min:0'],
            'summaries.*.male_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
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
        });
    }
}
