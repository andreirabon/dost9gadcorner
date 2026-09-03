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

test('special projects research is seeded once per province, not once per funding family', function () {
    $slugs = FundingProgram::query()
        ->where('slug', 'like', 'research-%')
        ->orderBy('sort_order')
        ->pluck('slug')
        ->all();

    expect($slugs)->toBe(['research-zc-ic', 'research-zsp', 'research-zds', 'research-zdn']);
});

test('the public report exposes the four provincial research rows in their own breakdown', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $research = FundingProgram::query()->where('slug', 'research-zsp')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $research->id,
        'special_projects_research_female' => 7,
        'special_projects_research_male' => 3,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('year.reportData.researchFundingBreakdown', 4)
            ->where('year.reportData.researchFundingBreakdown.1.slug', 'research-zsp')
            ->where('year.reportData.researchFundingBreakdown.1.specialProjectsResearchFemale', 7)
            ->where('year.reportData.researchFundingBreakdown.1.specialProjectsResearchMale', 3)
            // The provincial row must not appear as a SETUP/CEST/GIA metric.
            ->where('year.reportData.setupFundingBreakdown.1.specialProjectsResearchFemale', 0)
            ->where('year.reportData.giaFundingBreakdown.1.specialProjectsResearchFemale', 0)
            ->etc()
        );
});

test('a province scoped TOS account may write its own research row', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);
    $research = FundingProgram::query()->where('slug', 'research-zc-ic')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $research->id, 'special_projects_research_female' => 5, 'special_projects_research_male' => 2],
            ],
        ])
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('program_funding_summaries', [
        'report_year_id' => $reportYear->id,
        'funding_program_id' => $research->id,
        'special_projects_research_female' => 5,
        'special_projects_research_male' => 2,
    ]);
});

test('a province scoped TOS account is rejected for another province research row', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);
    $other = FundingProgram::query()->where('slug', 'research-zdn')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $other->id, 'special_projects_research_female' => 5],
            ],
        ])
        ->assertSessionHasErrors('summaries.0.funding_program_id');
});

test('the printed report counts only the provinces that recorded research', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $research = FundingProgram::query()->where('slug', 'research-zsp')->firstOrFail();

    // One province of four. The rows arrive zero-filled, so the headline must
    // not claim research for the three that never entered any.
    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $research->id,
        'special_projects_research_female' => 7,
        'special_projects_research_male' => 3,
    ]);

    $reportYear->refresh()->load('programFundingSummaries.fundingProgram');

    $html = view('pdf.report', ['year' => app(ReportYearTransformer::class)->toDetailArray($reportYear)])->render();

    expect($html)->toContain('Provinces with research</span> <span class="v">1</span>')
        ->and($html)->toContain('Total researchers</span> <span class="v">10</span>');

    // The headline agrees with the table beneath it.
    $section = substr($html, strpos($html, 'Special Projects Research</p>'));
    expect(substr_count($section, '<td class="strong">'))->toBe(1);
});

test('a year carrying only research is not marked as funded on the report years index', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $research = FundingProgram::query()->where('slug', 'research-zsp')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $research->id,
        'special_projects_research_female' => 7,
    ]);

    // The index marker answers for the SETUP/CEST/GIA tabs, which are untouched.
    $this->actingAs(User::factory()->create(['role' => UserRole::ADMINISTRATOR]))
        ->get(route('report-years.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('reportYears.0.sections.funding', false)->etc());
});

test('a year carrying SETUP funding is still marked as funded on the report years index', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $setup = FundingProgram::query()->where('slug', 'setup-zsp')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $setup->id,
        'female_projects' => 3,
    ]);

    $this->actingAs(User::factory()->create(['role' => UserRole::ADMINISTRATOR]))
        ->get(route('report-years.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('reportYears.0.sections.funding', true)->etc());
});

test('the printed report gives special projects research its own section, by province', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $research = FundingProgram::query()->where('slug', 'research-zsp')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $research->id,
        'special_projects_research_female' => 7,
        'special_projects_research_male' => 3,
    ]);

    $reportYear->refresh()->load('programFundingSummaries.fundingProgram');

    $html = view('pdf.report', ['year' => app(ReportYearTransformer::class)->toDetailArray($reportYear)])->render();

    expect($html)->toContain('10.</span> Special Projects Research')
        // The row reads as the province, with the shared programme prefix stripped.
        ->and($html)->toContain('<td class="strong">ZSP</td>')
        // No longer a column on each family's metrics table.
        ->and($html)->not->toContain('Research (M/F)');
});
