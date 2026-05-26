<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportYearRequest extends FormRequest
{
    use ValidatesSparsePatchPayload;

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
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'year' => ['sometimes', 'required', 'integer', 'min:2000', 'max:2100', Rule::unique('report_years', 'year')->ignore($reportYear->id)],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:4000'],
            'status' => ['sometimes', 'required', Rule::in([ReportYear::STATUS_PENDING, ReportYear::STATUS_PUBLISHED])],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $this->assertHasAtLeastOneField($validator, $this->only(['year', 'title', 'description', 'status']), ['year', 'title', 'description', 'status']);
        });
    }
}
