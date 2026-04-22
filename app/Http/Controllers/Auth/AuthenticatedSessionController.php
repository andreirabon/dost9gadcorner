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
        $default = $user !== null && $user->shouldDefaultLoginToReportYears()
            ? route('report-years.index')
            : route('index');

        $intended = $request->session()->pull('url.intended');

        if ($this->isSafeInternalRedirectTarget($intended)) {
            return redirect()->to($intended);
        }

        return redirect()->to($default);
    }

    /**
     * Only allow post-login redirects to this application (relative paths or same-host URLs).
     * Avoids trusting session-stored full URLs that point off-site (open redirect).
     */
    private function isSafeInternalRedirectTarget(mixed $url): bool
    {
        if (! is_string($url) || $url === '') {
            return false;
        }

        if (str_starts_with($url, '/') && ! str_starts_with($url, '//')) {
            return true;
        }

        $parsed = parse_url($url);
        if ($parsed === false || ! isset($parsed['scheme'], $parsed['host'])) {
            return false;
        }

        if (! in_array(strtolower((string) $parsed['scheme']), ['http', 'https'], true)) {
            return false;
        }

        $appParsed = parse_url((string) config('app.url'));
        if ($appParsed === false || ! isset($appParsed['host'])) {
            return false;
        }

        return strcasecmp((string) $parsed['host'], (string) $appParsed['host']) === 0;
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
