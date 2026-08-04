<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('admin/users/Index', [
            'users' => User::query()
                ->select(['id', 'username', 'role'])
                ->orderBy('username')
                ->get(),
        ]);
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $this->authorize('updatePassword', $user);

        $validated = $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update(['password' => $validated['password']]);

        AuditLogger::record($request->user(), 'user.password_reset', "User account: {$user->username}", section: 'Account', column: 'Password');

        return back();
    }
}
