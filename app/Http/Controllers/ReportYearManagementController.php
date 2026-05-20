<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportYearRequest;
use App\Http\Requests\UpdateEmployeeStatusBreakdownsRequest;
use App\Http\Requests\UpdateGfpsAssemblyAttendancesRequest;
use App\Http\Requests\UpdateGfpsMembershipSummaryRequest;
use App\Http\Requests\UpdateProgramFundingSummariesRequest;
use App\Http\Requests\UpdateReportYearMetadataRequest;
use App\Http\Requests\UpdateReportYearRequest;
use App\Http\Requests\UpdateRstlMonthlyBreakdownsRequest;
use App\Http\Requests\UpdateScholarshipSummaryRequest;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\SchoolYear;
use App\Services\Reports\PatchEmployeeStatusBreakdowns;
use App\Services\Reports\PatchGfpsAssemblyAttendances;
use App\Services\Reports\PatchGfpsMembershipSummary;
use App\Services\Reports\PatchProgramFundingSummaries;
use App\Services\Reports\PatchReportYearAttributes;
use App\Services\Reports\PatchRstlMonthlyBreakdowns;
use App\Services\Reports\PatchScholarshipSummary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
                    'publishedAt' => $reportYear->published_at?->toIso8601String(),
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

    public function edit(Request $request, ReportYear $reportYear): Response
    {
        $this->authorize('view', $reportYear);
        $user = $request->user();

        $reportYear->load([
            'gfpsMembershipSummary',
            'gfpsAssemblyAttendances',
            'employeeStatusBreakdowns',
            'scholarshipSummary',
            'rstlMonthlyBreakdowns',
            'programFundingSummaries',
        ]);

        $abilities = [
            'updateFullReport' => $user->can('update', $reportYear),
            'updateMetadata' => $user->can('updateMetadata', $reportYear),
            'updateGfpsMembership' => $user->can('updateGfpsMembership', $reportYear),
            'updateGfpsAssemblies' => $user->can('updateGfpsAssemblies', $reportYear),
            'updateScholarship' => $user->can('updateScholarship', $reportYear),
            'updateEmployeeStatuses' => $user->can('updateEmployeeStatuses', $reportYear),
            'updateRstlMonthly' => $user->can('updateRstlMonthly', $reportYear),
            'updateProgramFunding' => $user->can('updateProgramFunding', $reportYear),
        ];

        return Inertia::render('reports/Edit', [
            'abilities' => $abilities,
            'schoolYears' => SchoolYear::query()->orderBy('sort_order')->get()->map(fn (SchoolYear $sy) => [
                'id' => $sy->id,
                'label' => $sy->name,
            ]),
            'reportYear' => [
                'id' => $reportYear->id,
                'year' => $reportYear->year,
                'title' => $reportYear->title,
                'description' => $reportYear->description,
                'status' => $reportYear->status,
                'publishedAt' => $reportYear->published_at?->toIso8601String(),
                'coverImageUrl' => null,
                'gfpsMembership' => [
                    'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                    'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
                ],
                'gfpsAssemblies' => $this->editableGfpsAssemblyRows($reportYear),
                'employeeStatuses' => $this->editableEmployeeStatusRows($reportYear),
                'scholarship' => [
                    'schoolYearId' => $reportYear->scholarshipSummary?->school_year_id,
                    'asOfDate' => $reportYear->scholarshipSummary?->as_of_date?->toDateString(),
                    'femaleCount' => (int) ($reportYear->scholarshipSummary?->female_count ?? 0),
                    'maleCount' => (int) ($reportYear->scholarshipSummary?->male_count ?? 0),
                ],
                'rstlMonthly' => $this->editableRstlMonthlyRows($reportYear),
                'programFunding' => $this->editableProgramFundingRows($reportYear),
            ],
        ]);
    }

    public function update(UpdateReportYearRequest $request, ReportYear $reportYear, PatchReportYearAttributes $patchReportYear): RedirectResponse
    {
        $patchReportYear->apply($reportYear, $request->validated(), ['year', 'title', 'description', 'status']);

        return back();
    }

    public function updateMetadata(UpdateReportYearMetadataRequest $request, ReportYear $reportYear, PatchReportYearAttributes $patchReportYear): RedirectResponse
    {
        $patchReportYear->apply($reportYear, $request->validated(), ['year', 'title', 'description']);

        return back();
    }

    public function destroy(ReportYear $reportYear): RedirectResponse
    {
        $this->authorize('delete', $reportYear);

        $reportYear->delete();

        return to_route('report-years.index');
    }

    public function updateGfpsMembership(UpdateGfpsMembershipSummaryRequest $request, ReportYear $reportYear, PatchGfpsMembershipSummary $patchGfpsMembership): RedirectResponse
    {
        $patchGfpsMembership->apply($reportYear, $request->validated());

        return back();
    }

    public function updateGfpsAssemblies(UpdateGfpsAssemblyAttendancesRequest $request, ReportYear $reportYear, PatchGfpsAssemblyAttendances $patchGfpsAssemblies): RedirectResponse
    {
        $patchGfpsAssemblies->apply($reportYear, $request->validated('attendances'));

        return back();
    }

    public function updateEmployeeStatuses(UpdateEmployeeStatusBreakdownsRequest $request, ReportYear $reportYear, PatchEmployeeStatusBreakdowns $patchEmployeeStatuses): RedirectResponse
    {
        $patchEmployeeStatuses->apply($reportYear, $request->validated('breakdowns'));

        return back();
    }

    public function updateScholarship(UpdateScholarshipSummaryRequest $request, ReportYear $reportYear, PatchScholarshipSummary $patchScholarship): RedirectResponse
    {
        $patchScholarship->apply($reportYear, $request->validated());

        return back();
    }

    public function updateRstlMonthly(UpdateRstlMonthlyBreakdownsRequest $request, ReportYear $reportYear, PatchRstlMonthlyBreakdowns $patchRstlMonthly): RedirectResponse
    {
        $patchRstlMonthly->apply($reportYear, $request->validated('breakdowns'));

        return back();
    }

    public function updateProgramFunding(UpdateProgramFundingSummariesRequest $request, ReportYear $reportYear, PatchProgramFundingSummaries $patchProgramFunding): RedirectResponse
    {
        $patchProgramFunding->apply($reportYear, $request->validated('summaries'));

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
                    'label' => $month->name,
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
                    'femaleAmount' => number_format((float) ($summary?->female_amount ?? 0), 2, '.', ''),
                    'maleProjects' => (int) ($summary?->male_projects ?? 0),
                    'maleAmount' => number_format((float) ($summary?->male_amount ?? 0), 2, '.', ''),
                ];
            })
            ->all();
    }
}
