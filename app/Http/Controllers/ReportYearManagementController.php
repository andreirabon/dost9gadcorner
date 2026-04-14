<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportYearRequest;
use App\Http\Requests\UpdateEmployeeStatusBreakdownsRequest;
use App\Http\Requests\UpdateGfpsAssemblyAttendancesRequest;
use App\Http\Requests\UpdateGfpsMembershipSummaryRequest;
use App\Http\Requests\UpdateProgramFundingSummariesRequest;
use App\Http\Requests\UpdateReportYearRequest;
use App\Http\Requests\UpdateRstlMonthlyBreakdownsRequest;
use App\Http\Requests\UpdateScholarshipSummaryRequest;
use App\Models\EmployeeStatusBreakdown;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyAttendance;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\RstlMonthlyBreakdown;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportYearManagementController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ReportYear::class);

        return Inertia::render('reports/Index', [
            'reportYears' => ReportYear::query()
                ->orderByDesc('year')
                ->get()
                ->map(fn (ReportYear $reportYear): array => [
                    'id' => $reportYear->id,
                    'year' => $reportYear->year,
                    'title' => $reportYear->title,
                    'description' => $reportYear->description,
                    'status' => $reportYear->status,
                    'colorTheme' => $reportYear->color_theme,
                    'publishedAt' => $reportYear->published_at?->toDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ReportYear::class);

        return Inertia::render('reports/Create');
    }

    public function store(StoreReportYearRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['published_at'] = $validated['status'] === ReportYear::STATUS_PUBLISHED ? now() : null;

        $reportYear = ReportYear::query()->create($validated);

        return to_route('report-years.edit', $reportYear);
    }

    public function edit(ReportYear $reportYear): Response
    {
        $this->authorize('view', $reportYear);

        $reportYear->load([
            'gfpsMembershipSummary',
            'gfpsAssemblyAttendances',
            'employeeStatusBreakdowns',
            'scholarshipSummary',
            'rstlMonthlyBreakdowns',
            'programFundingSummaries',
        ]);

        return Inertia::render('reports/Edit', [
            'reportYear' => [
                'id' => $reportYear->id,
                'year' => $reportYear->year,
                'title' => $reportYear->title,
                'description' => $reportYear->description,
                'status' => $reportYear->status,
                'colorTheme' => $reportYear->color_theme,
                'publishedAt' => $reportYear->published_at?->toDateString(),
                'gfpsMembership' => [
                    'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                    'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
                ],
                'gfpsAssemblies' => $this->editableGfpsAssemblyRows($reportYear),
                'employeeStatuses' => $this->editableEmployeeStatusRows($reportYear),
                'scholarship' => [
                    'schoolYearLabel' => (string) ($reportYear->scholarshipSummary?->school_year_label ?? ''),
                    'asOfDate' => $reportYear->scholarshipSummary?->as_of_date?->toDateString(),
                    'femaleCount' => (int) ($reportYear->scholarshipSummary?->female_count ?? 0),
                    'maleCount' => (int) ($reportYear->scholarshipSummary?->male_count ?? 0),
                ],
                'rstlMonthly' => $this->editableRstlMonthlyRows($reportYear),
                'programFunding' => $this->editableProgramFundingRows($reportYear),
            ],
        ]);
    }

    public function update(UpdateReportYearRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $validated = $request->validated();
        $validated['published_at'] = $validated['status'] === ReportYear::STATUS_PUBLISHED
            ? ($reportYear->published_at ?? now())
            : null;

        $reportYear->update($validated);

        return back();
    }

    public function updateGfpsMembership(UpdateGfpsMembershipSummaryRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $reportYear->gfpsMembershipSummary()->updateOrCreate(
            ['report_year_id' => $reportYear->id],
            [
                'female_count' => $request->integer('female_count'),
                'male_count' => $request->integer('male_count'),
            ],
        );

        return back();
    }

    public function updateGfpsAssemblies(UpdateGfpsAssemblyAttendancesRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $attendances = collect($request->validated('attendances'));

        DB::transaction(function () use ($attendances, $reportYear): void {
            $periodIds = $attendances->pluck('period_id');

            $reportYear->gfpsAssemblyAttendances()
                ->whereNotIn('gfps_assembly_period_id', $periodIds)
                ->delete();

            GfpsAssemblyAttendance::query()->upsert(
                $attendances
                    ->map(fn (array $attendance): array => [
                        'report_year_id' => $reportYear->id,
                        'gfps_assembly_period_id' => $attendance['period_id'],
                        'female_count' => $attendance['female_count'],
                        'male_count' => $attendance['male_count'],
                    ])
                    ->all(),
                ['report_year_id', 'gfps_assembly_period_id'],
                ['female_count', 'male_count'],
            );
        });

        return back();
    }

    public function updateEmployeeStatuses(UpdateEmployeeStatusBreakdownsRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $breakdowns = collect($request->validated('breakdowns'));

        DB::transaction(function () use ($breakdowns, $reportYear): void {
            $statusIds = $breakdowns->pluck('employment_status_id');

            $reportYear->employeeStatusBreakdowns()
                ->whereNotIn('employment_status_id', $statusIds)
                ->delete();

            EmployeeStatusBreakdown::query()->upsert(
                $breakdowns
                    ->map(fn (array $breakdown): array => [
                        'report_year_id' => $reportYear->id,
                        'employment_status_id' => $breakdown['employment_status_id'],
                        'female_count' => $breakdown['female_count'],
                        'male_count' => $breakdown['male_count'],
                    ])
                    ->all(),
                ['report_year_id', 'employment_status_id'],
                ['female_count', 'male_count'],
            );
        });

        return back();
    }

    public function updateScholarship(UpdateScholarshipSummaryRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $reportYear->scholarshipSummary()->updateOrCreate(
            ['report_year_id' => $reportYear->id],
            $request->validated(),
        );

        return back();
    }

    public function updateRstlMonthly(UpdateRstlMonthlyBreakdownsRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $breakdowns = collect($request->validated('breakdowns'));

        DB::transaction(function () use ($breakdowns, $reportYear): void {
            $monthIds = $breakdowns->pluck('report_month_id');

            $reportYear->rstlMonthlyBreakdowns()
                ->whereNotIn('report_month_id', $monthIds)
                ->delete();

            RstlMonthlyBreakdown::query()->upsert(
                $breakdowns
                    ->map(fn (array $breakdown): array => [
                        'report_year_id' => $reportYear->id,
                        'report_month_id' => $breakdown['report_month_id'],
                        'female_count' => $breakdown['female_count'],
                        'female_led_count' => $breakdown['female_led_count'],
                        'male_count' => $breakdown['male_count'],
                        'male_led_count' => $breakdown['male_led_count'],
                    ])
                    ->all(),
                ['report_year_id', 'report_month_id'],
                ['female_count', 'female_led_count', 'male_count', 'male_led_count'],
            );
        });

        return back();
    }

    public function updateProgramFunding(UpdateProgramFundingSummariesRequest $request, ReportYear $reportYear): RedirectResponse
    {
        $summaries = collect($request->validated('summaries'));

        DB::transaction(function () use ($reportYear, $summaries): void {
            $programIds = $summaries->pluck('funding_program_id');

            $reportYear->programFundingSummaries()
                ->whereNotIn('funding_program_id', $programIds)
                ->delete();

            ProgramFundingSummary::query()->upsert(
                $summaries
                    ->map(fn (array $summary): array => [
                        'report_year_id' => $reportYear->id,
                        'funding_program_id' => $summary['funding_program_id'],
                        'female_projects' => $summary['female_projects'],
                        'female_amount' => $summary['female_amount'],
                        'male_projects' => $summary['male_projects'],
                        'male_amount' => $summary['male_amount'],
                    ])
                    ->all(),
                ['report_year_id', 'funding_program_id'],
                ['female_projects', 'female_amount', 'male_projects', 'male_amount'],
            );
        });

        return back();
    }

    /**
     * @return array<int, array{periodId: int, label: string, femaleCount: int, maleCount: int}>
     */
    private function editableGfpsAssemblyRows(ReportYear $reportYear): array
    {
        $existing = $reportYear->gfpsAssemblyAttendances->keyBy('gfps_assembly_period_id');

        return GfpsAssemblyPeriod::query()
            ->orderBy('sort_order')
            ->get()
            ->map(function (GfpsAssemblyPeriod $period) use ($existing): array {
                $attendance = $existing->get($period->id);

                return [
                    'periodId' => $period->id,
                    'label' => $period->name,
                    'femaleCount' => (int) ($attendance?->female_count ?? 0),
                    'maleCount' => (int) ($attendance?->male_count ?? 0),
                ];
            })
            ->all();
    }

    /**
     * @return array<int, array{employmentStatusId: int, label: string, femaleCount: int, maleCount: int}>
     */
    private function editableEmployeeStatusRows(ReportYear $reportYear): array
    {
        $existing = $reportYear->employeeStatusBreakdowns->keyBy('employment_status_id');

        return EmploymentStatus::query()
            ->orderBy('sort_order')
            ->get()
            ->map(function (EmploymentStatus $status) use ($existing): array {
                $breakdown = $existing->get($status->id);

                return [
                    'employmentStatusId' => $status->id,
                    'label' => $status->name,
                    'femaleCount' => (int) ($breakdown?->female_count ?? 0),
                    'maleCount' => (int) ($breakdown?->male_count ?? 0),
                ];
            })
            ->all();
    }

    /**
     * @return array<int, array{reportMonthId: int, label: string, femaleCount: int, femaleLedCount: int, maleCount: int, maleLedCount: int}>
     */
    private function editableRstlMonthlyRows(ReportYear $reportYear): array
    {
        $existing = $reportYear->rstlMonthlyBreakdowns->keyBy('report_month_id');

        return ReportMonth::query()
            ->orderBy('month_number')
            ->get()
            ->map(function (ReportMonth $month) use ($existing): array {
                $breakdown = $existing->get($month->id);

                return [
                    'reportMonthId' => $month->id,
                    'label' => $month->short_name,
                    'femaleCount' => (int) ($breakdown?->female_count ?? 0),
                    'femaleLedCount' => (int) ($breakdown?->female_led_count ?? 0),
                    'maleCount' => (int) ($breakdown?->male_count ?? 0),
                    'maleLedCount' => (int) ($breakdown?->male_led_count ?? 0),
                ];
            })
            ->all();
    }

    /**
     * @return array<int, array{fundingProgramId: int, label: string, slug: string, femaleProjects: int, femaleAmount: float, maleProjects: int, maleAmount: float}>
     */
    private function editableProgramFundingRows(ReportYear $reportYear): array
    {
        /** @var Collection<int, ProgramFundingSummary> $existing */
        $existing = $reportYear->programFundingSummaries->keyBy('funding_program_id');

        return FundingProgram::query()
            ->orderBy('sort_order')
            ->get()
            ->map(function (FundingProgram $program) use ($existing): array {
                $summary = $existing->get($program->id);

                return [
                    'fundingProgramId' => $program->id,
                    'label' => $program->name,
                    'slug' => $program->slug,
                    'femaleProjects' => (int) ($summary?->female_projects ?? 0),
                    'femaleAmount' => (float) ($summary?->female_amount ?? 0),
                    'maleProjects' => (int) ($summary?->male_projects ?? 0),
                    'maleAmount' => (float) ($summary?->male_amount ?? 0),
                ];
            })
            ->all();
    }
}
