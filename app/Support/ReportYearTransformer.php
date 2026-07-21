<?php

namespace App\Support;

use App\Models\FundingProgram;
use App\Models\ProgramFundingSummary;
use App\Models\ReportYear;
use Illuminate\Support\Collection;

class ReportYearTransformer
{
    /**
     * Lightweight payload for homepage year cards (no reportData).
     *
     * @return array<string, mixed>
     */
    public function toCardArray(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'href' => route('reports.show', $reportYear),
            'description' => $reportYear->description,
        ];
    }

    /**
     * Minimal payload for the public report detail Inertia page.
     *
     * @return array<string, mixed>
     */
    public function toPublicDetailArray(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'reportData' => $this->transformReportData($reportYear),
        ];
    }

    /**
     * Full payload for PDF generation and other internal consumers.
     *
     * @return array<string, mixed>
     */
    public function toDetailArray(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'title' => (string) $reportYear->title,
            'href' => route('reports.show', $reportYear),
            'description' => $reportYear->description,
            'status' => $reportYear->status,
            'reportData' => $this->transformReportData($reportYear),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function transformReportData(ReportYear $reportYear): ?array
    {
        if ($reportYear->status === ReportYear::STATUS_PENDING) {
            return null;
        }

        $setupFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'setup');
        $cestFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'cest');
        $setupFundingSummary = $this->sumFundingBreakdown($setupFundingBreakdown);
        $cestFundingSummary = $this->sumFundingBreakdown($cestFundingBreakdown);

        return [
            'gfpsMembership' => [
                'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
            ],
            'gfpsAssemblies' => $this->transformGfpsAssemblyAttendances($reportYear),
            'employeeStatuses' => $this->transformEmployeeStatusBreakdowns($reportYear),
            'scholarship' => [
                'id' => $reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->id,
                'schoolYearLabel' => (string) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->schoolYear?->name ?? ''),
                'asOfDate' => $reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->as_of_date?->toDateString(),
                'femaleCount' => (int) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->female_count ?? 0),
                'maleCount' => (int) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->male_count ?? 0),
            ],
            'scholarshipHistory' => $reportYear->scholarshipSnapshots
                ->sortByDesc('as_of_date')
                ->values()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'schoolYearLabel' => (string) ($s->schoolYear?->name ?? ''),
                    'asOfDate' => $s->as_of_date?->toDateString(),
                    'femaleCount' => (int) $s->female_count,
                    'maleCount' => (int) $s->male_count,
                ])
                ->all(),
            'rstlMonthly' => $this->transformRstlMonthlyBreakdowns($reportYear),
            'setupFunding' => $setupFundingSummary,
            'cestFunding' => $cestFundingSummary,
            'setupFundingBreakdown' => $setupFundingBreakdown,
            'cestFundingBreakdown' => $cestFundingBreakdown,
        ];
    }

    /**
     * @return array<int, array{label: string, female: int, male: int}>
     */
    private function transformGfpsAssemblyAttendances(ReportYear $reportYear): array
    {
        return $reportYear->gfpsAssemblyAttendances
            ->sortBy(fn ($attendance) => $attendance->gfpsAssemblyPeriod?->sort_order)
            ->map(fn ($attendance): array => [
                'label' => (string) $attendance->gfpsAssemblyPeriod?->name,
                'female' => (int) $attendance->female_count,
                'male' => (int) $attendance->male_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, female: int, male: int}>
     */
    private function transformEmployeeStatusBreakdowns(ReportYear $reportYear): array
    {
        return $reportYear->employeeStatusBreakdowns
            ->sortBy(fn ($breakdown) => $breakdown->employmentStatus?->sort_order)
            ->map(fn ($breakdown): array => [
                'label' => (string) $breakdown->employmentStatus?->name,
                'female' => (int) $breakdown->female_count,
                'male' => (int) $breakdown->male_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, female: int, femaleLed: int, male: int, maleLed: int}>
     */
    private function transformRstlMonthlyBreakdowns(ReportYear $reportYear): array
    {
        return $reportYear->rstlMonthlyBreakdowns
            ->sortBy(fn ($breakdown) => $breakdown->reportMonth?->month_number)
            ->map(fn ($breakdown): array => [
                'label' => (string) $breakdown->reportMonth?->name,
                'female' => (int) $breakdown->female_count,
                'femaleLed' => (int) $breakdown->female_led_count,
                'male' => (int) $breakdown->male_count,
                'maleLed' => (int) $breakdown->male_led_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, slug: string, maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float}>
     */
    private function transformFundingBreakdown(ReportYear $reportYear, string $prefix): array
    {
        /** @var Collection<int, ProgramFundingSummary> $fundingSummaries */
        $fundingSummaries = $reportYear->programFundingSummaries->keyBy('funding_program_id');

        return FundingProgram::query()
            ->where(function ($query) use ($prefix): void {
                $query
                    ->where('slug', $prefix)
                    ->orWhere('slug', 'like', $prefix.'-%');
            })
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug'])
            ->map(function (FundingProgram $program) use ($fundingSummaries): array {
                /** @var ProgramFundingSummary|null $summary */
                $summary = $fundingSummaries->get($program->id);

                return [
                    'label' => (string) $program->name,
                    'slug' => (string) $program->slug,
                    'maleProjects' => (int) ($summary?->male_projects ?? 0),
                    'maleAmount' => (float) ($summary?->male_amount ?? 0),
                    'femaleProjects' => (int) ($summary?->female_projects ?? 0),
                    'femaleAmount' => (float) ($summary?->female_amount ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array{label: string, slug: string, maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float}>  $rows
     * @return array{maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float}
     */
    private function sumFundingBreakdown(array $rows): array
    {
        return array_reduce($rows, function (array $carry, array $row): array {
            $carry['maleProjects'] += $row['maleProjects'];
            $carry['maleAmount'] += $row['maleAmount'];
            $carry['femaleProjects'] += $row['femaleProjects'];
            $carry['femaleAmount'] += $row['femaleAmount'];

            return $carry;
        }, [
            'maleProjects' => 0,
            'maleAmount' => 0.0,
            'femaleProjects' => 0,
            'femaleAmount' => 0.0,
        ]);
    }
}
