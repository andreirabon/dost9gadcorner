<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): SymfonyResponse
    {
        $inertia = Inertia::render('auth/Login', [
            'status' => $this->safeLoginStatus($request->session()->get('status')),
        ]);

        $response = $inertia->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');
        $response->headers->set('Pragma', 'no-cache');

        return $response;
    }

    /**
     * Session flash `status` is rendered as text on the login page; keep plain string and bounded length.
     */
    private function safeLoginStatus(mixed $status): ?string
    {
        if (! is_string($status) || $status === '') {
            return null;
        }

        return Str::limit(trim(strip_tags($status)), 500, '');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();
        $default = $user !== null && $user->is_admin
            ? route('report-years.index')
            : route('index');

        return redirect()->intended($default);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('index');
    }
}
