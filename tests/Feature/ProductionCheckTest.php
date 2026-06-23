<?php

use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

uses(RefreshDatabase::class);

test('production check passes with seeded admin and built assets', function () {
    $this->seed(UserSeeder::class);

    Artisan::call('production:check');

    expect(Artisan::output())
        ->toContain('Primary admin password')
        ->toContain('matches seeder');
});

test('production check fails when admin user is missing', function () {
    Artisan::call('production:check');

    expect(Artisan::output())->toContain('No users found');
});

test('app url config strips trailing slash from env default', function () {
    expect(rtrim('https://example.com/', '/'))->toBe('https://example.com');
});

test('auth doctor alias runs production check', function () {
    $this->seed(UserSeeder::class);

    Artisan::call('auth:doctor');

    expect(Artisan::output())->toContain('Production readiness check');
});
