<?php

use App\Enums\UserRole;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
});

test('edit page program funding rows keep their prop shape and formatting', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $program = FundingProgram::query()->orderBy('sort_order')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $program->id,
        'female_amount' => '1234.5',
        'jobs_4ps' => 3,
        'special_projects_research_male' => 2,
    ]);

    $this->actingAs($user)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('reportYear.programFunding.0', 19)
            ->where('reportYear.programFunding.0.fundingProgramId', $program->id)
            ->where('reportYear.programFunding.0.slug', $program->slug)
            ->where('reportYear.programFunding.0.femaleAmount', '1234.50')
            ->where('reportYear.programFunding.0.maleAmount', '0.00')
            ->where('reportYear.programFunding.0.jobs4ps', 3)
            ->where('reportYear.programFunding.0.specialProjectsResearchMale', 2)
        );
});

test('edit page female and male count sections keep their prop shape', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $status = EmploymentStatus::query()->where('slug', 'cos')->firstOrFail();

    $reportYear->employeeStatusBreakdowns()->create([
        'employment_status_id' => $status->id,
        'female_count' => 4,
        'male_count' => 1,
    ]);

    $this->actingAs($user)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('reportYear.employeeStatuses.0', 4)
            ->where('reportYear.employeeStatuses.1.employmentStatusId', $status->id)
            ->where('reportYear.employeeStatuses.1.label', 'COS')
            ->where('reportYear.employeeStatuses.1.femaleCount', 4)
            ->where('reportYear.employeeStatuses.1.maleCount', 1)
            ->has('reportYear.gfpsMemberStatuses', 3)
            ->has('reportYear.gfpsMemberStatuses.0', 4)
            ->has('reportYear.gfpsAssemblies.0', 4)
            ->has('reportYear.gfpsAssemblies.0.periodId')
        );
});

test('public report program funding rows keep float amounts and camel keys', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $setup = FundingProgram::query()->where('slug', 'like', 'setup-%')->orderBy('sort_order')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $setup->id,
        'male_amount' => '10.25',
        'jobs_senior_citizen' => 6,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('year.reportData.setupFundingBreakdown.0.slug', $setup->slug)
            ->where('year.reportData.setupFundingBreakdown.0.maleAmount', 10.25)
            ->where('year.reportData.setupFundingBreakdown.0.jobsSeniorCitizen', 6)
            ->has('year.reportData.setupFundingBreakdown.0', 18)
        );
});

test('program funding validation still rejects bad amounts, counts and empty rows', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $program = FundingProgram::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $program->id, 'female_amount' => '1000000000000', 'jobs_pwd' => 1.5],
            ],
        ])
        ->assertSessionHasErrors(['summaries.0.female_amount', 'summaries.0.jobs_pwd']);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [['funding_program_id' => $program->id]],
        ])
        ->assertSessionHasErrors(['summaries.0' => 'At least one field must be provided besides the row identifier.']);
});

test('a report year label falls back to the year when untitled', function () {
    expect(ReportYear::factory()->make(['year' => 2026, 'title' => null])->label)->toBe('Report Year 2026')
        ->and(ReportYear::factory()->make(['year' => 2026, 'title' => ''])->label)->toBe('Report Year 2026')
        ->and(ReportYear::factory()->make(['year' => 2026, 'title' => 'GAD Data'])->label)->toBe('GAD Data');
});
