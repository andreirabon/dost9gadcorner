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

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        if ($this->shouldSendContentSecurityPolicy()) {
            $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy($nonce));
        }

        return $response;
    }

    private function shouldSendContentSecurityPolicy(): bool
    {
        if (! config('app.csp_enabled', true)) {
            return false;
        }

        return ! app()->isLocal();
    }

    private function contentSecurityPolicy(string $nonce): string
    {
        $directive = static fn (string $name, string $value): string => "{$name} {$value}";

        $directives = [
            $directive('default-src', "'self'"),
            $directive('script-src', "'self' 'nonce-{$nonce}'"),
            // Styles cannot use the nonce: a nonce never applies to a `style`
            // attribute, and its mere presence makes browsers ignore
            // 'unsafe-inline'. Vue :style bindings and ApexCharts both emit
            // inline styles, so a nonce here blocks the sidebar and every chart.
            // style-src-attr would be tighter but Firefox ignores it and falls
            // back to style-src, which reintroduces the breakage.
            $directive('style-src', "'self' 'unsafe-inline'"),
            // Fonts ship in the bundle via @fontsource; Google Fonts was removed
            // from the layout, so its origins no longer belong in the policy.
            $directive('font-src', "'self' data:"),
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
