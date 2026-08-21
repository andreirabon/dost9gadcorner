<?php

use App\Enums\UserRole;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\SchoolYear;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\ReportYearDemoSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('user seeder creates admin and all staff accounts', function () {
    (new UserSeeder)->run();

    expect(User::query()->count())->toBe(count(UserSeeder::STAFF_ACCOUNTS) + 2);

    foreach (UserSeeder::STAFF_ACCOUNTS as $account) {
        $user = User::query()->where('username', $account['username'])->first();

        expect($user)->not->toBeNull()
            ->and($user->role)->toBe($account['role'])
            ->and(Hash::check(config('auth.seed.staff_password'), $user->password))->toBeTrue();
    }

    $gadStaff = User::query()->where('username', UserSeeder::GAD_STAFF_USERNAME)->first();

    expect($gadStaff)->not->toBeNull()
        ->and($gadStaff->role)->toBe(UserRole::GAD)
        ->and(Hash::check(config('auth.seed.gadstaff_password'), $gadStaff->password))->toBeTrue();
});

test('database seeder runs all seeders successfully', function () {
    $this->seed(DatabaseSeeder::class);

    expect(User::query()->where('username', UserSeeder::PRIMARY_ADMIN_USERNAME)->exists())->toBeTrue()
        ->and(User::query()->where('username', 'GADStaff')->exists())->toBeTrue()
        ->and(EmploymentStatus::query()->count())->toBeGreaterThan(0)
        ->and(FundingProgram::query()->count())->toBeGreaterThan(0)
        ->and(ReportMonth::query()->count())->toBe(12)
        ->and(SchoolYear::query()->count())->toBeGreaterThan(0)
        ->and(ReportYear::query()->where('year', ReportYearDemoSeeder::YEAR)->exists())->toBeTrue();
});

test('db:seed runs in production when force flag is passed', function () {
    $this->app['env'] = 'production';

    $this->artisan('db:seed', ['--class' => UserSeeder::class, '--force' => true])
        ->assertSuccessful();

    expect(User::query()->where('username', 'GADStaff')->exists())->toBeTrue()
        ->and(User::query()->where('username', UserSeeder::PRIMARY_ADMIN_USERNAME)->exists())->toBeTrue();
});

test('full db:seed runs in production when force flag is passed', function () {
    $this->app['env'] = 'production';

    $this->artisan('db:seed', ['--force' => true])
        ->assertSuccessful();

    // Demo report data is deliberately excluded in production — see DemoDataSeedingTest.
    expect(User::query()->count())->toBe(count(UserSeeder::STAFF_ACCOUNTS) + 2);
});
