<?php

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('user seeder creates primary admin account', function () {
    $this->seed(UserSeeder::class);

    $user = User::query()->where('username', User::PRIMARY_ADMIN_USERNAME)->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::ADMINISTRATOR)
        ->and(Hash::check(config('auth.seed.admin_password'), $user->password))->toBeTrue();
});

test('primary admin can log in after seeding', function () {
    $this->seed(UserSeeder::class);

    $this->post(route('login.store'), [
        'username' => User::PRIMARY_ADMIN_USERNAME,
        'password' => config('auth.seed.admin_password'),
    ])->assertRedirect(route('report-years.index'));
});

test('user seeder updates existing primary admin password', function () {
    User::factory()->create([
        'username' => User::PRIMARY_ADMIN_USERNAME,
        'password' => 'old-password',
        'role' => UserRole::ADMINISTRATOR,
    ]);

    $this->seed(UserSeeder::class);

    $user = User::query()->where('username', User::PRIMARY_ADMIN_USERNAME)->first();

    expect(Hash::check(config('auth.seed.admin_password'), $user->password))->toBeTrue()
        ->and(Hash::check('old-password', $user->password))->toBeFalse();
});

test('staff account can log in after seeding', function () {
    (new UserSeeder)->run();

    $this->post(route('login.store'), [
        'username' => 'ScholarshipStaff',
        'password' => config('auth.seed.staff_password'),
    ])->assertRedirect(route('report-years.index'));
});

test('gad staff account can log in after seeding', function () {
    (new UserSeeder)->run();

    $this->post(route('login.store'), [
        'username' => 'GADStaff',
        'password' => config('auth.seed.gadstaff_password'),
    ])->assertRedirect(route('report-years.index'));
});
