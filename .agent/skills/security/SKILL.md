---
name: security
description: Practical security for Laravel + Inertia + Vue applications, focusing on preventing vulnerabilities before they reach production.
---

# Security Guidelines

**Focus**: Practical security for Laravel + Inertia + Vue applications.
**Goal**: Prevent vulnerabilities before they reach production.
**Approach**: Defense in depth, fail secure, least privilege, and server-side enforcement.

**Last Updated**: 2026-04-27

## Version Snapshot (Verified Apr 27, 2026)

- PHP 8.3.x (^8.3)
- Laravel 13.6.0
- Inertia Laravel 3.0.6
- @inertiajs/vue3 3.0.3
- Vue 3.5.x (Options API default for new work)
- Tailwind CSS 4.2.4
- Pest 4.6.x

## Documentation-First Workflow (Required)

1. Use Laravel Boost `search-docs` first for Laravel/Inertia/Pest/Tailwind behavior.
2. Use Context7 as supplemental docs for Vue and non-Laravel libraries.
3. If docs and touched-module conventions conflict, follow touched-module conventions and document the trade-off.

## Project Reality Overrides (Highest Priority)

- Runtime wiring is centered in `bootstrap/app.php` and `bootstrap/providers.php`.
- Backend often uses `app/Services/**` classes with `*Class` naming and controller `option` branching.
- Authorization boundaries are commonly route middleware + role checks; policy usage is partial.
- Frontend uses JS-first Vue Options API with Inertia + axios coexistence.
- Security enforcement must always happen on the server, even if UI already hides actions.

## Mandatory Security Checks

Before any merge:

- [ ] No hardcoded secrets, tokens, or passwords.
- [ ] Inputs validated server-side (Form Requests for complex mutations).
- [ ] No SQL injection vectors (parameterized/Eloquent queries only).
- [ ] XSS risks controlled (`v-html` avoided or sanitized).
- [ ] CSRF/session protections preserved on state-changing routes.
- [ ] Authentication and authorization enforced server-side.
- [ ] Mass assignment protections in place (`fillable`/`guarded` + validated writes).
- [ ] File uploads validated for type and size, with safe storage strategy.
- [ ] Rate limiting on login, auth-sensitive, and expensive endpoints.
- [ ] Errors and logs do not expose secrets or internals.
- [ ] `.env` is not committed; `.env.example` has placeholders only.
- [ ] `APP_DEBUG=false` and production-safe config assumptions are preserved.

## Secret Management

### Backend (Laravel/PHP)

```php
// BAD
$apiKey = 'sk-live-123';

// GOOD
$apiKey = config('services.openai.key');
if (! is_string($apiKey) || $apiKey === '') {
    throw new RuntimeException('OpenAI API key is not configured.');
}
Use config(...) in app code.

Use env(...) only in config files.

Never pass secrets in Inertia props, JSON responses, or logs.

Frontend (Vue/JS)
js
// BAD: secret in client bundle
const apiKey = 'sk-live-123';

// GOOD: client-side public value only
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
Treat all VITE_ values as public.

Keep private secrets on the backend only.

Input Validation and Authorization
Form Request Pattern
php
use Illuminate\Foundation\Http\FormRequest;

class StoreMarketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Market::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'end_date' => ['required', 'date', 'after:now'],
        ];
    }
}
Controller Write Pattern
php
public function store(StoreMarketRequest $request): RedirectResponse
{
    Market::query()->create($request->validated());

    return to_route('markets.index');
}
Never use $request->all() for mutation writes.

Apply ownership/tenant checks for every read/write endpoint.

SQL Injection Prevention
php
// BAD
$users = DB::select("SELECT * FROM users WHERE email = '{$email}'");

// GOOD
$users = User::query()->where('email', $email)->get();
Prefer Eloquent/query builder.

If raw query is unavoidable, bind parameters.

Allowlist dynamic sort/filter fields.

XSS Prevention (Blade + Vue)
Blade
php
<h1>{{ $title }}</h1> // escaped
Avoid {!! !!} unless content is trusted and sanitized.

Vue
vue
<template>
    <p>{{ userInput }}</p>
    <div v-if="trustedHtml" v-html="trustedHtml"></div>
</template>
Vue auto-escapes {{ }} output.

Avoid v-html; sanitize strictly if required.

Never compile/render user-provided templates.

CSRF and Session Security
Keep CSRF protection active for state-changing routes.

Avoid GET endpoints with side effects.

Keep secure session settings (secure, http_only, same_site).

For SPA flows, keep CSRF cookie/token flow intact with Inertia/axios defaults.

File Upload Security
php
use Illuminate\Validation\Rules\File;

$request->validate([
    'avatar' => [
        'required',
        File::image()
            ->types(['jpg', 'jpeg', 'png', 'webp'])
            ->max(5 * 1024),
    ],
]);

$path = $request->file('avatar')->store('avatars', 'private');
Validate size and content type server-side.

Prefer generated file names (hashName() / store()).

Store sensitive files outside public access.

Rate Limiting and Abuse Controls
php
Route::middleware(['auth', 'throttle:uploads'])->group(function () {
    Route::post('/uploads/avatar', [ProfileController::class, 'uploadAvatar']);
});
Use stricter limits for unauthenticated and high-cost endpoints.

Protect login, password reset, OTP, and webhook handlers appropriately.

Access Control and IDOR
Validate ownership/tenant scope on every resource access.

Apply policy/middleware checks before data mutation.

Return 403/404 intentionally based on module security design.

Open Redirect, Path Traversal, and SSRF
php
$redirect = (string) $request->input('redirect', '/dashboard');
abort_unless(str_starts_with($redirect, '/') && ! str_starts_with($redirect, '//'), 400);

return redirect()->to($redirect);
Redirect targets: allow relative paths only.

File access: map IDs to approved paths; do not trust user paths.

Outbound requests: allowlist hosts and block private/internal targets.

Error Handling and Logging Security
php
try {
    // ...
} catch (Throwable $exception) {
    Log::error('Market save failed', [
        'user_id' => auth()->id(),
        'message' => $exception->getMessage(),
    ]);

    return back()->withErrors([
        'message' => 'Unable to complete the request.',
    ]);
}
Do not expose stack traces/internal internals to end users.

Do not log passwords, tokens, card numbers, OTPs, or secrets.

Security Testing (Pest)
Add or update tests for:

unauthenticated access,

unauthorized access,

validation failure paths,

ownership/tenant isolation,

sensitive-field exposure prevention.

php
it('forbids updating another users market', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $market = Market::factory()->for($owner, 'creator')->create();

    actingAs($attacker)
        ->patch(route('markets.update', $market), ['name' => 'Changed'])
        ->assertForbidden();
});
Security Audit Commands
bash
# Dependency checks
composer audit
npm audit

# Security-focused searches
rg "->all\(|request\(\)->all\(" app
rg "DB::raw|selectRaw|whereRaw|statement\(" app
rg "v-html|innerHTML" resources/js
rg "APP_DEBUG=(true|1)" ".env" ".env.*"

# Optional checks (only if configured in this branch)
./vendor/bin/phpstan analyse app
npm run lint
npm run type-check

# Tests and formatting
php artisan test --compact --filter=Security
./vendor/bin/pint --dirty --format agent
Pull Request Security Checklist
Before PR
Audit results reviewed (composer audit, npm audit).

Security-sensitive routes/flows tested.

No secrets leaked in diffs, responses, logs, or fixtures.

Validation and authorization checks verified for all new mutations.

During Review
No IDOR, mass assignment, or raw-query injection risk.

v-html and unsafe rendering patterns reviewed.

Upload and redirect flows evaluated for abuse vectors.

Config changes preserve production-safe defaults.

Incident Response (If Critical Vulnerability Found)
Contain immediately (minimal hotfix, block exploit path).

Rotate impacted credentials/tokens.

Invalidate sessions when auth boundary may be compromised.

Add regression tests before closing the issue.

Document root cause and preventive controls.

References
OWASP Top 10

Laravel Security Documentation

Laravel CSRF Documentation

Laravel Validation Documentation

Vue Security Guide

Inertia Authorization

Stack: Laravel 13.6 + PHP 8.3 + Vue 3.5 Options API + Inertia.js 3 + axios + Tailwind CSS 4 + Pest 4

Security is release-blocking quality. Default to deny, validate at server boundaries, and keep remediations small, explicit, and test-backed.
```
