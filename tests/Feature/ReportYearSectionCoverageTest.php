<?php

use App\Models\EmployeeStatusBreakdown;
use App\Models\EmploymentStatus;
use App\Models\GfpsMembershipSummary;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('report year index reports every section as empty when no data has been entered', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();
    ReportYear::factory()->create(['year' => 2030]);

    $this->actingAs($user)
        ->get('/report-years')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Index')
            ->where('reportYears.0.sections', [
                'employees' => false,
                'assembly' => false,
                'membership' => false,
                'funding' => false,
                'rstl' => false,
                'scholarships' => false,
            ])
        );
});

test('report year index marks only the sections that actually hold rows', function () {
    $this->seed(ReportLookupSeeder::class);

    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2031]);

    EmployeeStatusBreakdown::create([
        'report_year_id' => $reportYear->id,
        'employment_status_id' => EmploymentStatus::query()->firstOrFail()->id,
        'female_count' => 3,
        'male_count' => 2,
    ]);

    GfpsMembershipSummary::create([
        'report_year_id' => $reportYear->id,
        'female_count' => 5,
        'male_count' => 4,
    ]);

    $this->actingAs($user)
        ->get('/report-years')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Index')
            ->where('reportYears.0.sections.employees', true)
            ->where('reportYears.0.sections.membership', true)
            ->where('reportYears.0.sections.assembly', false)
            ->where('reportYears.0.sections.funding', false)
            ->where('reportYears.0.sections.rstl', false)
            ->where('reportYears.0.sections.scholarships', false)
        );
});
