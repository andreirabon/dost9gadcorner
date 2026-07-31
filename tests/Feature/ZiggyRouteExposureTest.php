<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * @return list<string>
 */
function exposedRouteNames(): array
{
    $props = test()->get('/')->viewData('page')['props'] ?? [];

    return array_keys($props['ziggy']['routes'] ?? []);
}

test('a guest only receives the routes the public pages need', function () {
    $routes = exposedRouteNames();

    expect($routes)->toContain('index', 'login', 'login.store', 'reports.show');
});

test('a guest is not handed the report management routes', function () {
    $routes = exposedRouteNames();

    expect($routes)->not->toContain('report-years.index')
        ->and($routes)->not->toContain('report-years.destroy')
        ->and($routes)->not->toContain('report-years.toggle-lock');
});

test('an authenticated user receives every route the edit screen calls', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);

    $this->actingAs($user);

    $routes = exposedRouteNames();

    // toggle-lock was absent from the (unused) staff-reports group. If group
    // narrowing is ever switched on for authenticated users, this is the
    // assertion that catches an incomplete list before it reaches the browser.
    expect($routes)->toContain(
        'report-years.index',
        'report-years.edit',
        'report-years.update',
        'report-years.metadata.update',
        'report-years.destroy',
        'report-years.toggle-lock',
        'report-years.scholarship.store',
        'report-years.scholarship.update',
        'report-years.scholarship.destroy',
        'report-years.gfps-membership.update',
        'report-years.gfps-assemblies.update',
        'report-years.employee-statuses.update',
        'report-years.rstl-monthly.update',
        'report-years.program-funding.update',
        'settings.profile.edit',
        'settings.password.edit',
        'print-report',
        'print-report.generate',
        'logout',
    );
});

test('every configured ziggy group is one the application actually selects', function () {
    $configured = array_keys(config('ziggy.groups', []));

    // A group nobody selects is config that looks authoritative but is never
    // exercised, so an incomplete one is only discovered when it is switched on.
    expect($configured)->toBe(['guest']);
});
