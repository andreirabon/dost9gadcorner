<?php

use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
});

test('stale metadata save is rejected with conflict error', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $originalUpdatedAt = $reportYear->updated_at->toIso8601String();

    // Simulate another user modifying the report year
    $reportYear->title = 'Modified by another user';
    $reportYear->updated_at = now()->addSecond();
    $reportYear->save();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'title' => 'My conflicting title',
            'expected_updated_at' => $originalUpdatedAt,
        ])
        ->assertSessionHasErrors('conflict');
});

test('fresh metadata save succeeds with correct expected_updated_at', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $currentUpdatedAt = $reportYear->updated_at->toIso8601String();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'title' => 'Updated title',
            'expected_updated_at' => $currentUpdatedAt,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('report_years', [
        'id' => $reportYear->id,
        'title' => 'Updated title',
    ]);
});

test('save without expected_updated_at is rejected once the section has a record', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    // Omitting the field asserts "nothing was saved here yet", which is false
    // for an existing report year, so it reads as a conflict.
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'title' => 'No conflict check',
        ])
        ->assertSessionHasErrors('conflict');

    $this->assertDatabaseMissing('report_years', [
        'id' => $reportYear->id,
        'title' => 'No conflict check',
    ]);
});

test('stale gfps membership save is rejected', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    // Create the initial membership record
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 10,
            'male_count' => 20,
        ])
        ->assertRedirect();

    $reportYear->refresh();
    $originalUpdatedAt = $reportYear->gfpsMembershipSummary->updated_at->toIso8601String();

    // Simulate another user modifying membership
    $reportYear->gfpsMembershipSummary->female_count = 50;
    $reportYear->gfpsMembershipSummary->updated_at = now()->addSecond();
    $reportYear->gfpsMembershipSummary->save();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 15,
            'expected_updated_at' => $originalUpdatedAt,
        ])
        ->assertSessionHasErrors('conflict');

    // Original concurrent edit should be preserved
    $this->assertDatabaseHas('gfps_membership_summaries', [
        'report_year_id' => $reportYear->id,
        'female_count' => 50,
    ]);
});

test('first-time gfps membership save succeeds with null expected_updated_at', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 10,
            'male_count' => 20,
            'expected_updated_at' => null,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('gfps_membership_summaries', [
        'report_year_id' => $reportYear->id,
        'female_count' => 10,
        'male_count' => 20,
    ]);
});

test('first-time gfps membership save conflict when record was created by another user', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    // Another user creates the membership first
    $reportYear->gfpsMembershipSummary()->create([
        'female_count' => 99,
        'male_count' => 88,
    ]);

    // Our user still thinks no record exists (expected_updated_at is null)
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 10,
            'expected_updated_at' => null,
        ])
        ->assertSessionHasErrors('conflict');

    // The other user's data should be preserved
    $this->assertDatabaseHas('gfps_membership_summaries', [
        'report_year_id' => $reportYear->id,
        'female_count' => 99,
    ]);
});

test('stale rstl monthly save is rejected for multi-row section', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $january = ReportMonth::query()->where('month_number', 1)->firstOrFail();

    // Create initial RSTL data
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 10,
                    'female_led_count' => 5,
                    'male_count' => 8,
                    'male_led_count' => 3,
                ],
            ],
        ])
        ->assertRedirect();

    $maxUpdatedAt = $reportYear->rstlMonthlyBreakdowns()->max('updated_at');
    $originalUpdatedAt = Carbon::parse($maxUpdatedAt)->toIso8601String();

    // Simulate another user modifying the same data
    $breakdown = $reportYear->rstlMonthlyBreakdowns()
        ->where('report_month_id', $january->id)
        ->first();
    $breakdown->female_count = 77;
    $breakdown->updated_at = now()->addSecond();
    $breakdown->save();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 55,
                ],
            ],
            'expected_updated_at' => $originalUpdatedAt,
        ])
        ->assertSessionHasErrors('conflict');

    // The concurrent edit should be preserved
    $this->assertDatabaseHas('rstl_monthly_breakdowns', [
        'report_year_id' => $reportYear->id,
        'report_month_id' => $january->id,
        'female_count' => 77,
    ]);
});

test('fresh rstl monthly save succeeds for multi-row section', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $january = ReportMonth::query()->where('month_number', 1)->firstOrFail();

    // Create initial data
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 10,
                    'female_led_count' => 5,
                    'male_count' => 8,
                    'male_led_count' => 3,
                ],
            ],
        ])
        ->assertRedirect();

    $maxUpdatedAt = $reportYear->rstlMonthlyBreakdowns()->max('updated_at');
    $currentUpdatedAt = Carbon::parse($maxUpdatedAt)->toIso8601String();

    // Save with the correct timestamp
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 55,
                ],
            ],
            'expected_updated_at' => $currentUpdatedAt,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('rstl_monthly_breakdowns', [
        'report_year_id' => $reportYear->id,
        'report_month_id' => $january->id,
        'female_count' => 55,
    ]);
});

test('metadata update sanitizes HTML tags from title and description', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/metadata", [
            'title' => '<strong>Secure Title</strong>',
            'description' => '<p>Paragraph</p> <strong>Bold</strong> Text',
            'expected_updated_at' => $reportYear->updated_at->toIso8601String(),
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('report_years', [
        'id' => $reportYear->id,
        'title' => 'Secure Title',
        'description' => 'Paragraph Bold Text',
    ]);
});

test('numeric counts above maximum bounds are rejected', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    // Extremely high count exceeding max bound (2147483647)
    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 999999999999,
        ])
        ->assertSessionHasErrors(['female_count']);
});
