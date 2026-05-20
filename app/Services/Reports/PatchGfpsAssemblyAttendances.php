<?php

namespace App\Services\Reports;

use App\Models\GfpsAssemblyAttendance;
use App\Models\ReportYear;

final class PatchGfpsAssemblyAttendances
{
    private const VALUE_FIELDS = ['female_count', 'male_count'];

    public function __construct(private SparseRowPatcher $patcher) {}

    /**
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, array $patches): void
    {
        $this->patcher->apply(
            GfpsAssemblyAttendance::class,
            $patches,
            function (array $patch) use ($reportYear): ?array {
                if (! array_key_exists('period_id', $patch)) {
                    return null;
                }

                return [
                    'identity' => [
                        'report_year_id' => $reportYear->id,
                        'gfps_assembly_period_id' => $patch['period_id'],
                    ],
                    'attributes' => array_intersect_key($patch, array_flip(self::VALUE_FIELDS)),
                ];
            },
        );
    }
}
