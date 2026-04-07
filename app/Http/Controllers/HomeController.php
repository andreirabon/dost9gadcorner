<?php

namespace App\Http\Controllers;

use App\Models\ProgramFundingSummary;
use App\Models\ReportYear;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $reportYears = ReportYear::query()
            ->with([
                'gfpsMembershipSummary',
                'gfpsAssemblyAttendances.gfpsAssemblyPeriod',
                'employeeStatusBreakdowns.employmentStatus',
                'scholarshipSummary',
                'rstlMonthlyBreakdowns.reportMonth',
                'programFundingSummaries.fundingProgram',
            ])
            ->orderByDesc('year')
            ->get();

        return Inertia::render('Index', [
            'years' => $reportYears->map(fn (ReportYear $reportYear): array => $this->transformReportYear($reportYear)),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformReportYear(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'href' => '#',
            'colorTheme' => $reportYear->color_theme ?? 'violet',
            'description' => $reportYear->description,
            'backgroundImage' => $reportYear->background_image,
            'status' => $reportYear->status,
            'reportData' => $reportYear->status === ReportYear::STATUS_PENDING
                ? null
                : [
                    'gfpsMembership' => [
                        'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                        'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
                    ],
                    'gfpsAssemblies' => $this->transformGfpsAssemblyAttendances($reportYear),
                    'employeeStatuses' => $this->transformEmployeeStatusBreakdowns($reportYear),
                    'scholarship' => [
                        'schoolYearLabel' => (string) ($reportYear->scholarshipSummary?->school_year_label ?? ''),
                        'asOfDate' => $reportYear->scholarshipSummary?->as_of_date?->toDateString(),
                        'femaleCount' => (int) ($reportYear->scholarshipSummary?->female_count ?? 0),
                        'maleCount' => (int) ($reportYear->scholarshipSummary?->male_count ?? 0),
                    ],
                    'rstlMonthly' => $this->transformRstlMonthlyBreakdowns($reportYear),
                    'setupFunding' => $this->transformFundingSummary($reportYear, 'setup'),
                    'cestFunding' => $this->transformFundingSummary($reportYear, 'cest'),
                ],
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
                'label' => (string) $breakdown->reportMonth?->short_name,
                'female' => (int) $breakdown->female_count,
                'femaleLed' => (int) $breakdown->female_led_count,
                'male' => (int) $breakdown->male_count,
                'maleLed' => (int) $breakdown->male_led_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float}
     */
    private function transformFundingSummary(ReportYear $reportYear, string $slug): array
    {
        /** @var Collection<int, ProgramFundingSummary> $fundingSummaries */
        $fundingSummaries = $reportYear->programFundingSummaries;

        $summary = $fundingSummaries->first(fn (ProgramFundingSummary $item): bool => $item->fundingProgram?->slug === $slug);

        return [
            'maleProjects' => (int) ($summary?->male_projects ?? 0),
            'maleAmount' => (float) ($summary?->male_amount ?? 0),
            'femaleProjects' => (int) ($summary?->female_projects ?? 0),
            'femaleAmount' => (float) ($summary?->female_amount ?? 0),
        ];
    }
}
