<?php

use App\Models\EmploymentStatus;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\ReportYear2025Seeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a production seed creates accounts and lookups but no demo report', function () {
    $this->app['env'] = 'production';

    $this->artisan('db:seed', ['--force' => true])->assertSuccessful();

    expect(User::query()->count())->toBe(count(UserSeeder::STAFF_ACCOUNTS) + 2)
        ->and(EmploymentStatus::query()->count())->toBeGreaterThan(0)
        ->and(ReportYear::query()->where('year', 2025)->exists())->toBeFalse();
});

test('a non-production seed still includes the demo report for local work', function () {
    $this->seed(DatabaseSeeder::class);

    expect(ReportYear::query()->where('year', 2025)->exists())->toBeTrue();
});

test('the demo seeder can still be run explicitly in production if wanted', function () {
    $this->app['env'] = 'production';

    $this->artisan('db:seed', ['--class' => ReportYear2025Seeder::class, '--force' => true])
        ->assertSuccessful();

    expect(ReportYear::query()->where('year', 2025)->exists())->toBeTrue();
});
