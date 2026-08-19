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
use App\Models\SchoolYear;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('homepage lists only published report years and hides draft report pages', function () {
    $this->seed(ReportLookupSeeder::class);

    $pendingYear = ReportYear::factory()->create([
        'year' => 2026,
        'status' => ReportYear::STATUS_PENDING,
        'description' => 'Figures are not available yet.',
    ]);

    $publishedYear = ReportYear::factory()->published()->create([
        'year' => 2025,
        'description' => 'Sex-disaggregated data report for 2025.',
    ]);

    GfpsMembershipSummary::query()->create([
        'report_year_id' => $publishedYear->id,
        'female_count' => 22,
        'male_count' => 6,
    ]);

    $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

    ScholarshipSummary::query()->create([
        'report_year_id' => $publishedYear->id,
        'school_year_id' => $schoolYear->id,
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

    $setupCategoryCount = FundingProgram::query()->where('slug', 'like', 'setup-%')->count();
    $cestCategoryCount = FundingProgram::query()->where('slug', 'like', 'cest-%')->count();

    $homepageResponse = $this->get('/');

    expect($homepageResponse->headers->get('Cache-Control'))->toContain('no-store');

    $homepageResponse
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Index')
            ->has('years', 1)
            ->where('years.0.id', $publishedYear->id)
            ->where('years.0.year', '2025')
            ->where('years.0.href', route('reports.show', $publishedYear))
            ->missing('years.0.status')
            ->missing('years.0.reportData')
            ->where('ziggy.routes', function ($routes): bool {
                $names = collect($routes)->keys()->sort()->values()->all();

                return $names === ['index', 'login', 'login.store', 'reports.show'];
            })
        );

    $reportShowResponse = $this->get(route('reports.show', $publishedYear));

    expect($reportShowResponse->headers->get('Cache-Control'))->toContain('no-store');

    $reportShowResponse
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Show')
            ->where('year.id', $publishedYear->id)
            ->where('year.year', '2025')
            // Title and description are rendered as the report heading and lede,
            // so the public payload carries them. Status and href stay out: the
            // page is only reachable once published, and it links nowhere else.
            ->where('year.title', (string) $publishedYear->title)
            ->where('year.description', 'Sex-disaggregated data report for 2025.')
            ->missing('year.status')
            ->missing('year.href')
            ->where('year.reportData.gfpsMembership.femaleCount', 22)
            ->where('year.reportData.gfpsAssemblies.0.label', '1st Assembly')
            ->where('year.reportData.employeeStatuses.0.label', 'Plantilla')
            ->where('year.reportData.scholarship.schoolYearLabel', '2025-2026')
            ->where('year.reportData.setupFunding.maleProjects', 12 * $setupCategoryCount)
            ->where('year.reportData.cestFunding.femaleProjects', 8 * $cestCategoryCount)
            ->has('year.reportData.setupFundingBreakdown', $setupCategoryCount)
            ->has('year.reportData.cestFundingBreakdown', $cestCategoryCount)
            ->where('ziggy.routes', function ($routes): bool {
                $names = collect($routes)->keys()->sort()->values()->all();

                return $names === ['index', 'login', 'login.store', 'reports.show'];
            })
        );

    $this->get(route('reports.show', $pendingYear))->assertNotFound();
});

test('public report page exposes the per-program annual metrics', function () {
    $this->seed(ReportLookupSeeder::class);

    $publishedYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $setupProgram = FundingProgram::query()->where('slug', 'like', 'setup%')->orderBy('sort_order')->firstOrFail();

    ProgramFundingSummary::query()->create([
        'report_year_id' => $publishedYear->id,
        'funding_program_id' => $setupProgram->id,
        'funded_projects_count' => 10,
        'funded_projects_value' => 500000.25,
        'training_participants' => 40,
        'jobs_total' => 100,
        'jobs_male' => 50,
        'jobs_female' => 50,
        'jobs_pwd' => 5,
        'jobs_senior_citizen' => 5,
        'jobs_ip' => 5,
        'jobs_4ps' => 4,
        'special_projects_research_male' => 6,
        'special_projects_research_female' => 4,
    ]);

    $this->get(route('reports.show', $publishedYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Show')
            ->where('year.reportData.setupFundingBreakdown.0.fundedProjectsCount', 10)
            ->where('year.reportData.setupFundingBreakdown.0.trainingParticipants', 40)
            ->where('year.reportData.setupFundingBreakdown.0.jobsTotal', 100)
            ->where('year.reportData.setupFundingBreakdown.0.jobsMale', 50)
            ->where('year.reportData.setupFundingBreakdown.0.jobsFemale', 50)
            ->where('year.reportData.setupFundingBreakdown.0.jobsPwd', 5)
            ->where('year.reportData.setupFundingBreakdown.0.jobs4ps', 4)
            ->where('year.reportData.setupFundingBreakdown.0.specialProjectsResearchMale', 6)
            ->where('year.reportData.setupFundingBreakdown.0.specialProjectsResearchFemale', 4)
            ->etc()
        );
});
