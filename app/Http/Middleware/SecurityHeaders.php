<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $nonce = base64_encode(random_bytes(16));
        Vite::useCspNonce($nonce);
        view()->share('cspNonce', $nonce);

        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        if ($this->shouldSendContentSecurityPolicy()) {
            $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy($nonce));
        }

        return $response;
    }

    private function shouldSendContentSecurityPolicy(): bool
    {
        if (! config('csp.enabled', true)) {
            return false;
        }

        return !app()->isLocal();
    }

    private function contentSecurityPolicy(string $nonce): string
    {
        $directive = static fn (string $name, string $value): string => "{$name} {$value}";

        $directives = [
            $directive('default-src', "'self'"),
            $directive('script-src', "'self' 'nonce-{$nonce}' https://fonts.googleapis.com"),
            $directive('style-src', "'self' 'nonce-{$nonce}' https://fonts.googleapis.com"),
            $directive('font-src', "'self' https://fonts.gstatic.com data:"),
            $directive('img-src', "'self' data: blob:"),
            $directive('connect-src', "'self'"),
            $directive('frame-ancestors', "'none'"),
            $directive('base-uri', "'self'"),
            $directive('form-action', "'self'"),
            $directive('object-src', "'none'"),
        ];

        return implode('; ', $directives);
    }
}
