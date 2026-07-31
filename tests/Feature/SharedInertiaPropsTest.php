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
