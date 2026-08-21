<?php

use App\Enums\UserRole;
use App\Models\EmploymentStatus;
use App\Models\GfpsMemberStatusBreakdown;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
    $this->admin = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
});

/** The status a GFPS member can hold, in lookup order. */
function memberStatus(string $slug): EmploymentStatus
{
    return EmploymentStatus::query()->where('slug', $slug)->firstOrFail();
}

test('the reportable member statuses exclude the ones the report does not break down', function () {
    // Agency is a real employment status and stays on the Employees tab; GFPS
    // membership is only reported across the three the config names.
    expect(config('reports.gfps_member_status_slugs'))->toBe(['plantilla', 'cos', 'jo']);
});

test('admin can record GFPS members per employment status', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->actingAs($this->admin)
        ->patch("/report-years/{$reportYear->id}/gfps-member-statuses", [
            'breakdowns' => [
                ['employment_status_id' => memberStatus('plantilla')->id, 'female_count' => 12, 'male_count' => 9],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('gfps_member_status_breakdowns', [
        'report_year_id' => $reportYear->id,
        'employment_status_id' => memberStatus('plantilla')->id,
        'female_count' => 12,
        'male_count' => 9,
    ]);
});

test('HR may record GFPS member statuses', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);
    $hr = User::factory()->create(['role' => UserRole::HR]);

    $this->actingAs($hr)
        ->patch("/report-years/{$reportYear->id}/gfps-member-statuses", [
            'breakdowns' => [
                ['employment_status_id' => memberStatus('cos')->id, 'female_count' => 3, 'male_count' => 2],
            ],
        ])
        ->assertSessionHasNoErrors();
});

test('a role with no claim on this section is refused', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);
    $rstl = User::factory()->create(['role' => UserRole::RSTL]);

    $this->actingAs($rstl)
        ->patch("/report-years/{$reportYear->id}/gfps-member-statuses", [
            'breakdowns' => [
                ['employment_status_id' => memberStatus('cos')->id, 'female_count' => 3, 'male_count' => 2],
            ],
        ])
        ->assertForbidden();
});

test('a status the report does not break down is rejected', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->actingAs($this->admin)
        ->patch("/report-years/{$reportYear->id}/gfps-member-statuses", [
            'breakdowns' => [
                ['employment_status_id' => memberStatus('agency')->id, 'female_count' => 3, 'male_count' => 2],
            ],
        ])
        ->assertSessionHasErrors('breakdowns.0.employment_status_id');
});

test('a locked report year rejects GFPS member status updates', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);

    $this->actingAs($this->admin)
        ->patch("/report-years/{$reportYear->id}/gfps-member-statuses", [
            'breakdowns' => [
                ['employment_status_id' => memberStatus('plantilla')->id, 'female_count' => 1, 'male_count' => 1],
            ],
        ])
        ->assertForbidden();
});

test('the public report exposes GFPS members per status, zero filled and in lookup order', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);

    GfpsMemberStatusBreakdown::query()->create([
        'report_year_id' => $reportYear->id,
        'employment_status_id' => memberStatus('jo')->id,
        'female_count' => 4,
        'male_count' => 6,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            // Three rows, not four: Agency is not part of this breakdown.
            ->has('year.reportData.gfpsMemberStatuses', 3)
            ->where('year.reportData.gfpsMemberStatuses.0.label', 'Plantilla')
            ->where('year.reportData.gfpsMemberStatuses.0.female', 0)
            ->where('year.reportData.gfpsMemberStatuses.2.label', 'JO')
            ->where('year.reportData.gfpsMemberStatuses.2.female', 4)
            ->where('year.reportData.gfpsMemberStatuses.2.male', 6)
            ->etc()
        );
});

test('the membership total is left alone by the per-status breakdown', function () {
    // The two are entered independently and are allowed to disagree; nothing
    // here derives one from the other.
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $reportYear->gfpsMembershipSummary()->create(['female_count' => 22, 'male_count' => 6]);

    GfpsMemberStatusBreakdown::query()->create([
        'report_year_id' => $reportYear->id,
        'employment_status_id' => memberStatus('plantilla')->id,
        'female_count' => 1,
        'male_count' => 1,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('year.reportData.gfpsMembership.femaleCount', 22)
            ->where('year.reportData.gfpsMembership.maleCount', 6)
            ->etc()
        );
});

test('the edit screen is given zero filled rows and the ability to write them', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);

    $this->actingAs($this->admin)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('abilities.updateGfpsMemberStatuses', true)
            // Three reportable statuses, zero filled so the form always renders.
            ->has('reportYear.gfpsMemberStatuses', 3)
            ->where('reportYear.gfpsMemberStatuses.0.label', 'Plantilla')
            ->where('reportYear.gfpsMemberStatuses.0.femaleCount', 0)
            ->where('reportYear.gfpsMemberStatuses.2.label', 'JO')
            ->etc()
        );
});

test('a role without the section is not offered it on the edit screen', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);
    $rstl = User::factory()->create(['role' => UserRole::RSTL]);

    $this->actingAs($rstl)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('abilities.updateGfpsMemberStatuses', false)
            ->etc()
        );
});
