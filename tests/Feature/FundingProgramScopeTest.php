<?php

use App\Enums\UserRole;
use App\Models\FundingProgram;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);

    config([
        'reports.funding_program_scopes' => [
            'toszcic' => ['setup-zc-ic', 'cest-zc-ic'],
            'toszsp' => ['setup-zsp', 'cest-zsp'],
        ],
    ]);

    $this->reportYear = ReportYear::factory()->create(['year' => 2026]);
});

function patchFunding(User $user, ReportYear $reportYear, string $slug): TestResponse
{
    $program = FundingProgram::query()->where('slug', $slug)->firstOrFail();

    return test()->actingAs($user)->patch("/report-years/{$reportYear->id}/program-funding", [
        'summaries' => [
            [
                'funding_program_id' => $program->id,
                'female_projects' => 7,
                'male_projects' => 3,
            ],
        ],
    ]);
}

test('a region scoped user may update its own funding program', function () {
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);

    patchFunding($user, $this->reportYear, 'setup-zc-ic')->assertSessionHasNoErrors();

    expect($this->reportYear->fresh()->programFundingSummaries)->toHaveCount(1);
});

test('a region scoped user cannot update another region funding program', function () {
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);

    patchFunding($user, $this->reportYear, 'setup-zsp')->assertSessionHasErrors();

    expect($this->reportYear->fresh()->programFundingSummaries)->toBeEmpty();
});

test('a region scoped user cannot update the other program family for another region', function () {
    $user = User::factory()->create(['username' => 'toszsp', 'role' => UserRole::TOS]);

    patchFunding($user, $this->reportYear, 'cest-zdn')->assertSessionHasErrors();

    expect($this->reportYear->fresh()->programFundingSummaries)->toBeEmpty();
});

test('an unscoped TOS user may update any funding program', function () {
    $user = User::factory()->create(['username' => 'TOSStaff', 'role' => UserRole::TOS]);

    patchFunding($user, $this->reportYear, 'setup-zdn')->assertSessionHasNoErrors();

    expect($this->reportYear->fresh()->programFundingSummaries)->toHaveCount(1);
});

test('an administrator is never region scoped', function () {
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::ADMINISTRATOR]);

    patchFunding($user, $this->reportYear, 'setup-zsp')->assertSessionHasNoErrors();

    expect($this->reportYear->fresh()->programFundingSummaries)->toHaveCount(1);
});

test('a scoped user cannot smuggle a foreign program alongside a permitted one', function () {
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);

    $own = FundingProgram::query()->where('slug', 'setup-zc-ic')->firstOrFail();
    $foreign = FundingProgram::query()->where('slug', 'setup-zdn')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$this->reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $own->id, 'female_projects' => 1],
                ['funding_program_id' => $foreign->id, 'female_projects' => 99],
            ],
        ])
        ->assertSessionHasErrors();

    // The whole patch is rejected, so the permitted row must not land either.
    expect($this->reportYear->fresh()->programFundingSummaries)->toBeEmpty();
});

test('the edit page tells the client which funding programs the user may edit', function () {
    $user = User::factory()->create(['username' => 'toszcic', 'role' => UserRole::TOS]);

    $this->actingAs($user)
        ->get("/report-years/{$this->reportYear->id}/edit")
        ->assertInertia(fn ($page) => $page
            ->where('reportYear.editableFundingSlugs', ['setup-zc-ic', 'cest-zc-ic']));
});

test('an unscoped user is told every funding program is editable', function () {
    $user = User::factory()->create(['username' => 'TOSStaff', 'role' => UserRole::TOS]);

    $this->actingAs($user)
        ->get("/report-years/{$this->reportYear->id}/edit")
        ->assertInertia(fn ($page) => $page->where('reportYear.editableFundingSlugs', null));
});
