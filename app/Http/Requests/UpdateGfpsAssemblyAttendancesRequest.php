<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSparsePatchPayload;
use App\Models\ReportYear;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGfpsAssemblyAttendancesRequest extends FormRequest
{
    use ValidatesSparsePatchPayload;

    public function authorize(): bool
    {
        /** @var ReportYear $reportYear */
        $reportYear = $this->route('reportYear');

        return $this->user()?->can('updateGfpsAssemblies', $reportYear) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.period_id' => ['required', 'integer', Rule::exists('gfps_assembly_periods', 'id')],
            'attendances.*.female_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'attendances.*.non_binary_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'attendances.*.genderqueer_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
            'attendances.*.male_count' => ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var array<int, array<string, mixed>> $attendances */
            $attendances = $this->input('attendances', []);

            $this->assertEachItemHasPatchField(
                $validator,
                $attendances,
                'period_id',
                ['female_count', 'non_binary_count', 'genderqueer_count', 'male_count'],
                'attendances',
            );
        });
    }
}
