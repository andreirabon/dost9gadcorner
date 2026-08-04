<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('ARR can view the user management page', function () {
    $arr = User::factory()->create(['username' => 'ARR', 'role' => UserRole::ADMINISTRATOR]);
    User::factory()->create(['username' => 'GADStaff', 'role' => UserRole::GAD]);

    $this->actingAs($arr)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/users/Index')
            ->has('users', 2)
        );
});

test('non-ARR administrator cannot view the user management page', function () {
    $otherAdmin = User::factory()->create(['username' => 'NotARR', 'role' => UserRole::ADMINISTRATOR]);

    $this->actingAs($otherAdmin)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

test('gad staff cannot view the user management page', function () {
    $gadStaff = User::factory()->create(['username' => 'GADStaff', 'role' => UserRole::GAD]);

    $this->actingAs($gadStaff)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

test('ARR can reset another user\'s password', function () {
    $arr = User::factory()->create(['username' => 'ARR', 'role' => UserRole::ADMINISTRATOR]);
    $target = User::factory()->create(['username' => 'GADStaff', 'role' => UserRole::GAD]);

    $this->actingAs($arr)
        ->patch(route('admin.users.password.update', $target), [
            'password' => 'a-new-strong-password1',
            'password_confirmation' => 'a-new-strong-password1',
        ])
        ->assertRedirect();

    expect(Hash::check('a-new-strong-password1', $target->fresh()->password))->toBeTrue();

    $this->assertDatabaseHas('audit_logs', [
        'actor_username' => 'ARR',
        'action' => 'user.password_reset',
        'section' => 'Account',
        'column' => 'Password',
        'item_label' => "User account: {$target->username}",
    ]);
});

test('non-ARR user cannot reset another user\'s password', function () {
    $gadStaff = User::factory()->create(['username' => 'GADStaff', 'role' => UserRole::GAD]);
    $target = User::factory()->create(['username' => 'ScholarshipStaff', 'role' => UserRole::SCHOLARSHIP]);

    $this->actingAs($gadStaff)
        ->patch(route('admin.users.password.update', $target), [
            'password' => 'a-new-strong-password1',
            'password_confirmation' => 'a-new-strong-password1',
        ])
        ->assertForbidden();
});
