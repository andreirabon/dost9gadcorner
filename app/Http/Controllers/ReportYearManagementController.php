<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportYearRequest;
use App\Http\Requests\StoreScholarshipSnapshotRequest;
use App\Http\Requests\UpdateEmployeeStatusBreakdownsRequest;
use App\Http\Requests\UpdateGfpsAssemblyAttendancesRequest;
use App\Http\Requests\UpdateGfpsMembershipSummaryRequest;
use App\Http\Requests\UpdateProgramFundingSummariesRequest;
use App\Http\Requests\UpdateReportYearMetadataRequest;
use App\Http\Requests\UpdateReportYearRequest;
use App\Http\Requests\UpdateRstlMonthlyBreakdownsRequest;
use App\Http\Requests\UpdateScholarshipSnapshotRequest;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\ScholarshipSummary;
use App\Models\SchoolYear;
use App\Services\Reports\ConflictGuard;
use App\Services\Reports\PatchEmployeeStatusBreakdowns;
use App\Services\Reports\PatchGfpsAssemblyAttendances;
use App\Services\Reports\PatchGfpsMembershipSummary;
use App\Services\Reports\PatchProgramFundingSummaries;
use App\Services\Reports\PatchReportYearAttributes;
use App\Services\Reports\PatchRstlMonthlyBreakdowns;
use App\Services\Reports\SparseRecordPatcher;
use App\Support\FundingProgramScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ReportYearManagementController extends Controller
{
    /**
     * Extract the expected_updated_at value from a request.
     *
     * Returns `false` when the field is absent (skip conflict check),
     * or `null`/string when explicitly provided.
     */
    private function expectedUpdatedAt(Request $request): string|false|null
    {
        return $request->has('expected_updated_at')
            ? $request->input('expected_updated_at')
            : false;
    }

    public function index(): Response
    {
        $this->authorize('viewAny', ReportYear::class);

        return Inertia::render('reports/Index', [
            'reportYears' => ReportYear::query()
                ->withCount([
                    'employeeStatusBreakdowns',
                    'gfpsAssemblyAttendances',
                    'gfpsMembershipSummary',
                    'programFundingSummaries',
                    'rstlMonthlyBreakdowns',
                    // Relation is ordered for "latest snapshot" reads; counting does not
                    // need that ordering, and MySQL will not sort a scalar subquery for free.
                    'scholarshipSnapshots' => fn (Builder $query) => $query->reorder(),
                ])
                ->orderByDesc('year')
                ->get()
                ->map(fn (ReportYear $reportYear): array => [
                    'id' => $reportYear->id,
                    'year' => $reportYear->year,
                    'title' => $reportYear->title,
                    'description' => $reportYear->description,
                    'status' => $reportYear->status,
                    'publishedAt' => $reportYear->published_at?->toIso8601String(),
                    'isLocked' => $reportYear->is_locked,
                    'sections' => [
                        'employees' => $reportYear->employee_status_breakdowns_count > 0,
                        'assembly' => $reportYear->gfps_assembly_attendances_count > 0,
                        'membership' => $reportYear->gfps_membership_summary_count > 0,
                        'funding' => $reportYear->program_funding_summaries_count > 0,
                        'rstl' => $reportYear->rstl_monthly_breakdowns_count > 0,
                        'scholarships' => $reportYear->scholarship_snapshots_count > 0,
                    ],
                ]),
            'canToggleLock' => request()->user()?->can('toggleLock', ReportYear::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', ReportYear::class);

        return Inertia::render('reports/Create', [
            'abilities' => [
                'publish' => $request->user()?->can('publish', ReportYear::class) ?? false,
            ],
        ]);
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
            'scholarshipSnapshots.schoolYear',
            'rstlMonthlyBreakdowns',
            'programFundingSummaries',
        ]);

        $abilities = [
            'updateFullReport' => $user->can('update', $reportYear),
            'updateMetadata' => $user->can('updateMetadata', $reportYear),
            'updateGfpsMembership' => $user->can('updateGfpsMembership', $reportYear),
            'updateGfpsAssemblies' => $user->can('updateGfpsAssemblies', $reportYear),
            'updateScholarship' => $user->can('updateScholarship', $reportYear),
            'deleteScholarship' => $user->can('deleteScholarship', $reportYear),
            'updateEmployeeStatuses' => $user->can('updateEmployeeStatuses', $reportYear),
            'updateRstlMonthly' => $user->can('updateRstlMonthly', $reportYear),
            'updateProgramFunding' => $user->can('updateProgramFunding', $reportYear),
            'toggleLock' => $user->can('toggleLock', $reportYear),
        ];

        return Inertia::render('reports/Edit', [
            'abilities' => $abilities,
            'schoolYears' => SchoolYear::query()->orderBy('sort_order')->get()->map(fn (SchoolYear $sy) => [
                'id' => $sy->id,
                'label' => $sy->name,
            ]),
            'sectionTimestamps' => [
                'metadata' => $reportYear->updated_at?->toIso8601String(),
                'gfpsMembership' => $reportYear->gfpsMembershipSummary?->updated_at?->toIso8601String(),
                'gfpsAssemblies' => $reportYear->gfpsAssemblyAttendances->max('updated_at')?->toIso8601String(),
                'employeeStatuses' => $reportYear->employeeStatusBreakdowns->max('updated_at')?->toIso8601String(),
                'scholarship' => $reportYear->scholarshipSnapshots->max('updated_at')?->toIso8601String(),
                'rstlMonthly' => $reportYear->rstlMonthlyBreakdowns->max('updated_at')?->toIso8601String(),
                'programFunding' => $reportYear->programFundingSummaries->max('updated_at')?->toIso8601String(),
            ],
            'reportYear' => [
                'id' => $reportYear->id,
                'year' => $reportYear->year,
                'title' => $reportYear->title,
                'description' => $reportYear->description,
                'status' => $reportYear->status,
                'publishedAt' => $reportYear->published_at?->toIso8601String(),
                'isLocked' => $reportYear->is_locked,
                'coverImageUrl' => null,
                'gfpsMembership' => [
                    'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                    'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
                ],
                'gfpsAssemblies' => $this->editableGfpsAssemblyRows($reportYear),
                'employeeStatuses' => $this->editableEmployeeStatusRows($reportYear),
                'scholarshipSnapshots' => $reportYear->scholarshipSnapshots
                    ->map(fn (ScholarshipSummary $s) => [
                        'id' => $s->id,
                        'schoolYearId' => $s->school_year_id,
                        'schoolYearLabel' => $s->schoolYear?->name ?? '',
                        'asOfDate' => $s->as_of_date?->toDateString(),
                        'femaleCount' => (int) $s->female_count,
                        'maleCount' => (int) $s->male_count,
                        'createdAt' => $s->created_at?->toIso8601String(),
                        'updatedAt' => $s->updated_at?->toIso8601String(),
                        'lastEditedBy' => $s->lastEditedBy?->username,
                        'lastEditedAt' => $s->last_edited_at?->toIso8601String(),
                    ]),
                'rstlMonthly' => $this->editableRstlMonthlyRows($reportYear),
                'programFunding' => $this->editableProgramFundingRows($reportYear),
                // null means unrestricted. The screen hides rows outside this
                // list; the server rejects writes to them regardless.
                'editableFundingSlugs' => FundingProgramScope::allowedSlugsFor($user),
            ],
        ]);
    }

    public function update(UpdateReportYearRequest $request, ReportYear $reportYear, PatchReportYearAttributes $patchReportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear, $this->expectedUpdatedAt($request));

        $patchReportYear->apply($reportYear, $request->validated(), ['year', 'title', 'description', 'status']);

        return back();
    }

    public function updateMetadata(UpdateReportYearMetadataRequest $request, ReportYear $reportYear, PatchReportYearAttributes $patchReportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear, $this->expectedUpdatedAt($request));

        $patchReportYear->apply($reportYear, $request->validated(), ['year', 'title', 'description']);

        return back();
    }

    public function destroy(ReportYear $reportYear): RedirectResponse
    {
        $this->authorize('delete', $reportYear);
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');

        $reportYear->delete();

        return to_route('report-years.index');
    }

    public function updateGfpsMembership(UpdateGfpsMembershipSummaryRequest $request, ReportYear $reportYear, PatchGfpsMembershipSummary $patchGfpsMembership, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear->gfpsMembershipSummary, $this->expectedUpdatedAt($request));

        $patchGfpsMembership->apply($reportYear, $request->validated());

        return back();
    }

    public function updateGfpsAssemblies(UpdateGfpsAssemblyAttendancesRequest $request, ReportYear $reportYear, PatchGfpsAssemblyAttendances $patchGfpsAssemblies, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'gfpsAssemblyAttendances', $this->expectedUpdatedAt($request));

        $patchGfpsAssemblies->apply($reportYear, $request->validated('attendances'));

        return back();
    }

    public function updateEmployeeStatuses(UpdateEmployeeStatusBreakdownsRequest $request, ReportYear $reportYear, PatchEmployeeStatusBreakdowns $patchEmployeeStatuses, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'employeeStatusBreakdowns', $this->expectedUpdatedAt($request));

        $patchEmployeeStatuses->apply($reportYear, $request->validated('breakdowns'));

        return back();
    }

    public function storeScholarshipSnapshot(StoreScholarshipSnapshotRequest $request, ReportYear $reportYear): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');

        // Stamped from the session, never from the payload: the history column
        // would otherwise sit blank for created rows and show a name only for
        // edited ones, which reads as a bug rather than as "never edited".
        $reportYear->scholarshipSnapshots()->create([
            ...$request->validated(),
            'last_edited_by' => $request->user()?->id,
            'last_edited_at' => now(),
        ]);

        return back();
    }

    public function updateScholarshipSnapshot(UpdateScholarshipSnapshotRequest $request, ReportYear $reportYear, ScholarshipSummary $scholarship, SparseRecordPatcher $patcher, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        abort_unless($scholarship->report_year_id === $reportYear->id, 404);

        $conflictGuard->assertFresh($scholarship, $this->expectedUpdatedAt($request));

        // Audit stamps ride along in the same save. Writing them separately bumped
        // updated_at twice, so the timestamp the client just synced against was
        // already stale by the time the response came back.
        $patcher->applyToModel(
            $scholarship,
            $request->validated(),
            ['school_year_id', 'as_of_date', 'female_count', 'male_count'],
            [
                'last_edited_by' => $request->user()?->id,
                'last_edited_at' => now(),
            ],
        );

        return back();
    }

    public function destroyScholarshipSnapshot(Request $request, ReportYear $reportYear, ScholarshipSummary $scholarship): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $this->authorize('deleteScholarship', $reportYear);
        abort_unless($scholarship->report_year_id === $reportYear->id, 404);

        $scholarship->delete();

        return back();
    }

    public function updateRstlMonthly(UpdateRstlMonthlyBreakdownsRequest $request, ReportYear $reportYear, PatchRstlMonthlyBreakdowns $patchRstlMonthly, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'rstlMonthlyBreakdowns', $this->expectedUpdatedAt($request));

        $patchRstlMonthly->apply($reportYear, $request->validated('breakdowns'));

        return back();
    }

    public function updateProgramFunding(UpdateProgramFundingSummariesRequest $request, ReportYear $reportYear, PatchProgramFundingSummaries $patchProgramFunding, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'programFundingSummaries', $this->expectedUpdatedAt($request));

        $patchProgramFunding->apply($reportYear, $request->validated('summaries'));

        return back();
    }

    public function toggleLock(Request $request, ReportYear $reportYear): RedirectResponse
    {
        $this->authorize('toggleLock', $reportYear);

        $reportYear->update(['is_locked' => ! $reportYear->is_locked]);

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
