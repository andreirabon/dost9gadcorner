<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScholarshipApplicantSummariesRequest extends FormRequest
{
    use ValidatesSparsePatchPayload;

    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateScholarship', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'applicants' => ['required', 'array', 'min:1'],
            'applicants.*.scholarship_program_id' => ['required', 'integer', Rule::exists('scholarship_programs', 'id')],
            'applicants.*.female_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'applicants.*.male_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var array<int, array<string, mixed>> $applicants */
            $applicants = $this->input('applicants', []);

            $this->assertEachItemHasPatchField(
                $validator,
                $applicants,
                'scholarship_program_id',
                ['female_count', 'male_count'],
                'applicants',
            );
        });
    }
}
