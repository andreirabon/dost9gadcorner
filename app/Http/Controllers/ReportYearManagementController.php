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
use App\Http\Requests\UpdateScholarshipApplicantSummariesRequest;
use App\Http\Requests\UpdateScholarshipSnapshotRequest;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\ScholarshipApplicantSummary;
use App\Models\ScholarshipProgram;
use App\Models\ScholarshipSummary;
use App\Models\SchoolYear;
use App\Services\AuditLogger;
use App\Services\Reports\ConflictGuard;
use App\Services\Reports\PatchEmployeeStatusBreakdowns;
use App\Services\Reports\PatchGfpsAssemblyAttendances;
use App\Services\Reports\PatchGfpsMembershipSummary;
use App\Services\Reports\PatchProgramFundingSummaries;
use App\Services\Reports\PatchReportYearAttributes;
use App\Services\Reports\PatchRstlMonthlyBreakdowns;
use App\Services\Reports\PatchScholarshipApplicantSummaries;
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

    /**
     * Audit-log item label: the report year's title when set, otherwise a
     * "Report Year {year}" fallback for untitled years.
     */
    private function reportYearLabel(?string $title, int $year): string
    {
        return $title !== null && $title !== '' ? $title : "Report Year {$year}";
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

        AuditLogger::record(
            $request->user(),
            'report_year.created',
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            AuditLogger::created($reportYear->only(['year', 'title', 'description', 'status'])),
            section: 'Report Year',
        );

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
            'scholarshipApplicantSummaries',
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
                'scholarshipApplicants' => $reportYear->scholarshipApplicantSummaries->max('updated_at')?->toIso8601String(),
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
                'scholarshipApplicants' => $this->editableScholarshipApplicantRows($reportYear),
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

        $before = $reportYear->only(['year', 'title', 'description', 'status']);
        $patchReportYear->apply($reportYear, $request->validated(), ['year', 'title', 'description', 'status']);
        $after = $reportYear->only(['year', 'title', 'description', 'status']);
        $diff = AuditLogger::diff($before, $after);

        AuditLogger::record(
            $request->user(),
            'report_year.'.AuditLogger::actionVerb($diff),
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            $diff,
            section: 'Report Year',
            column: AuditLogger::humanizeFields($diff),
        );

        return back();
    }

    public function updateMetadata(UpdateReportYearMetadataRequest $request, ReportYear $reportYear, PatchReportYearAttributes $patchReportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear, $this->expectedUpdatedAt($request));

        $before = $reportYear->only(['year', 'title', 'description']);
        $patchReportYear->apply($reportYear, $request->validated(), ['year', 'title', 'description']);
        $after = $reportYear->only(['year', 'title', 'description']);
        $diff = AuditLogger::diff($before, $after);

        AuditLogger::record(
            $request->user(),
            'report_year.metadata_'.AuditLogger::actionVerb($diff),
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            $diff,
            section: 'Report Year',
            column: AuditLogger::humanizeFields($diff),
        );

        return back();
    }

    public function destroy(Request $request, ReportYear $reportYear): RedirectResponse
    {
        $this->authorize('delete', $reportYear);
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');

        $label = $this->reportYearLabel($reportYear->title, $reportYear->year);
        $before = $reportYear->only(['year', 'title', 'description', 'status']);
        $reportYear->delete();

        AuditLogger::record(
            $request->user(),
            'report_year.deleted',
            $label,
            AuditLogger::removed($before),
            section: 'Report Year',
        );

        return to_route('report-years.index');
    }

    public function updateGfpsMembership(UpdateGfpsMembershipSummaryRequest $request, ReportYear $reportYear, PatchGfpsMembershipSummary $patchGfpsMembership, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear->gfpsMembershipSummary, $this->expectedUpdatedAt($request));

        $before = $reportYear->gfpsMembershipSummary?->only(['female_count', 'male_count']) ?? [];
        $patchGfpsMembership->apply($reportYear, $request->validated());
        $after = $reportYear->gfpsMembershipSummary?->fresh()?->only(['female_count', 'male_count']) ?? [];
        $diff = AuditLogger::diff($before, $after);

        AuditLogger::record(
            $request->user(),
            'gfps_membership.'.AuditLogger::actionVerb($diff),
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            $diff,
            section: 'GFPS Membership',
            column: AuditLogger::humanizeFields($diff),
        );

        return back();
    }

    public function updateGfpsAssemblies(UpdateGfpsAssemblyAttendancesRequest $request, ReportYear $reportYear, PatchGfpsAssemblyAttendances $patchGfpsAssemblies, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'gfpsAssemblyAttendances', $this->expectedUpdatedAt($request));

        $submitted = $request->validated('attendances');
        $before = $reportYear->gfpsAssemblyAttendances()->get()->keyBy('gfps_assembly_period_id');

        $patchGfpsAssemblies->apply($reportYear, $submitted);

        $after = $reportYear->gfpsAssemblyAttendances()->get()->keyBy('gfps_assembly_period_id');
        $names = GfpsAssemblyPeriod::query()
            ->whereIn('id', collect($submitted)->pluck('period_id')->filter())
            ->pluck('name', 'id');

        foreach ($submitted as $row) {
            if (! array_key_exists('period_id', $row)) {
                continue;
            }

            $id = $row['period_id'];
            $beforeAttrs = $before->get($id)?->only(['female_count', 'male_count']) ?? ['female_count' => 0, 'male_count' => 0];
            $afterAttrs = $after->get($id)?->only(['female_count', 'male_count']) ?? ['female_count' => 0, 'male_count' => 0];
            $diff = AuditLogger::diff($beforeAttrs, $afterAttrs);

            if ($diff === []) {
                continue;
            }

            AuditLogger::record(
                $request->user(),
                'gfps_assemblies.'.AuditLogger::actionVerb($diff),
                $this->reportYearLabel($reportYear->title, $reportYear->year),
                $diff,
                section: 'GFPS Assemblies',
                column: AuditLogger::humanizeFields($diff),
                row: $names->get($id, "#{$id}"),
            );
        }

        return back();
    }

    public function updateEmployeeStatuses(UpdateEmployeeStatusBreakdownsRequest $request, ReportYear $reportYear, PatchEmployeeStatusBreakdowns $patchEmployeeStatuses, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'employeeStatusBreakdowns', $this->expectedUpdatedAt($request));

        $submitted = $request->validated('breakdowns');
        $before = $reportYear->employeeStatusBreakdowns()->get()->keyBy('employment_status_id');

        $patchEmployeeStatuses->apply($reportYear, $submitted);

        $after = $reportYear->employeeStatusBreakdowns()->get()->keyBy('employment_status_id');
        $names = EmploymentStatus::query()
            ->whereIn('id', collect($submitted)->pluck('employment_status_id')->filter())
            ->pluck('name', 'id');

        foreach ($submitted as $row) {
            if (! array_key_exists('employment_status_id', $row)) {
                continue;
            }

            $id = $row['employment_status_id'];
            $beforeAttrs = $before->get($id)?->only(['female_count', 'male_count']) ?? ['female_count' => 0, 'male_count' => 0];
            $afterAttrs = $after->get($id)?->only(['female_count', 'male_count']) ?? ['female_count' => 0, 'male_count' => 0];
            $diff = AuditLogger::diff($beforeAttrs, $afterAttrs);

            if ($diff === []) {
                continue;
            }

            AuditLogger::record(
                $request->user(),
                'employee_statuses.'.AuditLogger::actionVerb($diff),
                $this->reportYearLabel($reportYear->title, $reportYear->year),
                $diff,
                section: 'Employee Statuses',
                column: AuditLogger::humanizeFields($diff),
                row: $names->get($id, "#{$id}"),
            );
        }

        return back();
    }

    public function storeScholarshipSnapshot(StoreScholarshipSnapshotRequest $request, ReportYear $reportYear): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');

        // Stamped from the session, never from the payload: the history column
        // would otherwise sit blank for created rows and show a name only for
        // edited ones, which reads as a bug rather than as "never edited".
        $scholarship = $reportYear->scholarshipSnapshots()->create([
            ...$request->validated(),
            'last_edited_by' => $request->user()?->id,
            'last_edited_at' => now(),
        ]);

        $schoolYearName = SchoolYear::find($scholarship->school_year_id)?->name;

        AuditLogger::record(
            $request->user(),
            'scholarship.created',
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            AuditLogger::created($scholarship->only(['school_year_id', 'as_of_date', 'female_count', 'male_count'])),
            section: 'Scholarship',
            row: $schoolYearName ?? "#{$scholarship->school_year_id}",
        );

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
        $before = $scholarship->only(['school_year_id', 'as_of_date', 'female_count', 'male_count']);
        $patcher->applyToModel(
            $scholarship,
            $request->validated(),
            ['school_year_id', 'as_of_date', 'female_count', 'male_count'],
            [
                'last_edited_by' => $request->user()?->id,
                'last_edited_at' => now(),
            ],
        );
        $after = $scholarship->only(['school_year_id', 'as_of_date', 'female_count', 'male_count']);
        $diff = AuditLogger::diff($before, $after);

        AuditLogger::record(
            $request->user(),
            'scholarship.'.AuditLogger::actionVerb($diff),
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            $diff,
            section: 'Scholarship',
            column: AuditLogger::humanizeFields($diff),
            row: $scholarship->schoolYear?->name ?? "#{$scholarship->school_year_id}",
        );

        return back();
    }

    public function destroyScholarshipSnapshot(Request $request, ReportYear $reportYear, ScholarshipSummary $scholarship): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $this->authorize('deleteScholarship', $reportYear);
        abort_unless($scholarship->report_year_id === $reportYear->id, 404);

        $schoolYearName = $scholarship->schoolYear?->name ?? "#{$scholarship->school_year_id}";
        $before = $scholarship->only(['school_year_id', 'as_of_date', 'female_count', 'male_count']);
        $scholarship->delete();

        AuditLogger::record(
            $request->user(),
            'scholarship.deleted',
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            AuditLogger::removed($before),
            section: 'Scholarship',
            row: $schoolYearName,
        );

        return back();
    }

    public function updateRstlMonthly(UpdateRstlMonthlyBreakdownsRequest $request, ReportYear $reportYear, PatchRstlMonthlyBreakdowns $patchRstlMonthly, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'rstlMonthlyBreakdowns', $this->expectedUpdatedAt($request));

        $submitted = $request->validated('breakdowns');
        $before = $reportYear->rstlMonthlyBreakdowns()->get()->keyBy('report_month_id');

        $patchRstlMonthly->apply($reportYear, $submitted);

        $after = $reportYear->rstlMonthlyBreakdowns()->get()->keyBy('report_month_id');
        $names = ReportMonth::query()
            ->whereIn('id', collect($submitted)->pluck('report_month_id')->filter())
            ->pluck('name', 'id');

        $fields = ['female_count', 'female_led_count', 'male_count', 'male_led_count'];

        foreach ($submitted as $row) {
            if (! array_key_exists('report_month_id', $row)) {
                continue;
            }

            $id = $row['report_month_id'];
            $beforeAttrs = $before->get($id)?->only($fields) ?? array_fill_keys($fields, 0);
            $afterAttrs = $after->get($id)?->only($fields) ?? array_fill_keys($fields, 0);
            $diff = AuditLogger::diff($beforeAttrs, $afterAttrs);

            if ($diff === []) {
                continue;
            }

            AuditLogger::record(
                $request->user(),
                'rstl_monthly.'.AuditLogger::actionVerb($diff),
                $this->reportYearLabel($reportYear->title, $reportYear->year),
                $diff,
                section: 'RSTL Monthly',
                column: AuditLogger::humanizeFields($diff),
                row: $names->get($id, "#{$id}"),
            );
        }

        return back();
    }

    public function updateScholarshipApplicants(UpdateScholarshipApplicantSummariesRequest $request, ReportYear $reportYear, PatchScholarshipApplicantSummaries $patchApplicants, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'scholarshipApplicantSummaries', $this->expectedUpdatedAt($request));

        $submitted = $request->validated('applicants');
        $before = $reportYear->scholarshipApplicantSummaries()->get()->keyBy('scholarship_program_id');

        $patchApplicants->apply($reportYear, $submitted);

        $after = $reportYear->scholarshipApplicantSummaries()->get()->keyBy('scholarship_program_id');
        $names = ScholarshipProgram::query()
            ->whereIn('id', collect($submitted)->pluck('scholarship_program_id')->filter())
            ->pluck('name', 'id');

        $fields = ['female_count', 'male_count'];

        foreach ($submitted as $row) {
            if (! array_key_exists('scholarship_program_id', $row)) {
                continue;
            }

            $id = $row['scholarship_program_id'];
            $beforeAttrs = $before->get($id)?->only($fields) ?? array_fill_keys($fields, 0);
            $afterAttrs = $after->get($id)?->only($fields) ?? array_fill_keys($fields, 0);
            $diff = AuditLogger::diff($beforeAttrs, $afterAttrs);

            if ($diff === []) {
                continue;
            }

            AuditLogger::record(
                $request->user(),
                'scholarship_applicants.'.AuditLogger::actionVerb($diff),
                $this->reportYearLabel($reportYear->title, $reportYear->year),
                $diff,
                section: 'Scholarship Applicants',
                column: AuditLogger::humanizeFields($diff),
                row: $names->get($id, "#{$id}"),
            );
        }

        return back();
    }

    public function updateProgramFunding(UpdateProgramFundingSummariesRequest $request, ReportYear $reportYear, PatchProgramFundingSummaries $patchProgramFunding, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, 'programFundingSummaries', $this->expectedUpdatedAt($request));

        $submitted = $request->validated('summaries');
        $before = $reportYear->programFundingSummaries()->get()->keyBy('funding_program_id');

        $patchProgramFunding->apply($reportYear, $submitted);

        $after = $reportYear->programFundingSummaries()->get()->keyBy('funding_program_id');
        $names = FundingProgram::query()
            ->whereIn('id', collect($submitted)->pluck('funding_program_id')->filter())
            ->pluck('name', 'id');

        $fields = [
            'female_projects', 'female_amount', 'male_projects', 'male_amount',
            'funded_projects_count', 'funded_projects_value', 'training_participants',
            'jobs_total', 'jobs_male', 'jobs_female', 'jobs_pwd', 'jobs_senior_citizen',
            'jobs_ip', 'jobs_4ps',
            'special_projects_research_male', 'special_projects_research_female',
        ];

        foreach ($submitted as $row) {
            if (! array_key_exists('funding_program_id', $row)) {
                continue;
            }

            $id = $row['funding_program_id'];
            $beforeAttrs = $before->get($id)?->only($fields) ?? array_fill_keys($fields, 0);
            $afterAttrs = $after->get($id)?->only($fields) ?? array_fill_keys($fields, 0);
            $diff = AuditLogger::diff($beforeAttrs, $afterAttrs);

            if ($diff === []) {
                continue;
            }

            AuditLogger::record(
                $request->user(),
                'program_funding.'.AuditLogger::actionVerb($diff),
                $this->reportYearLabel($reportYear->title, $reportYear->year),
                $diff,
                section: 'Program Funding',
                column: AuditLogger::humanizeFields($diff),
                row: $names->get($id, "#{$id}"),
            );
        }

        return back();
    }

    public function toggleLock(Request $request, ReportYear $reportYear): RedirectResponse
    {
        $this->authorize('toggleLock', $reportYear);

        $wasLocked = $reportYear->is_locked;
        $reportYear->update(['is_locked' => ! $wasLocked]);

        AuditLogger::record(
            $request->user(),
            'report_year.lock_toggled',
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            ['is_locked' => ['old' => $wasLocked, 'new' => ! $wasLocked]],
            section: 'Report Year',
            column: 'Is Locked',
        );

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
     * Every scholarship program, zero-filled where a year has no row yet, so
     * the screen always offers the full list rather than only what was entered.
     *
     * @return array<int, array{scholarshipProgramId: int, label: string, fullName: string, slug: string, level: string, femaleCount: int, maleCount: int}>
     */
    private function editableScholarshipApplicantRows(ReportYear $reportYear): array
    {
        /** @var Collection<int, ScholarshipApplicantSummary> $existing */
        $existing = $reportYear->scholarshipApplicantSummaries->keyBy('scholarship_program_id');

        return ScholarshipProgram::query()
            ->orderBy('sort_order')
            ->get()
            ->map(function (ScholarshipProgram $program) use ($existing): array {
                $summary = $existing->get($program->id);

                return [
                    'scholarshipProgramId' => $program->id,
                    // Full programme name rather than the acronym — the editor
                    // should see the same wording the published report shows.
                    'label' => (string) $program->name,
                    'fullName' => (string) $program->name,
                    'slug' => (string) $program->slug,
                    'level' => (string) $program->level,
                    'femaleCount' => (int) ($summary?->female_count ?? 0),
                    'maleCount' => (int) ($summary?->male_count ?? 0),
                ];
            })
            ->all();
    }

    /**
     * @return array<int, array{fundingProgramId: int, label: string, slug: string, femaleProjects: int, femaleAmount: float, maleProjects: int, maleAmount: float, fundedProjectsCount: int, fundedProjectsValue: float, trainingParticipants: int, jobsTotal: int, jobsMale: int, jobsFemale: int, jobsPwd: int, jobsSeniorCitizen: int, jobsIp: int, jobs4ps: int, specialProjectsResearchMale: int, specialProjectsResearchFemale: int}>
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
                    'fundedProjectsCount' => (int) ($summary?->funded_projects_count ?? 0),
                    'fundedProjectsValue' => number_format((float) ($summary?->funded_projects_value ?? 0), 2, '.', ''),
                    'trainingParticipants' => (int) ($summary?->training_participants ?? 0),
                    'jobsTotal' => (int) ($summary?->jobs_total ?? 0),
                    'jobsMale' => (int) ($summary?->jobs_male ?? 0),
                    'jobsFemale' => (int) ($summary?->jobs_female ?? 0),
                    'jobsPwd' => (int) ($summary?->jobs_pwd ?? 0),
                    'jobsSeniorCitizen' => (int) ($summary?->jobs_senior_citizen ?? 0),
                    'jobsIp' => (int) ($summary?->jobs_ip ?? 0),
                    'jobs4ps' => (int) ($summary?->jobs_4ps ?? 0),
                    'specialProjectsResearchMale' => (int) ($summary?->special_projects_research_male ?? 0),
                    'specialProjectsResearchFemale' => (int) ($summary?->special_projects_research_female ?? 0),
                ];
            })
            ->all();
    }
}
