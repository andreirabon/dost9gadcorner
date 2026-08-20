<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\EditsReportYearAttributes;
use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReportYearMetadataRequest extends FormRequest
{
    use EditsReportYearAttributes;
    use ValidatesSparsePatchPayload;

    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateMetadata', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->reportYearAttributeRules();
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $this->assertHasAtLeastOneField($validator, $this->only(['year', 'title', 'description']), ['year', 'title', 'description']);
        });
    }

    protected function prepareForValidation(): void
    {
        $this->sanitizeReportYearText();
    }
}
