<?php

use App\Enums\UserRole;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\SchoolYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);


test('report year create page sends no-store and ziggy routes', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/report-years/create');

    expect($response->headers->get('Cache-Control'))->toContain('no-store');

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Create')
            ->has('ziggy.routes')
        );
});

test('report year edit page sends no-store and ziggy routes', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);

    $response = $this->actingAs($user)->get("/report-years/{$reportYear->id}/edit");

    expect($response->headers->get('Cache-Control'))->toContain('no-store');

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Edit')
            ->has('reportYear')
            ->has('abilities')
            ->has('ziggy.routes')
        );
});

test('report management and print pages send no-store cache headers', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);

    $reportYearsIndex = $this->actingAs($user)->get('/report-years');
    expect($reportYearsIndex->headers->get('Cache-Control'))->toContain('no-store');

    $reportYearsCreate = $this->actingAs($user)->get('/report-years/create');
    expect($reportYearsCreate->headers->get('Cache-Control'))->toContain('no-store');

    $reportYearsEdit = $this->actingAs($user)->get("/report-years/{$reportYear->id}/edit");
    expect($reportYearsEdit->headers->get('Cache-Control'))->toContain('no-store');

    $printIndex = $this->actingAs($user)->get('/print-report');
    expect($printIndex->headers->get('Cache-Control'))->toContain('no-store');

    $printGenerate = $this->actingAs($user)->get('/print-report/generate?report_year_id='.$reportYear->id);
    $printGenerate->assertOk();
    expect($printGenerate->headers->get('Cache-Control'))->toContain('no-store');
});

test('guest user is redirected to login when opening report management', function () {
    $this->get('/report-years')
        ->assertRedirect(route('login'));
});

test('guest is redirected to login when opening print report', function () {
    $this->get('/print-report')
        ->assertRedirect(route('login'));

    $this->get('/print-report/generate?report_year_id=1')
        ->assertRedirect(route('login'));
});

test('user without report access cannot open print report', function () {
    $user = User::factory()->create(['role' => UserRole::None]);

    $this->actingAs($user)
        ->get('/print-report')
        ->assertForbidden();
});

test('user without report access cannot generate print report pdf', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::None]);
    $reportYear = ReportYear::factory()->create(['year' => 2026]);

    $this->actingAs($user)
        ->get('/print-report/generate?report_year_id='.$reportYear->id)
        ->assertForbidden();
});

test('authorized user receives a pdf when generating print report', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);

    $response = $this->actingAs($user)->get('/print-report/generate?report_year_id='.$reportYear->id);

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toContain('application/pdf');
    expect(strlen((string) $response->getContent()))->toBeGreaterThan(1000);
});

test('administrator can toggle the lock state of a report year', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/toggle-lock")
        ->assertRedirect();

    expect($reportYear->fresh()->is_locked)->toBeTrue();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/toggle-lock")
        ->assertRedirect();

    expect($reportYear->fresh()->is_locked)->toBeFalse();
});

test('gad user can toggle the lock state of a report year', function () {
    $user = User::factory()->create(['role' => UserRole::GAD]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/toggle-lock")
        ->assertRedirect();

    expect($reportYear->fresh()->is_locked)->toBeTrue();
});

test('user without lock permission cannot toggle the lock state', function () {
    $user = User::factory()->create(['role' => UserRole::HR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/toggle-lock")
        ->assertForbidden();

    expect($reportYear->fresh()->is_locked)->toBeFalse();
});

test('guest cannot toggle the lock state', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->patch("/report-years/{$reportYear->id}/toggle-lock")
        ->assertRedirect(route('login'));

    expect($reportYear->fresh()->is_locked)->toBeFalse();
});

test('locked report year rejects metadata updates', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", ['title' => 'New title'])
        ->assertForbidden();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/metadata", ['title' => 'New title'])
        ->assertForbidden();

    expect($reportYear->fresh()->title)->not->toBe('New title');
});

test('locked report year rejects deletion', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}")
        ->assertForbidden();

    expect(ReportYear::query()->whereKey($reportYear->id)->exists())->toBeTrue();
});

test('unauthorized user is forbidden from deleting even when unlocked, before the lock check runs', function () {
    $user = User::factory()->create(['role' => UserRole::HR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}")
        ->assertForbidden();

    expect(ReportYear::query()->whereKey($reportYear->id)->exists())->toBeTrue();
});

test('index page exposes canToggleLock and isLocked to the frontend', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);

    $this->actingAs($user)
        ->get('/report-years')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Index')
            ->where('canToggleLock', true)
            ->where('reportYears.0.isLocked', true)
        );
});

test('locked report year rejects gfps membership updates', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 22,
            'male_count' => 6,
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->gfpsMembershipSummary)->toBeNull();
});

test('locked report year rejects gfps assembly attendance updates', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $period = GfpsAssemblyPeriod::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-assemblies", [
            'attendances' => [
                ['period_id' => $period->id, 'female_count' => 10, 'male_count' => 3],
            ],
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->gfpsAssemblyAttendances)->toBeEmpty();
});

test('locked report year rejects employee status breakdown updates', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $status = EmploymentStatus::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/employee-statuses", [
            'breakdowns' => [
                ['employment_status_id' => $status->id, 'female_count' => 5, 'male_count' => 7],
            ],
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->employeeStatusBreakdowns)->toBeEmpty();
});

test('locked report year rejects rstl monthly breakdown updates', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $month = ReportMonth::query()->orderBy('month_number')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $month->id,
                    'female_count' => 1,
                    'female_led_count' => 2,
                    'male_count' => 3,
                    'male_led_count' => 4,
                ],
            ],
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->rstlMonthlyBreakdowns)->toBeEmpty();
});

test('locked report year rejects program funding summary updates', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $program = FundingProgram::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                [
                    'funding_program_id' => $program->id,
                    'female_projects' => 8,
                    'female_amount' => 1000.50,
                    'male_projects' => 12,
                    'male_amount' => 2000.75,
                ],
            ],
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->programFundingSummaries)->toBeEmpty();
});

test('non-admin user cannot access report management', function () {
    $user = User::factory()->create(['role' => UserRole::None]);

    $this->actingAs($user)
        ->get('/report-years')
        ->assertForbidden();
});

test('guest is redirected to login when opening new report year form', function () {
    $this->get('/report-years/create')
        ->assertRedirect(route('login'));
});

test('non-admin user cannot open new report year form', function () {
    $user = User::factory()->create(['role' => UserRole::None]);

    $this->actingAs($user)
        ->get('/report-years/create')
        ->assertForbidden();
});

test('admin can open new report year form', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/report-years/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Create'));
});

test('gad user can open new report year form', function () {
    $user = User::factory()->create(['role' => UserRole::GAD]);

    $this->actingAs($user)
        ->get('/report-years/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Create'));
});

test('authenticated user can create a report year shell', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/report-years', [
            'year' => 2027,
            'title' => '2027 report',
            'description' => 'Pending annual report',
            'status' => ReportYear::STATUS_PUBLISHED,
        ]);

    $reportYear = ReportYear::query()->where('year', 2027)->firstOrFail();

    $response->assertRedirect(route('report-years.edit', $reportYear, false));

    $this->assertDatabaseHas('report_years', [
        'year' => 2027,
        'title' => '2027 report',
        'status' => ReportYear::STATUS_PUBLISHED,
    ]);
});

test('gad user can create a report year shell', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::GAD]);

    $response = $this->actingAs($user)
        ->post('/report-years', [
            'year' => 2028,
            'title' => '2028 report',
            'description' => 'Pending annual report',
            'status' => ReportYear::STATUS_PENDING,
        ]);

    $reportYear = ReportYear::query()->where('year', 2028)->firstOrFail();

    $response->assertRedirect(route('report-years.edit', $reportYear, false));
});

test('guest cannot delete a report year', function () {
    $reportYear = ReportYear::factory()->create();

    $this->delete("/report-years/{$reportYear->id}")
        ->assertRedirect(route('login'));
});

test('non-admin user cannot delete a report year', function () {
    $user = User::factory()->create(['role' => UserRole::None]);
    $reportYear = ReportYear::factory()->create();

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}")
        ->assertForbidden();
});

test('admin can delete a report year', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2030]);

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}")
        ->assertRedirect(route('report-years.index'));

    $this->assertDatabaseMissing('report_years', [
        'id' => $reportYear->id,
    ]);
});

test('authenticated user can view and update normalized report sections', function () {
    $this->seed(ReportLookupSeeder::class);
    $programCount = FundingProgram::query()->count();

    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create([
        'year' => 2025,
    ]);

    $this->actingAs($user)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Edit')
            ->where('reportYear.year', 2025)
            ->has('reportYear.gfpsAssemblies', 4)
            ->has('reportYear.employeeStatuses', 4)
            ->has('reportYear.rstlMonthly', 12)
            ->has('reportYear.programFunding', $programCount)
        );

    $periods = GfpsAssemblyPeriod::query()->orderBy('sort_order')->get();
    $employmentStatuses = EmploymentStatus::query()->orderBy('sort_order')->get();
    $months = ReportMonth::query()->orderBy('month_number')->get();
    $programs = FundingProgram::query()->orderBy('sort_order')->get();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 22,
            'male_count' => 6,
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-assemblies", [
            'attendances' => $periods->map(fn ($period) => [
                'period_id' => $period->id,
                'female_count' => 10,
                'male_count' => 3,
            ])->all(),
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/employee-statuses", [
            'breakdowns' => $employmentStatuses->map(fn ($status) => [
                'employment_status_id' => $status->id,
                'female_count' => 5,
                'male_count' => 7,
            ])->all(),
        ])
        ->assertRedirect();

    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $this->actingAs($user)
        ->post("/report-years/{$reportYear->id}/scholarship", [
            'school_year_id' => $schoolYear->id,
            'as_of_date' => '2025-01-13',
            'female_count' => 64,
            'male_count' => 114,

        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => $months->map(fn ($month) => [
                'report_month_id' => $month->id,
                'female_count' => 1,
                'female_led_count' => 2,
                'male_count' => 3,
                'male_led_count' => 4,
            ])->all(),
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => $programs->map(fn ($program) => [
                'funding_program_id' => $program->id,
                'female_projects' => 8,
                'female_amount' => 1000.50,
                'male_projects' => 12,
                'male_amount' => 2000.75,
            ])->all(),
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('gfps_membership_summaries', [
        'report_year_id' => $reportYear->id,
        'female_count' => 22,
        'male_count' => 6,
    ]);

    $this->assertDatabaseCount('gfps_assembly_attendances', 4);
    $this->assertDatabaseCount('employee_status_breakdowns', 4);
    $this->assertDatabaseCount('rstl_monthly_breakdowns', 12);
    $this->assertDatabaseCount('program_funding_summaries', $programCount);
    $this->assertDatabaseHas('scholarship_summaries', [
        'report_year_id' => $reportYear->id,
        'school_year_id' => $schoolYear->id,
        'female_count' => 64,
        'male_count' => 114,

    ]);
});

test('scholarship user can list report years and edit scholarship but not other sections', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::SCHOLARSHIP]);
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $this->actingAs($user)
        ->get('/report-years')
        ->assertOk();

    $this->actingAs($user)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('abilities.updateScholarship', true)
                ->where('abilities.updateGfpsMembership', false),
        );

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 1,
            'male_count' => 1,
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->post("/report-years/{$reportYear->id}/scholarship", [
            'school_year_id' => $schoolYear->id,
            'as_of_date' => '2025-01-13',
            'female_count' => 10,
            'male_count' => 20,

        ])
        ->assertRedirect();
});

test('gad user can sparse patch metadata fields', function () {
    $user = User::factory()->create(['role' => UserRole::GAD]);
    $reportYear = ReportYear::factory()->create([
        'year' => 2024,
        'title' => 'Original title',
        'description' => 'Original description',
    ]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/metadata", [
            'title' => 'Updated title',
        ])
        ->assertRedirect();

    $reportYear->refresh();

    expect($reportYear->title)->toBe('Updated title')
        ->and($reportYear->description)->toBe('Original description');
});

test('administrator can sparse patch metadata via full update route', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create([
        'year' => 2025,
        'status' => ReportYear::STATUS_PENDING,
    ]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'status' => ReportYear::STATUS_PUBLISHED,
        ])
        ->assertRedirect();

    $reportYear->refresh();

    expect($reportYear->status)->toBe(ReportYear::STATUS_PUBLISHED)
        ->and($reportYear->published_at)->not->toBeNull();
});

test('metadata patch requires at least one field', function () {
    $user = User::factory()->create(['role' => UserRole::GAD]);
    $reportYear = ReportYear::factory()->create(['year' => 2024]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/metadata", [])
        ->assertInvalid(['patch']);
});

test('gad user cannot change publication status on full report update route', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create(['role' => UserRole::GAD]);
    $reportYear = ReportYear::factory()->create(['year' => 2024, 'status' => ReportYear::STATUS_PENDING]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'year' => 2024,
            'title' => 'x',
            'description' => 'y',
            'status' => ReportYear::STATUS_PUBLISHED,
        ])
        ->assertForbidden();
});

test('authenticated user can update scholarship snapshot', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $snapshot = $reportYear->scholarshipSnapshots()->create([
        'school_year_id' => $schoolYear->id,
        'as_of_date' => '2025-01-13',
        'female_count' => 10,
        'male_count' => 20,

    ]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/scholarship/{$snapshot->id}", [
            'female_count' => 15,
            'male_count' => 25,

        ], [
            'X-Expected-Updated-At' => $snapshot->updated_at?->toIso8601String(),
        ])
        ->assertRedirect();

    $snapshot->refresh();
    expect($snapshot->female_count)->toBe(15)
        ->and($snapshot->male_count)->toBe(25)
        ->and($snapshot->last_edited_by)->toBe($user->id)
        ->and($snapshot->last_edited_at)->not->toBeNull();
});

test('scholarship user can delete scholarship snapshot', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create(['role' => UserRole::SCHOLARSHIP]);
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $snapshot = $reportYear->scholarshipSnapshots()->create([
        'school_year_id' => $schoolYear->id,
        'as_of_date' => '2025-01-13',
        'female_count' => 10,
        'male_count' => 20,

    ]);

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}/scholarship/{$snapshot->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('scholarship_summaries', [
        'id' => $snapshot->id,
    ]);
});

test('non-scholarship non-admin user cannot delete scholarship snapshot', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create(['role' => UserRole::None]);
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $snapshot = $reportYear->scholarshipSnapshots()->create([
        'school_year_id' => $schoolYear->id,
        'as_of_date' => '2025-01-13',
        'female_count' => 10,
        'male_count' => 20,

    ]);

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}/scholarship/{$snapshot->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('scholarship_summaries', [
        'id' => $snapshot->id,
    ]);
});

test('locked report year rejects new scholarship snapshots', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $this->actingAs($user)
        ->post("/report-years/{$reportYear->id}/scholarship", [
            'school_year_id' => $schoolYear->id,
            'as_of_date' => '2025-01-13',
            'female_count' => 10,
            'male_count' => 20,
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->scholarshipSnapshots)->toBeEmpty();
});

test('locked report year rejects scholarship snapshot updates', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $snapshot = $reportYear->scholarshipSnapshots()->create([
        'school_year_id' => $schoolYear->id,
        'as_of_date' => '2025-01-13',
        'female_count' => 10,
        'male_count' => 20,
    ]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/scholarship/{$snapshot->id}", [
            'female_count' => 15,
            'male_count' => 25,
        ])
        ->assertForbidden();

    expect($snapshot->fresh()->female_count)->toBe(10);
});

test('locked report year rejects scholarship snapshot deletion', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $snapshot = $reportYear->scholarshipSnapshots()->create([
        'school_year_id' => $schoolYear->id,
        'as_of_date' => '2025-01-13',
        'female_count' => 10,
        'male_count' => 20,
    ]);

    $this->actingAs($user)
        ->delete("/report-years/{$reportYear->id}/scholarship/{$snapshot->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('scholarship_summaries', ['id' => $snapshot->id]);
});

test('cannot store scholarship snapshot with future as_of_date', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $futureDate = now('Asia/Manila')->addDay()->toDateString();

    $this->actingAs($user)
        ->post("/report-years/{$reportYear->id}/scholarship", [
            'school_year_id' => $schoolYear->id,
            'as_of_date' => $futureDate,
            'female_count' => 10,
            'male_count' => 20,

        ])
        ->assertInvalid(['as_of_date']);
});

test('cannot update scholarship snapshot with future as_of_date', function () {
    $this->seed(ReportLookupSeeder::class);
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    $snapshot = $reportYear->scholarshipSnapshots()->create([
        'school_year_id' => $schoolYear->id,
        'as_of_date' => '2025-01-13',
        'female_count' => 10,
        'male_count' => 20,

    ]);

    $futureDate = now('Asia/Manila')->addDay()->toDateString();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/scholarship/{$snapshot->id}", [
            'as_of_date' => $futureDate,
        ], [
            'X-Expected-Updated-At' => $snapshot->updated_at?->toIso8601String(),
        ])
        ->assertInvalid(['as_of_date']);
});
