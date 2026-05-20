<?php

namespace App\Services\Reports;

use App\Models\ReportYear;
use Illuminate\Database\Eloquent\Model;

final class SparseRecordPatcher
{
    /**
     * @param  array<string, mixed>  $patch
     * @param  list<string>  $allowedFields
     */
    public function applyToReportYearRelation(
        ReportYear $reportYear,
        string $relationName,
        array $patch,
        array $allowedFields,
    ): void {
        $attributes = $this->onlyAllowedFields($patch, $allowedFields);

        if ($attributes === []) {
            return;
        }

        $reportYear->{$relationName}()->updateOrCreate(
            ['report_year_id' => $reportYear->id],
            $attributes,
        );
    }

    /**
     * @param  array<string, mixed>  $patch
     * @param  list<string>  $allowedFields
     */
    public function applyToModel(Model $model, array $patch, array $allowedFields): void
    {
        $attributes = $this->onlyAllowedFields($patch, $allowedFields);

        if ($attributes === []) {
            return;
        }

        $model->fill($attributes)->save();
    }

    /**
     * @param  array<string, mixed>  $patch
     * @param  list<string>  $allowedFields
     * @return array<string, mixed>
     */
    private function onlyAllowedFields(array $patch, array $allowedFields): array
    {
        return array_intersect_key($patch, array_flip($allowedFields));
    }
}
