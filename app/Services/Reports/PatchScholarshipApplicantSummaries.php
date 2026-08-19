<?php

namespace App\Services\Reports;

use App\Models\ReportYear;
use App\Models\ScholarshipApplicantSummary;

final class PatchScholarshipApplicantSummaries
{
    private const VALUE_FIELDS = [
        'female_count',
        'male_count',
    ];

    public function __construct(private SparseRowPatcher $patcher) {}

    /**
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, array $patches): void
    {
        $this->patcher->apply(
            ScholarshipApplicantSummary::class,
            $patches,
            function (array $patch) use ($reportYear): ?array {
                if (! array_key_exists('scholarship_program_id', $patch)) {
                    return null;
                }

                return [
                    'identity' => [
                        'report_year_id' => $reportYear->id,
                        'scholarship_program_id' => $patch['scholarship_program_id'],
                    ],
                    'attributes' => array_intersect_key($patch, array_flip(self::VALUE_FIELDS)),
                ];
            },
        );
    }
}
