<?php

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * The TESTER role exists so the Playwright specs can drive every data section
 * without signing in as an administrator. These pin both halves of that
 * bargain: it can edit sections, and it cannot destroy or publish anything.
 */
beforeEach(function () {
    $this->tester = User::factory()->create(['role' => UserRole::TESTER]);
    $this->reportYear = ReportYear::factory()->create(['year' => 2025]);
});

test('tester may edit every data section', function (string $ability) {
    expect($this->tester->can($ability, $this->reportYear))->toBeTrue();
})->with([
    'updateMetadata',
    'updateGfpsMembership',
    'updateGfpsAssemblies',
    'updateScholarship',
    'deleteScholarship',
    'updateEmployeeStatuses',
    'updateRstlMonthly',
    'updateProgramFunding',
]);

test('tester may reach report management', function () {
    expect($this->tester->can('viewAny', ReportYear::class))->toBeTrue()
        ->and($this->tester->can('view', $this->reportYear))->toBeTrue();
});

test('tester may not publish, delete, lock, or create a report year', function (string $ability) {
    // A runaway test run must not be able to destroy data or change what the
    // public site shows, so these stay administrator/GAD territory.
    expect($this->tester->can($ability, $this->reportYear))->toBeFalse();
})->with([
    'update',
    'publish',
    'toggleLock',
    'delete',
]);

test('tester may not create a report year', function () {
    expect($this->tester->can('create', ReportYear::class))->toBeFalse();
});

test('tester can open the report year edit screen', function () {
    $this->actingAs($this->tester)
        ->get("/report-years/{$this->reportYear->id}/edit")
        ->assertSuccessful();
});

test('tester is not seeded in production even when its password is configured', function () {
    // The account is an automation convenience; it has no business existing on
    // a live site, so UserSeeder skips it there regardless of configuration.
    config([
        'auth.seed.admin_password' => 'seeded-admin-password',
        'auth.seed.staff_password' => 'seeded-staff-password',
        'auth.seed.gadstaff_password' => 'seeded-gadstaff-password',
        'auth.seed.tester_password' => 'seeded-tester-password',
    ]);
    app()->detectEnvironment(fn () => 'production');

    (new UserSeeder)->run();

    expect(User::query()->where('username', UserSeeder::TESTER_USERNAME)->exists())->toBeFalse()
        // The rest of the seeder still ran, so absence is the skip, not a crash.
        ->and(User::query()->where('username', UserSeeder::PRIMARY_ADMIN_USERNAME)->exists())->toBeTrue();
});

test('tester is not seeded when its password is unset', function () {
    config([
        'auth.seed.admin_password' => 'seeded-admin-password',
        'auth.seed.staff_password' => 'seeded-staff-password',
        'auth.seed.gadstaff_password' => 'seeded-gadstaff-password',
        'auth.seed.tester_password' => null,
    ]);

    (new UserSeeder)->run();

    expect(User::query()->where('username', UserSeeder::TESTER_USERNAME)->exists())->toBeFalse();
});

test('tester is seeded outside production when its password is set', function () {
    config([
        'auth.seed.admin_password' => 'seeded-admin-password',
        'auth.seed.staff_password' => 'seeded-staff-password',
        'auth.seed.gadstaff_password' => 'seeded-gadstaff-password',
        'auth.seed.tester_password' => 'seeded-tester-password',
    ]);

    (new UserSeeder)->run();

    $tester = User::query()->where('username', UserSeeder::TESTER_USERNAME)->first();

    expect($tester)->not->toBeNull()
        ->and($tester->role)->toBe(UserRole::TESTER);
});
