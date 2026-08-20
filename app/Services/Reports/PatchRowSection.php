<?php

namespace App\Services\Reports;

use App\Models\ReportYear;

/**
 * Applies a sparse patch to any multi-row report section described by
 * {@see RowSection}.
 */
final class PatchRowSection
{
    public function __construct(private SparseRowPatcher $patcher) {}

    /**
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, string $section, array $patches): void
    {
        $config = RowSection::config($section);

        $this->patcher->apply(
            $config['model'],
            $patches,
            function (array $patch) use ($reportYear, $config): ?array {
                if (! array_key_exists($config['patchKey'], $patch)) {
                    return null;
                }

                return [
                    'identity' => [
                        'report_year_id' => $reportYear->id,
                        $config['identity'] => $patch[$config['patchKey']],
                    ],
                    'attributes' => array_intersect_key($patch, array_flip($config['valueFields'])),
                ];
            },
        );
    }
}
