<?php

namespace App\Services\Reports;

use App\Models\EmployeeStatusBreakdown;
use App\Models\ReportYear;

final class PatchEmployeeStatusBreakdowns
{
    private const VALUE_FIELDS = ['female_count', 'non_binary_count', 'genderqueer_count', 'male_count'];

    public function __construct(private SparseRowPatcher $patcher) {}

    /**
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, array $patches): void
    {
        $this->patcher->apply(
            EmployeeStatusBreakdown::class,
            $patches,
            function (array $patch) use ($reportYear): ?array {
                if (! array_key_exists('employment_status_id', $patch)) {
                    return null;
                }

                return [
                    'identity' => [
                        'report_year_id' => $reportYear->id,
                        'employment_status_id' => $patch['employment_status_id'],
                    ],
                    'attributes' => array_intersect_key($patch, array_flip(self::VALUE_FIELDS)),
                ];
            },
        );
    }
}
