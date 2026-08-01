<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

test('unknown urls render the branded inertia error page', function () {
    $this->get('/this-route-does-not-exist')
        ->assertStatus(404)
        ->assertInertia(fn ($page) => $page
            ->component('Error')
            ->where('status', 404)
        );
});

test('unpublished report years render the error page rather than leaking existence', function () {
    $this->get('/reports/999999')
        ->assertStatus(404)
        ->assertInertia(fn ($page) => $page->component('Error')->where('status', 404));
});

test('guests hitting an authenticated page are redirected, not shown a 401 page', function () {
    $this->get(route('report-years.index'))->assertRedirect(route('login'));
});

test('forbidden actions render the error page with a 403 status', function () {
    $user = User::factory()->create(['role' => UserRole::None]);

    $this->actingAs($user)
        ->get(route('report-years.index'))
        ->assertStatus(403)
        ->assertInertia(fn ($page) => $page->component('Error')->where('status', 403));
});

test('method not allowed renders the error page', function () {
    $this->put(route('index'))
        ->assertStatus(405)
        ->assertInertia(fn ($page) => $page->component('Error')->where('status', 405));
});

test('throttled requests render the error page', function () {
    for ($attempt = 0; $attempt < 11; $attempt++) {
        $response = $this->post(route('login.store'), [
            'username' => 'bad name!',
            'password' => 'whatever',
        ]);
    }

    $response->assertStatus(429)
        ->assertInertia(fn ($page) => $page->component('Error')->where('status', 429));
});

test('server errors render the error page without leaking the exception when debug is off', function () {
    config(['app.debug' => false]);

    Route::get('/boom-test-route', function (): never {
        throw new RuntimeException('secret database credential detail');
    })->middleware('web');

    $response = $this->get('/boom-test-route');

    $response->assertStatus(500)
        ->assertInertia(fn ($page) => $page->component('Error')->where('status', 500));

    expect($response->getContent())->not->toContain('secret database credential detail');
});

test('json clients get a json error body, not an inertia page', function () {
    $this->getJson('/this-route-does-not-exist')
        ->assertStatus(404)
        ->assertJsonStructure(['message']);
});

test('error page props never carry an exception message', function () {
    $this->get('/this-route-does-not-exist')
        ->assertInertia(fn ($page) => $page->missing('message')->missing('exception'));
});
