<?php

namespace App\Services\Reports;

use App\Models\ProgramFundingSummary;
use App\Models\ReportYear;

final class PatchProgramFundingSummaries
{
    private const VALUE_FIELDS = [
        'female_projects',
        'female_amount',
        'male_projects',
        'male_amount',
        'funded_projects_count',
        'funded_projects_value',
        'training_participants',
        'jobs_total',
        'jobs_male',
        'jobs_female',
        'jobs_pwd',
        'jobs_senior_citizen',
        'jobs_ip',
        'jobs_4ps',
        'special_projects_research_male',
        'special_projects_research_female',
    ];

    public function __construct(private SparseRowPatcher $patcher) {}

    /**
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, array $patches): void
    {
        $this->patcher->apply(
            ProgramFundingSummary::class,
            $patches,
            function (array $patch) use ($reportYear): ?array {
                if (! array_key_exists('funding_program_id', $patch)) {
                    return null;
                }

                return [
                    'identity' => [
                        'report_year_id' => $reportYear->id,
                        'funding_program_id' => $patch['funding_program_id'],
                    ],
                    'attributes' => array_intersect_key($patch, array_flip(self::VALUE_FIELDS)),
                ];
            },
        );
    }
}
