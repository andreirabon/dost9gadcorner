<?php

use App\Enums\UserRole;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
});

test('partial rstl patch updates only the provided row and field', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $january = ReportMonth::query()->where('month_number', 1)->firstOrFail();
    $february = ReportMonth::query()->where('month_number', 2)->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 11,
                    'female_led_count' => 0,
                    'male_count' => 0,
                    'male_led_count' => 0,
                ],
                [
                    'report_month_id' => $february->id,
                    'female_count' => 22,
                    'female_led_count' => 0,
                    'male_count' => 0,
                    'male_led_count' => 0,
                ],
            ],
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 99,
                ],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('rstl_monthly_breakdowns', [
        'report_year_id' => $reportYear->id,
        'report_month_id' => $january->id,
        'female_count' => 99,
    ]);

    $this->assertDatabaseHas('rstl_monthly_breakdowns', [
        'report_year_id' => $reportYear->id,
        'report_month_id' => $february->id,
        'female_count' => 22,
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'actor_username' => $user->username,
        'action' => 'rstl_monthly.updated',
        'section' => 'RSTL Monthly',
        'column' => 'Female Count',
        'row' => $january->name,
        'item_label' => "Report Year {$reportYear->year}",
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'actor_username' => $user->username,
        'action' => 'rstl_monthly.added',
        'section' => 'RSTL Monthly',
        'row' => $february->name,
    ]);
});

test('updating multiple report year fields logs a joined column summary', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2025, 'title' => 'Old Title', 'status' => 'pending']);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'year' => 2025,
            'title' => 'New Title',
            'description' => $reportYear->description,
            'status' => 'published',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('audit_logs', [
        'actor_username' => $user->username,
        'action' => 'report_year.updated',
        'section' => 'Report Year',
        'column' => 'Title, Status',
        'row' => null,
        'item_label' => 'New Title',
    ]);
});

test('audit item label falls back to "Report Year {year}" when untitled', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'title' => null, 'status' => 'pending']);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'year' => 2026,
            'status' => 'published',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'report_year.updated',
        'item_label' => 'Report Year 2026',
    ]);
});

test('sequential partial rstl patches from different rows both persist', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $january = ReportMonth::query()->where('month_number', 1)->firstOrFail();
    $february = ReportMonth::query()->where('month_number', 2)->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                    'female_count' => 7,
                ],
            ],
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $february->id,
                    'male_count' => 8,
                ],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('rstl_monthly_breakdowns', [
        'report_year_id' => $reportYear->id,
        'report_month_id' => $january->id,
        'female_count' => 7,
        'male_count' => 0,
    ]);

    $this->assertDatabaseHas('rstl_monthly_breakdowns', [
        'report_year_id' => $reportYear->id,
        'report_month_id' => $february->id,
        'female_count' => 0,
        'male_count' => 8,
    ]);
});

test('partial rstl patch rejects rows without updatable fields', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);
    $january = ReportMonth::query()->where('month_number', 1)->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/rstl-monthly", [
            'breakdowns' => [
                [
                    'report_month_id' => $january->id,
                ],
            ],
        ])
        ->assertSessionHasErrors('breakdowns.0');
});

test('partial gfps membership patch updates only provided fields', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 10,
            'male_count' => 20,
        ])
        ->assertRedirect();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [
            'female_count' => 15,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('gfps_membership_summaries', [
        'report_year_id' => $reportYear->id,
        'female_count' => 15,
        'male_count' => 20,
    ]);
});

test('partial patch rejects empty membership payload', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2025]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/gfps-membership", [])
        ->assertSessionHasErrors('patch');
});
