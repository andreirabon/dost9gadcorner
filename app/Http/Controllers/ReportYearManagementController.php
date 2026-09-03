<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportYearRequest;
use App\Http\Requests\StoreScholarshipSnapshotRequest;
use App\Http\Requests\UpdateEmployeeStatusBreakdownsRequest;
use App\Http\Requests\UpdateGfpsAssemblyAttendancesRequest;
use App\Http\Requests\UpdateGfpsMembershipSummaryRequest;
use App\Http\Requests\UpdateGfpsMemberStatusBreakdownsRequest;
use App\Http\Requests\UpdateProgramFundingSummariesRequest;
use App\Http\Requests\UpdateReportYearMetadataRequest;
use App\Http\Requests\UpdateReportYearRequest;
use App\Http\Requests\UpdateRstlMonthlyBreakdownsRequest;
use App\Http\Requests\UpdateScholarshipApplicantSummariesRequest;
use App\Http\Requests\UpdateScholarshipSnapshotRequest;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\ScholarshipProgram;
use App\Models\ScholarshipSummary;
use App\Models\SchoolYear;
use App\Services\AuditLogger;
use App\Services\Reports\ConflictGuard;
use App\Services\Reports\PatchReportYearAttributes;
use App\Services\Reports\PatchRowSection;
use App\Services\Reports\RowSection;
use App\Services\Reports\SparseRecordPatcher;
use App\Support\FundingProgramScope;
use App\Support\GfpsMemberStatuses;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ReportYearManagementController extends Controller
{
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
                    // The marker answers for the SETUP/CEST/GIA tabs, so the
                    // provincial research rows are excluded: a year carrying
                    // only research would otherwise read as funded.
                    'programFundingSummaries' => fn (Builder $query) => $query->whereHas(
                        'fundingProgram',
                        fn (Builder $program) => $program->where('slug', 'not like', 'research-%'),
                    ),
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
            'updateGfpsMemberStatuses' => $user->can('updateGfpsMemberStatuses', $reportYear),
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
                'gfpsMemberStatuses' => $reportYear->gfpsMemberStatusBreakdowns->max('updated_at')?->toIso8601String(),
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
                'gfpsMemberStatuses' => $this->editableGfpsMemberStatusRows($reportYear),
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
        return $this->patchReportYearFields(
            $request,
            $reportYear,
            $patchReportYear,
            $conflictGuard,
            ['year', 'title', 'description', 'status'],
            'report_year.',
        );
    }

    public function updateMetadata(UpdateReportYearMetadataRequest $request, ReportYear $reportYear, PatchReportYearAttributes $patchReportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchReportYearFields(
            $request,
            $reportYear,
            $patchReportYear,
            $conflictGuard,
            ['year', 'title', 'description'],
            'report_year.metadata_',
        );
    }

    /**
     * Shared body of the two report-year attribute endpoints. They differ only
     * in which fields they may write and how the change is named in the audit
     * log; the authorization gate lives on each endpoint's FormRequest.
     *
     * @param  list<string>  $fields
     */
    private function patchReportYearFields(
        FormRequest $request,
        ReportYear $reportYear,
        PatchReportYearAttributes $patchReportYear,
        ConflictGuard $conflictGuard,
        array $fields,
        string $auditActionPrefix,
    ): RedirectResponse {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear, $request->input('expected_updated_at'));

        $before = $reportYear->only($fields);
        $patchReportYear->apply($reportYear, $request->validated(), $fields);
        $after = $reportYear->only($fields);
        $diff = AuditLogger::diff($before, $after);

        AuditLogger::record(
            $request->user(),
            $auditActionPrefix.AuditLogger::actionVerb($diff),
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

    public function updateGfpsMembership(UpdateGfpsMembershipSummaryRequest $request, ReportYear $reportYear, SparseRecordPatcher $patcher, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear->gfpsMembershipSummary, $request->input('expected_updated_at'));

        $before = $reportYear->gfpsMembershipSummary?->only(['female_count', 'male_count']) ?? [];
        $patcher->applyToReportYearRelation(
            $reportYear,
            'gfpsMembershipSummary',
            $request->validated(),
            ['female_count', 'male_count'],
        );
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

    public function updateGfpsAssemblies(UpdateGfpsAssemblyAttendancesRequest $request, ReportYear $reportYear, PatchRowSection $patchRowSection, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $patchRowSection, $conflictGuard, RowSection::GFPS_ASSEMBLIES);
    }

    public function updateEmployeeStatuses(UpdateEmployeeStatusBreakdownsRequest $request, ReportYear $reportYear, PatchRowSection $patchRowSection, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $patchRowSection, $conflictGuard, RowSection::EMPLOYEE_STATUSES);
    }

    public function updateGfpsMemberStatuses(UpdateGfpsMemberStatusBreakdownsRequest $request, ReportYear $reportYear, PatchRowSection $patchRowSection, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $patchRowSection, $conflictGuard, RowSection::GFPS_MEMBER_STATUSES);
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

        $conflictGuard->assertFresh($scholarship, $request->input('expected_updated_at'));

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

    public function updateRstlMonthly(UpdateRstlMonthlyBreakdownsRequest $request, ReportYear $reportYear, PatchRowSection $patchRowSection, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $patchRowSection, $conflictGuard, RowSection::RSTL_MONTHLY);
    }

    public function updateScholarshipApplicants(UpdateScholarshipApplicantSummariesRequest $request, ReportYear $reportYear, PatchRowSection $patchRowSection, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $patchRowSection, $conflictGuard, RowSection::SCHOLARSHIP_APPLICANTS);
    }

    public function updateProgramFunding(UpdateProgramFundingSummariesRequest $request, ReportYear $reportYear, PatchRowSection $patchRowSection, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $patchRowSection, $conflictGuard, RowSection::PROGRAM_FUNDING);
    }

    /**
     * Shared body of the five multi-row section endpoints: conflict check,
     * sparse patch, then one audit entry per row that actually changed.
     *
     * Authorization stays on each endpoint's FormRequest, and the per-section
     * differences (model, identity column, value fields, audit wording) come
     * from {@see RowSection}.
     */
    private function patchRowSection(
        FormRequest $request,
        ReportYear $reportYear,
        PatchRowSection $patchRowSection,
        ConflictGuard $conflictGuard,
        string $section,
    ): RedirectResponse {
        $config = RowSection::config($section);

        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertRelationFresh($reportYear, $config['relation'], $request->input('expected_updated_at'));

        /** @var array<int, array<string, mixed>> $submitted */
        $submitted = $request->validated($config['payloadKey']);
        $before = $reportYear->{$config['relation']}()->get()->keyBy($config['identity']);

        $patchRowSection->apply($reportYear, $section, $submitted);

        $after = $reportYear->{$config['relation']}()->get()->keyBy($config['identity']);
        $names = $config['labelModel']::query()
            ->whereIn('id', collect($submitted)->pluck($config['patchKey'])->filter())
            ->pluck('name', 'id');

        $zeroed = array_fill_keys($config['valueFields'], 0);

        foreach ($submitted as $row) {
            if (! array_key_exists($config['patchKey'], $row)) {
                continue;
            }

            $id = $row[$config['patchKey']];
            $diff = AuditLogger::diff(
                $before->get($id)?->only($config['valueFields']) ?? $zeroed,
                $after->get($id)?->only($config['valueFields']) ?? $zeroed,
            );

            if ($diff === []) {
                continue;
            }

            AuditLogger::record(
                $request->user(),
                $config['auditAction'].'.'.AuditLogger::actionVerb($diff),
                $this->reportYearLabel($reportYear->title, $reportYear->year),
                $diff,
                section: $config['auditSection'],
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
        return $this->zeroFilledRows(
            GfpsAssemblyPeriod::query()->orderBy('sort_order'),
            $reportYear->gfpsAssemblyAttendances->keyBy('gfps_assembly_period_id'),
            fn (GfpsAssemblyPeriod $period, ?Model $attendance): array => [
                'periodId' => $period->id,
                'label' => $period->name,
                'femaleCount' => (int) ($attendance?->female_count ?? 0),
                'maleCount' => (int) ($attendance?->male_count ?? 0),
            ],
        );
    }

    /**
     * Every lookup row for a section, in lookup order, paired with the report
     * year's saved row for it — or nothing, which the mapper zero-fills. The
     * screen always offers the full list rather than only what was entered.
     *
     * @param  Builder<covariant Model>  $lookup
     * @param  Collection<int, Model>  $existing  keyed by the lookup row's id
     * @param  callable(Model, ?Model): array<string, mixed>  $map
     * @return array<int, array<string, mixed>>
     */
    private function zeroFilledRows(Builder $lookup, Collection $existing, callable $map): array
    {
        return $lookup
            ->get()
            ->map(fn (Model $row): array => $map($row, $existing->get($row->getKey())))
            ->all();
    }

    /**
     * @return array<int, array{employmentStatusId: int, label: string, femaleCount: int, maleCount: int}>
     */
    private function editableEmployeeStatusRows(ReportYear $reportYear): array
    {
        return $this->zeroFilledRows(
            EmploymentStatus::query()->orderBy('sort_order'),
            $reportYear->employeeStatusBreakdowns->keyBy('employment_status_id'),
            fn (EmploymentStatus $status, ?Model $breakdown): array => [
                'employmentStatusId' => $status->id,
                'label' => $status->name,
                'femaleCount' => (int) ($breakdown?->female_count ?? 0),
                'maleCount' => (int) ($breakdown?->male_count ?? 0),
            ],
        );
    }

    /**
     * GFPS members per employment status, narrowed to the reportable statuses.
     *
     * @return array<int, array{employmentStatusId: int, label: string, femaleCount: int, maleCount: int}>
     */
    private function editableGfpsMemberStatusRows(ReportYear $reportYear): array
    {
        return $this->zeroFilledRows(
            EmploymentStatus::query()->whereIn('slug', GfpsMemberStatuses::slugs())->orderBy('sort_order'),
            $reportYear->gfpsMemberStatusBreakdowns->keyBy('employment_status_id'),
            fn (EmploymentStatus $status, ?Model $breakdown): array => [
                'employmentStatusId' => $status->id,
                'label' => $status->name,
                'femaleCount' => (int) ($breakdown?->female_count ?? 0),
                'maleCount' => (int) ($breakdown?->male_count ?? 0),
            ],
        );
    }

    /**
     * @return array<int, array{reportMonthId: int, label: string, femaleCount: int, femaleLedCount: int, maleCount: int, maleLedCount: int}>
     */
    private function editableRstlMonthlyRows(ReportYear $reportYear): array
    {
        return $this->zeroFilledRows(
            ReportMonth::query()->orderBy('month_number'),
            $reportYear->rstlMonthlyBreakdowns->keyBy('report_month_id'),
            fn (ReportMonth $month, ?Model $breakdown): array => [
                'reportMonthId' => $month->id,
                'label' => $month->name,
                'femaleCount' => (int) ($breakdown?->female_count ?? 0),
                'femaleLedCount' => (int) ($breakdown?->female_led_count ?? 0),
                'maleCount' => (int) ($breakdown?->male_count ?? 0),
                'maleLedCount' => (int) ($breakdown?->male_led_count ?? 0),
            ],
        );
    }

    /**
     * @return array<int, array{scholarshipProgramId: int, label: string, fullName: string, slug: string, level: string, femaleCount: int, maleCount: int}>
     */
    private function editableScholarshipApplicantRows(ReportYear $reportYear): array
    {
        return $this->zeroFilledRows(
            ScholarshipProgram::query()->orderBy('sort_order'),
            $reportYear->scholarshipApplicantSummaries->keyBy('scholarship_program_id'),
            fn (ScholarshipProgram $program, ?Model $summary): array => [
                'scholarshipProgramId' => $program->id,
                // Full programme name rather than the acronym — the editor
                // should see the same wording the published report shows.
                'label' => (string) $program->name,
                'fullName' => (string) $program->name,
                'slug' => (string) $program->slug,
                'level' => (string) $program->level,
                'femaleCount' => (int) ($summary?->female_count ?? 0),
                'maleCount' => (int) ($summary?->male_count ?? 0),
            ],
        );
    }

    /**
     * @return array<int, array{fundingProgramId: int, label: string, slug: string, femaleProjects: int, femaleAmount: float, maleProjects: int, maleAmount: float, fundedProjectsCount: int, fundedProjectsValue: float, trainingParticipants: int, jobsTotal: int, jobsMale: int, jobsFemale: int, jobsPwd: int, jobsSeniorCitizen: int, jobsIp: int, jobs4ps: int, specialProjectsResearchMale: int, specialProjectsResearchFemale: int}>
     */
    private function editableProgramFundingRows(ReportYear $reportYear): array
    {
        return $this->zeroFilledRows(
            FundingProgram::query()->orderBy('sort_order'),
            $reportYear->programFundingSummaries->keyBy('funding_program_id'),
            fn (FundingProgram $program, ?Model $summary): array => [
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
            ],
        );
    }
}
