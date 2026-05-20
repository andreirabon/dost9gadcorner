<?php

namespace App\Services\Reports;

use App\Models\ReportYear;

final class PatchReportYearAttributes
{
    public function __construct(private SparseRecordPatcher $patcher) {}

    /**
     * @param  array<string, mixed>  $patch
     * @param  list<string>  $allowedFields
     */
    public function apply(ReportYear $reportYear, array $patch, array $allowedFields): void
    {
        $attributes = array_intersect_key($patch, array_flip($allowedFields));

        if (array_key_exists('status', $patch)) {
            $attributes['published_at'] = $patch['status'] === ReportYear::STATUS_PUBLISHED
                ? ($reportYear->published_at ?? now())
                : null;
        }

        if ($attributes === []) {
            return;
        }

        $reportYear->fill($attributes)->save();
    }
}
