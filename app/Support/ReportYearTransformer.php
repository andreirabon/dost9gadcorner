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
            'status' => $reportYear->status,
        ];
    }

    /**
     * Full payload for the public report detail page.
     *
     * @return array<string, mixed>
     */
    public function toDetailArray(ReportYear $reportYear): array
    {
        $setupFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'setup');
        $cestFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'cest');
        $setupFundingSummary = $this->sumFundingBreakdown($setupFundingBreakdown);
        $cestFundingSummary = $this->sumFundingBreakdown($cestFundingBreakdown);

        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'href' => route('reports.show', $reportYear),
            'description' => $reportYear->description,
            'status' => $reportYear->status,
            'reportData' => $reportYear->status === ReportYear::STATUS_PENDING
                ? null
                : [
                    'gfpsMembership' => [
                        'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                        'nonBinaryCount' => (int) ($reportYear->gfpsMembershipSummary?->non_binary_count ?? 0),
                        'genderqueerCount' => (int) ($reportYear->gfpsMembershipSummary?->genderqueer_count ?? 0),
                        'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
                    ],
                    'gfpsAssemblies' => $this->transformGfpsAssemblyAttendances($reportYear),
                    'employeeStatuses' => $this->transformEmployeeStatusBreakdowns($reportYear),
                    'scholarship' => [
                        'schoolYearLabel' => (string) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->schoolYear?->name ?? ''),
                        'asOfDate' => $reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->as_of_date?->toDateString(),
                        'femaleCount' => (int) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->female_count ?? 0),
                        'nonBinaryCount' => (int) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->non_binary_count ?? 0),
                        'genderqueerCount' => (int) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->genderqueer_count ?? 0),
                        'maleCount' => (int) ($reportYear->scholarshipSnapshots->sortByDesc('as_of_date')->first()?->male_count ?? 0),
                    ],
                    'scholarshipHistory' => $reportYear->scholarshipSnapshots
                        ->sortByDesc('as_of_date')
                        ->values()
                        ->map(fn ($s) => [
                            'schoolYearLabel' => (string) ($s->schoolYear?->name ?? ''),
                            'asOfDate' => $s->as_of_date?->toDateString(),
                            'femaleCount' => (int) $s->female_count,
                            'nonBinaryCount' => (int) $s->non_binary_count,
                            'genderqueerCount' => (int) $s->genderqueer_count,
                            'maleCount' => (int) $s->male_count,
                        ])
                        ->all(),
                    'rstlMonthly' => $this->transformRstlMonthlyBreakdowns($reportYear),
                    'setupFunding' => $setupFundingSummary,
                    'cestFunding' => $cestFundingSummary,
                    'setupFundingBreakdown' => $setupFundingBreakdown,
                    'cestFundingBreakdown' => $cestFundingBreakdown,
                ],
        ];
    }

    /**
     * @return array<int, array{label: string, female: int, nonBinary: int, genderqueer: int, male: int}>
     */
    private function transformGfpsAssemblyAttendances(ReportYear $reportYear): array
    {
        return $reportYear->gfpsAssemblyAttendances
            ->sortBy(fn ($attendance) => $attendance->gfpsAssemblyPeriod?->sort_order)
            ->map(fn ($attendance): array => [
                'label' => (string) $attendance->gfpsAssemblyPeriod?->name,
                'female' => (int) $attendance->female_count,
                'nonBinary' => (int) $attendance->non_binary_count,
                'genderqueer' => (int) $attendance->genderqueer_count,
                'male' => (int) $attendance->male_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, female: int, nonBinary: int, genderqueer: int, male: int}>
     */
    private function transformEmployeeStatusBreakdowns(ReportYear $reportYear): array
    {
        return $reportYear->employeeStatusBreakdowns
            ->sortBy(fn ($breakdown) => $breakdown->employmentStatus?->sort_order)
            ->map(fn ($breakdown): array => [
                'label' => (string) $breakdown->employmentStatus?->name,
                'female' => (int) $breakdown->female_count,
                'nonBinary' => (int) $breakdown->non_binary_count,
                'genderqueer' => (int) $breakdown->genderqueer_count,
                'male' => (int) $breakdown->male_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, female: int, femaleLed: int, nonBinary: int, genderqueer: int, nonBinaryLed: int, genderqueerLed: int, male: int, maleLed: int}>
     */
    private function transformRstlMonthlyBreakdowns(ReportYear $reportYear): array
    {
        return $reportYear->rstlMonthlyBreakdowns
            ->sortBy(fn ($breakdown) => $breakdown->reportMonth?->month_number)
            ->map(fn ($breakdown): array => [
                'label' => (string) $breakdown->reportMonth?->name,
                'female' => (int) $breakdown->female_count,
                'femaleLed' => (int) $breakdown->female_led_count,
                'nonBinary' => (int) $breakdown->non_binary_count,
                'genderqueer' => (int) $breakdown->genderqueer_count,
                'nonBinaryLed' => (int) $breakdown->non_binary_led_count,
                'genderqueerLed' => (int) $breakdown->genderqueer_led_count,
                'male' => (int) $breakdown->male_count,
                'maleLed' => (int) $breakdown->male_led_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, slug: string, maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float, nonBinaryProjects: int, nonBinaryAmount: float, genderqueerProjects: int, genderqueerAmount: float}>
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
                    'nonBinaryProjects' => (int) ($summary?->non_binary_projects ?? 0),
                    'nonBinaryAmount' => (float) ($summary?->non_binary_amount ?? 0),
                    'genderqueerProjects' => (int) ($summary?->genderqueer_projects ?? 0),
                    'genderqueerAmount' => (float) ($summary?->genderqueer_amount ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array{label: string, slug: string, maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float, nonBinaryProjects: int, nonBinaryAmount: float, genderqueerProjects: int, genderqueerAmount: float}>  $rows
     * @return array{maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float, nonBinaryProjects: int, nonBinaryAmount: float, genderqueerProjects: int, genderqueerAmount: float}
     */
    private function sumFundingBreakdown(array $rows): array
    {
        return array_reduce($rows, function (array $carry, array $row): array {
            $carry['maleProjects'] += $row['maleProjects'];
            $carry['maleAmount'] += $row['maleAmount'];
            $carry['femaleProjects'] += $row['femaleProjects'];
            $carry['femaleAmount'] += $row['femaleAmount'];
            $carry['nonBinaryProjects'] += $row['nonBinaryProjects'];
            $carry['nonBinaryAmount'] += $row['nonBinaryAmount'];
            $carry['genderqueerProjects'] += $row['genderqueerProjects'];
            $carry['genderqueerAmount'] += $row['genderqueerAmount'];

            return $carry;
        }, [
            'maleProjects' => 0,
            'maleAmount' => 0.0,
            'femaleProjects' => 0,
            'femaleAmount' => 0.0,
            'nonBinaryProjects' => 0,
            'nonBinaryAmount' => 0.0,
            'genderqueerProjects' => 0,
            'genderqueerAmount' => 0.0,
        ]);
    }
}
