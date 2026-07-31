<?php

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('user seeder creates primary admin account', function () {
    $this->seed(UserSeeder::class);

    $user = User::query()->where('username', 'ARR')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(UserRole::ADMINISTRATOR)
        ->and(Hash::check(config('auth.seed.admin_password'), $user->password))->toBeTrue();
});

test('primary admin can log in after seeding', function () {
    $this->seed(UserSeeder::class);

    $this->post(route('login.store'), [
        'username' => 'ARR',
        'password' => config('auth.seed.admin_password'),
    ])->assertRedirect(route('report-years.index'));
});

test('user seeder updates existing primary admin password', function () {
    User::factory()->create([
        'username' => 'ARR',
        'password' => 'old-password',
        'role' => UserRole::ADMINISTRATOR,
    ]);

    $this->seed(UserSeeder::class);

    $user = User::query()->where('username', 'ARR')->first();

    expect(Hash::check(config('auth.seed.admin_password'), $user->password))->toBeTrue()
        ->and(Hash::check('old-password', $user->password))->toBeFalse();
});

test('staff account can log in after seeding', function () {
    (new UserSeeder)->run();

    $this->post(route('login.store'), [
        'username' => 'GADStaff',
        'password' => config('auth.seed.staff_password'),
    ])->assertRedirect(route('report-years.index'));
});
