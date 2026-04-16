<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin is redirected to report years after login', function () {
    $user = User::factory()->create([
        'is_admin' => true,
        'password' => 'password',
    ]);

    $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ])->assertRedirect(route('report-years.index'));
});

test('non-admin is redirected to home after login', function () {
    $user = User::factory()->create([
        'is_admin' => false,
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

test('login rejects unknown username with generic message', function () {
    $this->post(route('login.store'), [
        'username' => 'nonexistent_user_xyz',
        'password' => 'password',
    ])->assertSessionHasErrors('username');
});

test('login rejects password longer than 255 characters', function () {
    $this->post(route('login.store'), [
        'username' => 'someuser',
        'password' => str_repeat('a', 256),
    ])->assertSessionHasErrors('password');
});

test('login ignores off-site url intended in session', function () {
    $user = User::factory()->create([
        'is_admin' => false,
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
        'is_admin' => false,
        'password' => 'password',
    ]);

    $this->withSession(['url.intended' => '/settings/appearance'])
        ->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ])
        ->assertRedirect(route('settings.appearance'));
});

test('login redirects to safe same-host url intended', function () {
    config(['app.url' => 'http://localhost']);

    $user = User::factory()->create([
        'is_admin' => false,
        'password' => 'password',
    ]);

    $this->withSession(['url.intended' => 'http://localhost/settings/appearance'])
        ->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ])
        ->assertRedirect('http://localhost/settings/appearance');
});
