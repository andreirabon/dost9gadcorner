<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\EditsReportYearAttributes;
use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportYearRequest extends FormRequest
{
    use EditsReportYearAttributes;
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
        return [
            ...$this->reportYearAttributeRules(),
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

    protected function prepareForValidation(): void
    {
        $this->sanitizeReportYearText();
    }
}
