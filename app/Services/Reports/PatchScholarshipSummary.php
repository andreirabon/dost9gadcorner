<?php

namespace App\Services\Reports;

use App\Models\ReportYear;

final class PatchScholarshipSummary
{
    public function __construct(private SparseRecordPatcher $patcher) {}

    /**
     * @param  array<string, mixed>  $patch
     */
    public function apply(ReportYear $reportYear, array $patch): void
    {
        $this->patcher->applyToReportYearRelation(
            $reportYear,
            'scholarshipSummary',
            $patch,
            ['school_year_id', 'as_of_date', 'female_count', 'male_count'],
        );
    }
}
