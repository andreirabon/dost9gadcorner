<?php

/**
 * Parse a CSP header into directive => value.
 *
 * @return array<string, string>
 */
function cspDirectives(string $header): array
{
    $directives = [];

    foreach (explode(';', $header) as $directive) {
        $directive = trim($directive);

        if ($directive === '') {
            continue;
        }

        [$name, $value] = array_pad(explode(' ', $directive, 2), 2, '');
        $directives[$name] = trim($value);
    }

    return $directives;
}

function homepageCsp(): array
{
    $header = test()->get('/')->headers->get('Content-Security-Policy');

    expect($header)->not->toBeNull();

    return cspDirectives((string) $header);
}

test('the policy allows the inline style attributes the UI actually renders', function () {
    $styleSrc = homepageCsp()['style-src'];

    // Vue :style bindings and ApexCharts both emit inline styles. A nonce cannot
    // cover a style attribute, and its presence makes browsers ignore
    // 'unsafe-inline' — so the nonce must not appear in style-src.
    expect($styleSrc)->toContain("'unsafe-inline'")
        ->and($styleSrc)->not->toContain('nonce-');
});

test('scripts still require a nonce and never allow inline execution', function () {
    $scriptSrc = homepageCsp()['script-src'];

    expect($scriptSrc)->toContain('nonce-')
        ->and($scriptSrc)->not->toContain("'unsafe-inline'")
        ->and($scriptSrc)->not->toContain("'unsafe-eval'");
});

test('the policy keeps its restrictive baseline', function () {
    $csp = homepageCsp();

    expect($csp['default-src'])->toBe("'self'")
        ->and($csp['object-src'])->toBe("'none'")
        ->and($csp['frame-ancestors'])->toBe("'none'")
        ->and($csp['base-uri'])->toBe("'self'")
        ->and($csp['form-action'])->toBe("'self'");
});

test('the policy grants no third party origins', function () {
    $csp = homepageCsp();

    // Google Fonts was dropped from the layout; the allowances outlived it and
    // were widening the policy for hosts nothing loads from.
    // Note: toContain takes multiple needles, not a failure message — passing a
    // message as a second argument silently weakens this to an AND check.
    $offending = array_keys(array_filter(
        $csp,
        fn (string $value): bool => str_contains($value, 'googleapis.com') || str_contains($value, 'gstatic.com'),
    ));

    expect($offending)->toBe([]);
});

test('the usual hardening headers are present', function () {
    $response = $this->get('/');

    expect($response->headers->get('X-Content-Type-Options'))->toBe('nosniff')
        ->and($response->headers->get('X-Frame-Options'))->toBe('DENY')
        ->and($response->headers->get('Referrer-Policy'))->toBe('strict-origin-when-cross-origin');
});

test('no policy is sent locally so Vite dev tooling works', function () {
    app()->detectEnvironment(fn () => 'local');

    expect($this->get('/')->headers->get('Content-Security-Policy'))->toBeNull();
});
