<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Normalises the configured trusted-proxy list for TrustProxies.
 *
 * Trusting a proxy means believing its X-Forwarded-For header, which is what
 * `$request->ip()` reports. Trust the wrong thing and a caller can name any
 * client IP it likes, so this list should be as narrow as the deployment allows.
 */
class TrustedProxies
{
    /**
     * @return string|list<string>
     */
    public static function parse(mixed $configured): string|array
    {
        // '*' trusts every upstream hop. Only correct when the app is reachable
        // exclusively through a proxy that overwrites X-Forwarded-For itself.
        if (is_string($configured) && trim($configured) === '*') {
            return '*';
        }

        $proxies = is_array($configured) ? $configured : explode(',', is_string($configured) ? $configured : '');

        return array_values(array_filter(
            array_map(static fn (mixed $proxy): string => trim((string) $proxy), $proxies),
            static fn (string $proxy): bool => $proxy !== '',
        ));
    }
}
