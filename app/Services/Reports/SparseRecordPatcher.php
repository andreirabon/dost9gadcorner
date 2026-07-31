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
     * @param  array<string, mixed>  $alsoSet  Written alongside the patch in the
     *                                         same save, and only when the patch
     *                                         actually changes something. Use it
     *                                         for audit stamps so a no-op patch
     *                                         cannot bump `updated_at`.
     */
    public function applyToModel(Model $model, array $patch, array $allowedFields, array $alsoSet = []): void
    {
        $attributes = $this->onlyAllowedFields($patch, $allowedFields);

        if ($attributes === []) {
            return;
        }

        $model->fill([...$attributes, ...$alsoSet])->save();
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
