<?php

namespace App\Services\Reports;

use App\Models\ReportYear;

final class PatchGfpsMembershipSummary
{
    public function __construct(private SparseRecordPatcher $patcher) {}

    /**
     * @param  array<string, mixed>  $patch
     */
    public function apply(ReportYear $reportYear, array $patch): void
    {
        $this->patcher->applyToReportYearRelation(
            $reportYear,
            'gfpsMembershipSummary',
            $patch,
            ['female_count', 'non_binary_count', 'genderqueer_count', 'male_count'],
        );
    }
}
