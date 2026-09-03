<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Special projects research is a provincial figure, not a SETUP/CEST/GIA
 * program metric, so it stops being recorded three times per province.
 *
 * Four `research-*` funding programs give it one row per province, reusing the
 * program-funding summary table and endpoint rather than a parallel table of
 * its own. The figures already recorded against the SETUP, CEST and GIA rows
 * are summed into the new provincial row; the source columns are left intact
 * (nothing reads them any more) so this migration reverses cleanly.
 */
return new class extends Migration
{
    /** Province suffix => display name, in the order they appear on the tab. */
    private const PROVINCES = [
        'zc-ic' => 'ZC/IC',
        'zsp' => 'ZSP',
        'zds' => 'ZDS',
        'zdn' => 'ZDN',
    ];

    private const FAMILIES = ['setup', 'cest', 'gia'];

    private const FIRST_SORT_ORDER = 13;

    public function up(): void
    {
        $now = now();
        $rows = [];
        $sortOrder = self::FIRST_SORT_ORDER;

        foreach (self::PROVINCES as $suffix => $label) {
            $rows[] = [
                'name' => "Special Projects Research {$label}",
                'slug' => "research-{$suffix}",
                'sort_order' => $sortOrder++,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('funding_programs')->upsert($rows, ['slug'], ['name', 'sort_order', 'updated_at']);

        $this->backfillProvincialTotals();
    }

    public function down(): void
    {
        $slugs = array_map(static fn (string $suffix): string => "research-{$suffix}", array_keys(self::PROVINCES));

        // Summaries cascade with the program rows. The per-family columns this
        // migration read were never cleared, so everything recorded before the
        // migration survives a rollback — but research entered afterwards lives
        // only on these rows and goes with them.
        DB::table('funding_programs')->whereIn('slug', $slugs)->delete();
    }

    /**
     * Fold each province's three family rows into its new provincial row.
     */
    private function backfillProvincialTotals(): void
    {
        $now = now();

        /** @var array<string, int> $programIds */
        $programIds = DB::table('funding_programs')->pluck('id', 'slug')->all();

        foreach (self::PROVINCES as $suffix => $label) {
            $researchProgramId = $programIds["research-{$suffix}"] ?? null;

            if ($researchProgramId === null) {
                continue;
            }

            $sourceIds = array_values(array_filter(array_map(
                static fn (string $family): ?int => $programIds["{$family}-{$suffix}"] ?? null,
                self::FAMILIES,
            )));

            if ($sourceIds === []) {
                continue;
            }

            $totals = DB::table('program_funding_summaries')
                ->selectRaw('report_year_id, SUM(special_projects_research_male) AS male, SUM(special_projects_research_female) AS female')
                ->whereIn('funding_program_id', $sourceIds)
                ->groupBy('report_year_id')
                ->havingRaw('SUM(special_projects_research_male) + SUM(special_projects_research_female) > 0')
                ->get();

            foreach ($totals as $total) {
                DB::table('program_funding_summaries')->upsert(
                    [[
                        'report_year_id' => (int) $total->report_year_id,
                        'funding_program_id' => $researchProgramId,
                        'special_projects_research_male' => (int) $total->male,
                        'special_projects_research_female' => (int) $total->female,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]],
                    ['report_year_id', 'funding_program_id'],
                    ['special_projects_research_male', 'special_projects_research_female', 'updated_at'],
                );
            }
        }
    }
};
