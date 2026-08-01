<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;

uses(RefreshDatabase::class);

beforeEach(function () {
    RateLimiter::clear('');
});

test('login post is throttled even when validation always fails', function () {
    // Malformed usernames never reach the credential throttle in LoginRequest,
    // so only the route throttle can stop this.
    for ($attempt = 0; $attempt < 10; $attempt++) {
        $this->post(route('login.store'), [
            'username' => 'bad name!',
            'password' => 'whatever',
        ])->assertStatus(302);
    }

    $this->post(route('login.store'), [
        'username' => 'bad name!',
        'password' => 'whatever',
    ])->assertStatus(429);
});

test('password update is throttled against current password guessing', function () {
    $user = User::factory()->create(['password' => 'password']);

    for ($attempt = 0; $attempt < 6; $attempt++) {
        $this->actingAs($user)->put(route('settings.password.update'), [
            'current_password' => 'guess-'.$attempt,
            'password' => 'NewPassword1',
            'password_confirmation' => 'NewPassword1',
        ])->assertStatus(302);
    }

    $this->actingAs($user)->put(route('settings.password.update'), [
        'current_password' => 'password',
        'password' => 'NewPassword1',
        'password_confirmation' => 'NewPassword1',
    ])->assertStatus(429);
});

test('profile deletion is throttled against current password guessing', function () {
    $user = User::factory()->create(['password' => 'password']);

    for ($attempt = 0; $attempt < 6; $attempt++) {
        $this->actingAs($user)
            ->delete(route('settings.profile.destroy'), ['password' => 'guess-'.$attempt])
            ->assertStatus(302);
    }

    $this->actingAs($user)
        ->delete(route('settings.profile.destroy'), ['password' => 'guess-again'])
        ->assertStatus(429);

    expect(User::whereKey($user->id)->exists())->toBeTrue();
});
