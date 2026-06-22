<?php

namespace App\Services\Reports;

use App\Models\ReportYear;
use App\Models\RstlMonthlyBreakdown;

final class PatchRstlMonthlyBreakdowns
{
    private const VALUE_FIELDS = [
        'female_count',
        'female_led_count',
        'male_count',
        'male_led_count',
    ];

    public function __construct(private SparseRowPatcher $patcher) {}

    /**
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, array $patches): void
    {
        $this->patcher->apply(
            RstlMonthlyBreakdown::class,
            $patches,
            function (array $patch) use ($reportYear): ?array {
                if (! array_key_exists('report_month_id', $patch)) {
                    return null;
                }

                return [
                    'identity' => [
                        'report_year_id' => $reportYear->id,
                        'report_month_id' => $patch['report_month_id'],
                    ],
                    'attributes' => array_intersect_key($patch, array_flip(self::VALUE_FIELDS)),
                ];
            },
        );
    }
}
