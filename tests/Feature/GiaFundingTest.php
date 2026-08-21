<?php

use App\Enums\UserRole;
use App\Models\FundingProgram;
use App\Models\ReportYear;
use App\Models\User;
use App\Support\ReportYearTransformer;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
});

test('the four GIA funding programs are seeded alongside SETUP and CEST', function () {
    $slugs = FundingProgram::query()
        ->where('slug', 'like', 'gia-%')
        ->orderBy('sort_order')
        ->pluck('slug')
        ->all();

    expect($slugs)->toBe(['gia-zc-ic', 'gia-zsp', 'gia-zds', 'gia-zdn']);
});

test('the public report exposes a GIA breakdown separate from SETUP and CEST', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $gia = FundingProgram::query()->where('slug', 'gia-zsp')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $gia->id,
        'female_projects' => 4,
        'female_amount' => 250000,
        'male_projects' => 6,
        'male_amount' => 500000,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('year.reportData.giaFundingBreakdown', 4)
            ->where('year.reportData.giaFundingBreakdown.1.slug', 'gia-zsp')
            ->where('year.reportData.giaFundingBreakdown.1.femaleProjects', 4)
            ->where('year.reportData.giaFundingBreakdown.1.maleProjects', 6)
            // The GIA row must not leak into the other two families.
            ->where('year.reportData.setupFundingBreakdown.1.maleProjects', 0)
            ->where('year.reportData.cestFundingBreakdown.1.maleProjects', 0)
            ->etc()
        );
});

test('a province scoped TOS account may write its own GIA row', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);
    $gia = FundingProgram::query()->where('slug', 'gia-zc-ic')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $gia->id, 'female_projects' => 2, 'male_projects' => 1],
            ],
        ])
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('program_funding_summaries', [
        'report_year_id' => $reportYear->id,
        'funding_program_id' => $gia->id,
        'female_projects' => 2,
    ]);
});

test('a province scoped TOS account is rejected for another province GIA row', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);
    $other = FundingProgram::query()->where('slug', 'gia-zdn')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $other->id, 'female_projects' => 2, 'male_projects' => 1],
            ],
        ])
        ->assertSessionHasErrors('summaries.0.funding_program_id');
});

test('the printed report gives GIA its own section with its own totals', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $gia = FundingProgram::query()->where('slug', 'gia-zsp')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $gia->id,
        'female_projects' => 4,
        'female_amount' => 250000,
        'male_projects' => 6,
        'male_amount' => 500000,
    ]);

    $reportYear->refresh()->load('programFundingSummaries.fundingProgram');

    $html = view('pdf.report', ['year' => app(ReportYearTransformer::class)->toDetailArray($reportYear)])->render();

    // Its own numbered section, listing every GIA category.
    expect($html)->toContain('9.</span> GIA')
        ->and($html)->toContain('Grants-in-Aid (GIA)')
        ->and($html)->toContain('GIA ZSP');

    // GIA's own funding total reaches the page rather than being dropped.
    expect($html)->toContain('750,000.00');
});
