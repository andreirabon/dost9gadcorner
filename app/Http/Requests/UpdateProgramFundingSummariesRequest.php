<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProgramFundingSummariesRequest extends FormRequest
{
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
            'summaries' => ['required', 'array', 'min:1'],
            'summaries.*.funding_program_id' => ['required', 'integer', Rule::exists('funding_programs', 'id')],
            'summaries.*.female_projects' => ['required', 'integer', 'min:0'],
            'summaries.*.female_amount' => ['required', 'numeric', 'min:0'],
            'summaries.*.male_projects' => ['required', 'integer', 'min:0'],
            'summaries.*.male_amount' => ['required', 'numeric', 'min:0'],
        ];
    }
}
