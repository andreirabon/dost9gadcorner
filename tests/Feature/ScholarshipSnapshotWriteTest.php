<?php

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\ScholarshipSummary;
use App\Models\SchoolYear;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->schoolYear = SchoolYear::query()->create(['name' => '2024-2025', 'sort_order' => 1]);
    $this->reportYear = ReportYear::factory()->create(['year' => 2026]);
    $this->user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $this->snapshot = ScholarshipSummary::query()->create([
        'report_year_id' => $this->reportYear->id,
        'school_year_id' => $this->schoolYear->id,
        'as_of_date' => '2025-06-01',
        'female_count' => 10,
        'male_count' => 5,
    ]);
});

/**
 * @return list<string>
 */
function capturedUpdateStatements(callable $work): array
{
    DB::enableQueryLog();
    DB::flushQueryLog();

    $work();

    $queries = array_column(DB::getRawQueryLog(), 'raw_query');
    DB::disableQueryLog();

    return array_values(array_filter(
        $queries,
        fn (string $sql): bool => str_contains(strtolower($sql), 'update')
            && str_contains(strtolower($sql), 'scholarship_summaries'),
    ));
}

test('updating a snapshot writes the row exactly once', function () {
    $updates = capturedUpdateStatements(function () {
        $this->actingAs($this->user)
            ->patch("/report-years/{$this->reportYear->id}/scholarship/{$this->snapshot->id}", [
                'female_count' => 42,
                'expected_updated_at' => $this->snapshot->updated_at->toIso8601String(),
            ])
            ->assertSessionHasNoErrors();
    });

    // Two statements would bump updated_at twice, invalidating the conflict
    // token the client just used and costing an extra round trip.
    expect($updates)->toHaveCount(1);
});

test('updating a snapshot records who edited it and when', function () {
    $this->actingAs($this->user)
        ->patch("/report-years/{$this->reportYear->id}/scholarship/{$this->snapshot->id}", [
            'female_count' => 42,
            'expected_updated_at' => $this->snapshot->updated_at?->toIso8601String(),
        ])
        ->assertSessionHasNoErrors();

    $fresh = $this->snapshot->fresh();

    expect($fresh->female_count)->toBe(42)
        ->and($fresh->last_edited_by)->toBe($this->user->id)
        ->and($fresh->last_edited_at)->not->toBeNull();
});

test('creating a snapshot records who added it and when', function () {
    $this->actingAs($this->user)
        ->post("/report-years/{$this->reportYear->id}/scholarship", [
            'school_year_id' => $this->schoolYear->id,
            'as_of_date' => '2025-07-01',
            'female_count' => 3,
            'male_count' => 4,
        ])
        ->assertSessionHasNoErrors();

    $created = ScholarshipSummary::query()
        ->where('report_year_id', $this->reportYear->id)
        ->latest('id')
        ->firstOrFail();

    // Without this the history shows a blank editor for every created row,
    // while edited rows show a name — the column looks broken rather than empty.
    expect($created->last_edited_by)->toBe($this->user->id)
        ->and($created->last_edited_at)->not->toBeNull();
});

test('a created snapshot cannot be attributed to a different user', function () {
    $other = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);

    $this->actingAs($this->user)
        ->post("/report-years/{$this->reportYear->id}/scholarship", [
            'school_year_id' => $this->schoolYear->id,
            'as_of_date' => '2025-07-01',
            'female_count' => 3,
            'male_count' => 4,
            'last_edited_by' => $other->id,
        ])
        ->assertSessionHasNoErrors();

    $created = ScholarshipSummary::query()
        ->where('report_year_id', $this->reportYear->id)
        ->latest('id')
        ->firstOrFail();

    expect($created->last_edited_by)->toBe($this->user->id);
});

test('the conflict token stays valid for a follow-up edit', function () {
    $this->actingAs($this->user)
        ->patch("/report-years/{$this->reportYear->id}/scholarship/{$this->snapshot->id}", [
            'female_count' => 42,
            'expected_updated_at' => $this->snapshot->updated_at->toIso8601String(),
        ])
        ->assertSessionHasNoErrors();

    // Whatever updated_at the row now carries must be the one a client reading
    // the row back would send. A second write inside the same request would
    // have moved it past the value the response reported.
    $afterFirst = $this->snapshot->fresh();

    $this->actingAs($this->user)
        ->patch("/report-years/{$this->reportYear->id}/scholarship/{$this->snapshot->id}", [
            'male_count' => 7,
            'expected_updated_at' => $afterFirst->updated_at->toIso8601String(),
        ])
        ->assertSessionHasNoErrors();

    expect($this->snapshot->fresh()->male_count)->toBe(7);
});
