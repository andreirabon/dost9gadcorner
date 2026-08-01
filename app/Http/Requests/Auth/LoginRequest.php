<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class LoginRequest extends FormRequest
{
    /**
     * Bcrypt hash of a value nobody can log in with. Verified when the submitted
     * username matches no user, so a missing account costs the same time as a
     * wrong password. Without it, response latency leaks which usernames exist.
     *
     * ponytail: fixed cost-12 hash. If config('hashing.bcrypt.rounds') changes,
     * regenerate this constant so the timings stay matched.
     */
    private const TIMING_EQUALIZER_HASH = '$2y$12$2diMjqt9C.nnW2XRLcozQuBL.QYzQ9kPlNCfDz7/P.5niINGBSx9W';

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9._-]+$/u'],
            'password' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'username.regex' => 'The username may only contain letters, numbers, dots, underscores, and hyphens.',
        ];
    }

    /**
     * Attempt to authenticate. Returns true on success, false on wrong credentials or lockout.
     * Never reveals whether credentials were correct or the account is rate-limited.
     */
    public function authenticate(): bool
    {
        if ($this->isRateLimited()) {
            return false;
        }

        $credentials = $this->only('username', 'password');

        // Burn an equivalent bcrypt verification when the username matches no
        // user, so an attacker cannot distinguish "no such account" from
        // "wrong password" by response time.
        if (Auth::guard('web')->getProvider()->retrieveByCredentials($credentials) === null) {
            Hash::check((string) $this->input('password'), self::TIMING_EQUALIZER_HASH);
        }

        // ponytail: hardcode remember=false — no "remember me" UI exists,
        // so accepting the POST param silently would let attackers persist sessions.
        if (! Auth::attempt($credentials, false)) {
            RateLimiter::hit($this->throttleKey());
            RateLimiter::hit($this->usernameThrottleKey());

            // ponytail: silent fail — no ValidationException thrown.
            // Attacker gets zero feedback on whether username or password was wrong.
            Log::channel('stack')->info('auth.failed_silent', [
                'username' => $this->input('username'),
                'ip' => $this->ip(),
            ]);

            return false;
        }

        RateLimiter::clear($this->throttleKey());
        RateLimiter::clear($this->usernameThrottleKey());

        return true;
    }

    private function isRateLimited(): bool
    {
        // ponytail: two-layer rate limit.
        // Layer 1: per username+ip (5 attempts) — stops one machine hammering.
        // Layer 2: per username only (15 attempts) — stops distributed botnets.
        // Upgrade path: Redis sliding-window if traffic warrants it.
        $perIpExceeded = RateLimiter::tooManyAttempts($this->throttleKey(), 5);
        $perUserExceeded = RateLimiter::tooManyAttempts($this->usernameThrottleKey(), 15);

        if (! $perIpExceeded && ! $perUserExceeded) {
            return false;
        }

        event(new Lockout($this));

        Log::channel('stack')->warning('auth.lockout', [
            'username' => $this->input('username'),
            'ip' => $this->ip(),
            'reason' => $perUserExceeded ? 'username_global' : 'ip',
        ]);

        return true;
    }

    /**
     * Per username+IP throttle key (existing behavior).
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('username')).'|'.$this->ip());
    }

    /**
     * Per username-only throttle key (blocks distributed brute force).
     */
    public function usernameThrottleKey(): string
    {
        return 'login_user|'.Str::transliterate(Str::lower($this->string('username')));
    }
}
