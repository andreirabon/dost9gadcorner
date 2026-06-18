<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('logout redirects to login', function () {
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('login'));
});

test('user with report access is redirected to report years after login', function (UserRole $role) {
    $user = User::factory()->create([
        'role' => $role,
        'password' => 'password',
    ]);

    $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ])->assertRedirect(route('report-years.index'));
})->with([
    UserRole::ADMINISTRATOR,
    UserRole::SCHOLARSHIP,
]);

test('non-admin is redirected to home after login', function () {
    $user = User::factory()->create([
        'role' => UserRole::None,
        'password' => 'password',
    ]);

    $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ])->assertRedirect(route('index'));
});

test('login rejects invalid username format', function () {
    $this->post(route('login.store'), [
        'username' => 'bad name!',
        'password' => 'password',
    ])->assertSessionHasErrors('username');
});

test('login silently redirects on unknown username with no error revealed', function () {
    $this->post(route('login.store'), [
        'username' => 'nonexistent_user_xyz',
        'password' => 'password',
    ])->assertRedirect(route('login'))
      ->assertSessionHasNoErrors();
});

test('login rejects password longer than 255 characters', function () {
    $this->post(route('login.store'), [
        'username' => 'someuser',
        'password' => str_repeat('a', 256),
    ])->assertSessionHasErrors('password');
});

test('login ignores off-site url intended in session', function () {
    $user = User::factory()->create([
        'role' => UserRole::None,
        'password' => 'password',
    ]);

    $this->withSession(['url.intended' => 'https://evil.example/phish'])
        ->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ])
        ->assertRedirect(route('index'));
});

test('login redirects to safe relative url intended', function () {
    $user = User::factory()->create([
        'role' => UserRole::None,
        'password' => 'password',
    ]);

    $this->withSession(['url.intended' => '/settings/profile'])
        ->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ])
        ->assertRedirect(route('settings.profile.edit'));
});

test('login redirects to safe same-host url intended', function () {
    config(['app.url' => 'http://localhost']);

    $user = User::factory()->create([
        'role' => UserRole::None,
        'password' => 'password',
    ]);

    $this->withSession(['url.intended' => 'http://localhost/settings/profile'])
        ->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ])
        ->assertRedirect('http://localhost/settings/profile');
});
