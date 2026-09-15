<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * @return array<string, mixed>
 */
function sharedProps(): array
{
    return test()->get('/')->viewData('page')['props'] ?? [];
}

test('no inspirational quote is computed and shipped on every response', function () {
    // Inspiring::quotes()->random() ran for every request, including partial
    // reloads, and nothing ever rendered the result.
    expect(sharedProps())->not->toHaveKey('quote');
});

test('the props the app actually reads are still shared', function () {
    $props = sharedProps();

    expect($props)->toHaveKeys(['name', 'auth', 'ziggy', 'sidebarOpen']);
});

test('an authenticated user still receives their identity and abilities', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);

    $this->actingAs($user);

    $auth = sharedProps()['auth']['user'];

    expect($auth['username'])->toBe($user->username)
        ->and($auth['role'])->toBe(UserRole::ADMINISTRATOR->value)
        ->and($auth['can'])->toHaveKeys(['accessReportYears', 'createReportYears', 'deleteReportYears']);
});

test('shared abilities match each role', function (UserRole $role, bool $canDelete, bool $canAccess) {
    $this->actingAs(User::factory()->create(['role' => $role]));

    $can = sharedProps()['auth']['user']['can'];

    expect($can['deleteReportYears'])->toBe($canDelete)
        ->and($can['accessReportYears'])->toBe($canAccess)
        ->and($can['manageUsers'])->toBeFalse();
})->with([
    'administrator' => [UserRole::ADMINISTRATOR, true, true],
    'gad' => [UserRole::GAD, true, true],
    'tester' => [UserRole::TESTER, false, true],
    'hr' => [UserRole::HR, false, true],
    'none' => [UserRole::None, false, false],
]);

test('only the primary administrator may manage users', function () {
    $this->actingAs(User::factory()->create(['username' => 'ARR', 'role' => UserRole::ADMINISTRATOR]));

    expect(sharedProps()['auth']['user']['can']['manageUsers'])->toBeTrue();
});
