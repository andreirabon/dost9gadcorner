<?php

use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('record stores a denormalized entry tied to the actor', function () {
    $actor = User::factory()->create(['username' => 'ARR', 'role' => UserRole::ADMINISTRATOR]);

    AuditLogger::record($actor, 'user.password_reset', 'User account: GADStaff', ['note' => 'no field diff']);

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $actor->id,
        'actor_username' => 'ARR',
        'actor_role' => 'administrator',
        'action' => 'user.password_reset',
        'item_label' => 'User account: GADStaff',
    ]);

    expect(AuditLog::query()->first()->changes)->toBe(['note' => 'no field diff']);
});

test('record falls back to system when there is no actor', function () {
    AuditLogger::record(null, 'system.seed', 'Database seed');

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => null,
        'actor_username' => 'system',
        'actor_role' => null,
        'action' => 'system.seed',
    ]);
});

test('diff only returns fields that actually changed', function () {
    $before = ['year' => 2025, 'title' => 'Old', 'description' => 'Same'];
    $after = ['year' => 2025, 'title' => 'New', 'description' => 'Same'];

    expect(AuditLogger::diff($before, $after))->toBe([
        'title' => ['old' => 'Old', 'new' => 'New'],
    ]);
});

test('diff treats a missing before value as null', function () {
    expect(AuditLogger::diff([], ['female_count' => 5]))->toBe([
        'female_count' => ['old' => null, 'new' => 5],
    ]);
});

test('created maps every attribute to a null-to-value diff', function () {
    expect(AuditLogger::created(['year' => 2025, 'title' => 'Report']))->toBe([
        'year' => ['old' => null, 'new' => 2025],
        'title' => ['old' => null, 'new' => 'Report'],
    ]);
});

test('removed maps every attribute to a value-to-null diff', function () {
    expect(AuditLogger::removed(['year' => 2025, 'title' => 'Report']))->toBe([
        'year' => ['old' => 2025, 'new' => null],
        'title' => ['old' => 'Report', 'new' => null],
    ]);
});

test('humanizeFields joins humanized keys and returns null for an empty diff', function () {
    expect(AuditLogger::humanizeFields(['female_count' => ['old' => 1, 'new' => 2], 'male_count' => ['old' => 3, 'new' => 4]]))
        ->toBe('Female Count, Male Count')
        ->and(AuditLogger::humanizeFields([]))->toBeNull();
});

test('actionVerb returns added when every prior value was empty', function () {
    expect(AuditLogger::actionVerb(['female_count' => ['old' => 0, 'new' => 12]]))->toBe('added')
        ->and(AuditLogger::actionVerb(['title' => ['old' => null, 'new' => 'New']]))->toBe('added')
        ->and(AuditLogger::actionVerb(['title' => ['old' => '', 'new' => 'New']]))->toBe('added')
        ->and(AuditLogger::actionVerb(['amount' => ['old' => '0.00', 'new' => '12.50']]))->toBe('added');
});

test('actionVerb returns updated when any prior value was real', function () {
    expect(AuditLogger::actionVerb(['female_count' => ['old' => 5, 'new' => 12]]))->toBe('updated')
        ->and(AuditLogger::actionVerb([
            'female_count' => ['old' => 0, 'new' => 12],
            'male_count' => ['old' => 3, 'new' => 4],
        ]))->toBe('updated');
});

test('actionVerb defaults to updated for an empty diff', function () {
    expect(AuditLogger::actionVerb([]))->toBe('updated');
});

test('record stores section, column, and row', function () {
    AuditLogger::record(
        null,
        'rstl_monthly.updated',
        'Report Year 2025',
        ['female_count' => ['old' => 1, 'new' => 2]],
        section: 'RSTL Monthly',
        column: 'Female Count',
        row: 'January',
    );

    $this->assertDatabaseHas('audit_logs', [
        'section' => 'RSTL Monthly',
        'column' => 'Female Count',
        'row' => 'January',
    ]);
});
