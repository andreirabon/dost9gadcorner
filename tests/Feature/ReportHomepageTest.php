<?php

use App\Models\EmployeeStatusBreakdown;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyAttendance;
use App\Models\GfpsAssemblyPeriod;
use App\Models\GfpsMembershipSummary;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\RstlMonthlyBreakdown;
use App\Models\ScholarshipSummary;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('homepage renders published and pending report years from the database', function () {
    $this->seed(ReportLookupSeeder::class);

    $pendingYear = ReportYear::factory()->create([
        'year' => 2026,
        'status' => ReportYear::STATUS_PENDING,
        'description' => 'Figures are not available yet.',
    ]);

    $publishedYear = ReportYear::factory()->published()->create([
        'year' => 2025,
        'description' => 'Sex-disaggregated data report for 2025.',
        'color_theme' => 'violet',
        'background_image' => '/svg/reports.svg',
    ]);

    GfpsMembershipSummary::query()->create([
        'report_year_id' => $publishedYear->id,
        'female_count' => 22,
        'male_count' => 6,
    ]);

    ScholarshipSummary::query()->create([
        'report_year_id' => $publishedYear->id,
        'school_year_label' => '2025-2026',
        'as_of_date' => '2025-01-13',
        'female_count' => 64,
        'male_count' => 114,
    ]);

    foreach (GfpsAssemblyPeriod::query()->get() as $period) {
        GfpsAssemblyAttendance::query()->create([
            'report_year_id' => $publishedYear->id,
            'gfps_assembly_period_id' => $period->id,
            'female_count' => 5,
            'male_count' => 2,
        ]);
    }

    foreach (EmploymentStatus::query()->get() as $status) {
        EmployeeStatusBreakdown::query()->create([
            'report_year_id' => $publishedYear->id,
            'employment_status_id' => $status->id,
            'female_count' => 3,
            'male_count' => 4,
        ]);
    }

    foreach (ReportMonth::query()->get() as $month) {
        RstlMonthlyBreakdown::query()->create([
            'report_year_id' => $publishedYear->id,
            'report_month_id' => $month->id,
            'female_count' => 1,
            'female_led_count' => 1,
            'male_count' => 2,
            'male_led_count' => 0,
        ]);
    }

    foreach (FundingProgram::query()->get() as $program) {
        ProgramFundingSummary::query()->create([
            'report_year_id' => $publishedYear->id,
            'funding_program_id' => $program->id,
            'female_projects' => 8,
            'female_amount' => 1000,
            'male_projects' => 12,
            'male_amount' => 2000,
        ]);
    }

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Index')
            ->has('years', 2)
            ->where('years.0.id', $pendingYear->id)
            ->where('years.0.status', ReportYear::STATUS_PENDING)
            ->where('years.0.href', route('reports.show', $pendingYear))
            ->missing('years.0.reportData')
            ->where('years.1.id', $publishedYear->id)
            ->where('years.1.year', '2025')
            ->where('years.1.href', route('reports.show', $publishedYear))
            ->missing('years.1.reportData')
        );

    $this->get(route('reports.show', $publishedYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Show')
            ->where('year.id', $publishedYear->id)
            ->where('year.year', '2025')
            ->where('year.reportData.gfpsMembership.femaleCount', 22)
            ->where('year.reportData.gfpsAssemblies.0.label', '1st Assembly')
            ->where('year.reportData.employeeStatuses.0.label', 'Plantilla')
            ->where('year.reportData.scholarship.schoolYearLabel', '2025-2026')
            ->where('year.reportData.setupFunding.maleProjects', 12)
            ->where('year.reportData.cestFunding.femaleProjects', 8)
        );

    $this->get(route('reports.show', $pendingYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Show')
            ->where('year.id', $pendingYear->id)
            ->where('year.reportData', null)
        );
});
