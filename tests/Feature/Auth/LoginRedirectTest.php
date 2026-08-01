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

test('login silently redirects when rate limited with no error revealed', function () {
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    for ($attempt = 0; $attempt < 5; $attempt++) {
        $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'wrong-password',
        ])->assertRedirect(route('login'));
    }

    $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ])->assertRedirect(route('login'))
        ->assertSessionHasNoErrors();
});

test('unknown username costs a password verification so timing does not leak account existence', function () {
    $existing = User::factory()->create(['password' => 'password']);

    $measure = function (string $username): float {
        $start = microtime(true);
        $this->post(route('login.store'), [
            'username' => $username,
            'password' => 'wrong-password',
        ]);

        return microtime(true) - $start;
    };

    $knownUserTime = $measure($existing->username);
    $unknownUserTime = $measure('nonexistent_user_xyz');

    // Unknown username must not resolve dramatically faster than a real one.
    expect($unknownUserTime)->toBeGreaterThan($knownUserTime * 0.4);
});

test('session cookie is marked secure when the app env is production', function () {
    $originalEnv = $_ENV['APP_ENV'] ?? null;
    $originalSecure = $_ENV['SESSION_SECURE_COOKIE'] ?? null;

    $_ENV['APP_ENV'] = 'production';
    unset($_ENV['SESSION_SECURE_COOKIE']);

    try {
        $sessionConfig = require config_path('session.php');
    } finally {
        $originalEnv === null ? $_ENV['APP_ENV'] = 'testing' : $_ENV['APP_ENV'] = $originalEnv;

        if ($originalSecure !== null) {
            $_ENV['SESSION_SECURE_COOKIE'] = $originalSecure;
        }
    }

    expect($sessionConfig['secure'])->toBeTrue();
});

test('session cookie is http only and same-site restricted', function () {
    expect(config('session.http_only'))->toBeTrue();
    expect(config('session.same_site'))->toBe('lax');
});

test('guest login page exposes only public ziggy routes', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/Login')
            ->where('ziggy.routes', function ($routes): bool {
                $names = collect($routes)->keys()->sort()->values()->all();

                return $names === ['index', 'login', 'login.store', 'reports.show'];
            })
        );
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
