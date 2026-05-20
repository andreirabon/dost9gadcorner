<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateScholarshipSummaryRequest extends FormRequest
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
            'school_year_id' => ['sometimes', 'required', 'exists:school_years,id'],
            'as_of_date' => ['sometimes', 'nullable', 'date'],
            'female_count' => ['sometimes', 'required', 'integer', 'min:0'],
            'male_count' => ['sometimes', 'required', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $this->assertHasAtLeastOneField(
                $validator,
                $this->all(),
                ['school_year_id', 'as_of_date', 'female_count', 'male_count'],
            );
        });
    }
}
