<?php

namespace App\Services\Reports;

use App\Models\ReportYear;
use Illuminate\Support\Facades\DB;

/**
 * Applies a sparse patch to any multi-row report section described by
 * {@see RowSection}.
 */
final class PatchRowSection
{
    /**
     * Rows without their identifying key, or with no value fields left after
     * filtering, are skipped rather than written as empty records.
     *
     * @param  array<int, array<string, mixed>>  $patches
     */
    public function apply(ReportYear $reportYear, string $section, array $patches): void
    {
        $config = RowSection::config($section);

        DB::transaction(function () use ($reportYear, $config, $patches): void {
            foreach ($patches as $patch) {
                if (! array_key_exists($config['patchKey'], $patch)) {
                    continue;
                }

                $attributes = array_intersect_key($patch, array_flip($config['valueFields']));

                if ($attributes === []) {
                    continue;
                }

                $config['model']::query()->updateOrCreate(
                    [
                        'report_year_id' => $reportYear->id,
                        $config['identity'] => $patch[$config['patchKey']],
                    ],
                    $attributes,
                );
            }
        });
    }
}
