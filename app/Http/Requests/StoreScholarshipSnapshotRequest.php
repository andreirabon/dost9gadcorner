<?php

namespace App\Http\Requests;

use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreScholarshipSnapshotRequest extends FormRequest
{
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
        $today = now('Asia/Manila')->toDateString();

        return [
            'school_year_id' => ['required', 'integer', 'exists:school_years,id'],
            'as_of_date' => ['nullable', 'date'],
            'female_count' => ['required', 'integer', 'min:0', 'max:2147483647'],
            'non_binary_count' => ['required', 'integer', 'min:0', 'max:2147483647'],
            'genderqueer_count' => ['required', 'integer', 'min:0', 'max:2147483647'],
            'male_count' => ['required', 'integer', 'min:0', 'max:2147483647'],
        ];
    }
}
