<?php

use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('ARR can view the audit log page', function () {
    $arr = User::factory()->create(['username' => 'ARR', 'role' => UserRole::ADMINISTRATOR]);

    AuditLog::create([
        'actor_id' => $arr->id,
        'actor_username' => 'ARR',
        'actor_role' => 'administrator',
        'action' => 'user.password_reset',
        'item_label' => 'User account: GADStaff',
        'changes' => [],
    ]);

    $this->actingAs($arr)
        ->get(route('admin.audit-logs.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/audit-logs/Index')
            ->has('logs.data', 1)
        );
});

test('non-ARR administrator cannot view the audit log page', function () {
    $otherAdmin = User::factory()->create(['username' => 'NotARR', 'role' => UserRole::ADMINISTRATOR]);

    $this->actingAs($otherAdmin)
        ->get(route('admin.audit-logs.index'))
        ->assertForbidden();
});

test('gad staff cannot view the audit log page', function () {
    $gadStaff = User::factory()->create(['username' => 'GADStaff', 'role' => UserRole::GAD]);

    $this->actingAs($gadStaff)
        ->get(route('admin.audit-logs.index'))
        ->assertForbidden();
});
