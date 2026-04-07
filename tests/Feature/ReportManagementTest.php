<?php

use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guest user is redirected to the homepage when opening report management', function () {
    $this->get('/report-years')
        ->assertRedirect('/');
});

test('authenticated user can create a report year shell', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/report-years', [
            'year' => 2027,
            'title' => '2027 report',
            'description' => 'Pending annual report',
            'status' => ReportYear::STATUS_PUBLISHED,
            'color_theme' => 'indigo',
            'background_image' => '/svg/reports.svg',
        ])
        ->assertRedirect('/report-years/1/edit');

    $this->assertDatabaseHas('report_years', [
        'year' => 2027,
        'title' => '2027 report',
        'status' => ReportYear::STATUS_PUBLISHED,
        'color_theme' => 'indigo',
    ]);
});

test('authenticated user can view and update normalized report sections', function () {
    $this->seed(ReportLookupSeeder::class);

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
            ->has('reportYear.programFunding', 2)
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

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/scholarship", [
            'school_year_label' => '2025-2026',
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
    $this->assertDatabaseCount('program_funding_summaries', 2);
    $this->assertDatabaseHas('scholarship_summaries', [
        'report_year_id' => $reportYear->id,
        'school_year_label' => '2025-2026',
        'female_count' => 64,
        'male_count' => 114,
    ]);
});
