<?php

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\ScholarshipSummary;
use App\Models\SchoolYear;
use App\Models\User;
use App\Support\ReportYearTransformer;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->schoolYear = SchoolYear::query()->create(['name' => '2024-2025', 'sort_order' => 1]);
    $this->reportYear = ReportYear::factory()->create([
        'year' => 2026,
        'status' => ReportYear::STATUS_PUBLISHED,
    ]);
});

/**
 * Insertion order is deliberately not date order: the newest row by id carries
 * a middle date, so an id-only sort and a date sort disagree.
 */
function seedOutOfOrderSnapshots(ReportYear $reportYear, SchoolYear $schoolYear): void
{
    foreach ([
        ['as_of_date' => '2025-01-01', 'female_count' => 11],
        ['as_of_date' => '2025-06-01', 'female_count' => 66],
        ['as_of_date' => '2025-03-01', 'female_count' => 33],
    ] as $row) {
        ScholarshipSummary::query()->create([
            'report_year_id' => $reportYear->id,
            'school_year_id' => $schoolYear->id,
            'male_count' => 0,
            ...$row,
        ]);
    }
}

test('the public report reads the snapshot with the newest as-of date', function () {
    seedOutOfOrderSnapshots($this->reportYear, $this->schoolYear);

    $this->reportYear->load(['scholarshipSnapshots.schoolYear', 'programFundingSummaries']);
    $data = app(ReportYearTransformer::class)->toPublicDetailArray($this->reportYear);

    expect($data['reportData']['scholarship']['asOfDate'])->toBe('2025-06-01')
        ->and($data['reportData']['scholarship']['femaleCount'])->toBe(66);
});

test('scholarship history is ordered by as-of date, newest first', function () {
    seedOutOfOrderSnapshots($this->reportYear, $this->schoolYear);

    $this->reportYear->load(['scholarshipSnapshots.schoolYear', 'programFundingSummaries']);
    $data = app(ReportYearTransformer::class)->toPublicDetailArray($this->reportYear);

    expect(array_column($data['reportData']['scholarshipHistory'], 'asOfDate'))
        ->toBe(['2025-06-01', '2025-03-01', '2025-01-01']);
});

test('snapshots sharing an as-of date fall back to the most recently created', function () {
    $older = ScholarshipSummary::query()->create([
        'report_year_id' => $this->reportYear->id,
        'school_year_id' => $this->schoolYear->id,
        'as_of_date' => '2025-06-01',
        'female_count' => 1,
        'male_count' => 0,
    ]);
    $newer = ScholarshipSummary::query()->create([
        'report_year_id' => $this->reportYear->id,
        'school_year_id' => $this->schoolYear->id,
        'as_of_date' => '2025-06-01',
        'female_count' => 2,
        'male_count' => 0,
    ]);

    expect($newer->id)->toBeGreaterThan($older->id);

    $this->reportYear->load(['scholarshipSnapshots.schoolYear', 'programFundingSummaries']);
    $data = app(ReportYearTransformer::class)->toPublicDetailArray($this->reportYear);

    expect($data['reportData']['scholarship']['id'])->toBe($newer->id)
        ->and($data['reportData']['scholarship']['femaleCount'])->toBe(2);
});

test('an undated snapshot never outranks a dated one', function () {
    ScholarshipSummary::query()->create([
        'report_year_id' => $this->reportYear->id,
        'school_year_id' => $this->schoolYear->id,
        'as_of_date' => '2025-06-01',
        'female_count' => 66,
        'male_count' => 0,
    ]);
    // Created last, so it wins any id-based ordering.
    ScholarshipSummary::query()->create([
        'report_year_id' => $this->reportYear->id,
        'school_year_id' => $this->schoolYear->id,
        'as_of_date' => null,
        'female_count' => 99,
        'male_count' => 0,
    ]);

    $this->reportYear->load(['scholarshipSnapshots.schoolYear', 'programFundingSummaries']);
    $data = app(ReportYearTransformer::class)->toPublicDetailArray($this->reportYear);

    expect($data['reportData']['scholarship']['femaleCount'])->toBe(66);
});

test('the edit screen lists snapshots newest as-of date first', function () {
    seedOutOfOrderSnapshots($this->reportYear, $this->schoolYear);

    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);

    $this->actingAs($user)
        ->get("/report-years/{$this->reportYear->id}/edit")
        ->assertInertia(fn ($page) => $page
            ->where(
                'reportYear.scholarshipSnapshots.0.asOfDate',
                '2025-06-01'
            )
            ->where('reportYear.scholarshipSnapshots.1.asOfDate', '2025-03-01')
            ->where('reportYear.scholarshipSnapshots.2.asOfDate', '2025-01-01'));
});
