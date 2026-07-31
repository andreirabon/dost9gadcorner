<?php

use App\Support\TrustedProxies;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * The value the real request pipeline will trust, as applied during boot.
 *
 * TrustProxies::at() writes to this static, and the middleware falls back to it
 * for every request, so it is what actually decides $request->ip().
 */
function resolvedTrustedProxies(): mixed
{
    $property = (new ReflectionClass(TrustProxies::class))->getProperty('alwaysTrustProxies');
    $property->setAccessible(true);

    return $property->getValue();
}

test('trusted proxies come from configuration rather than a hardcoded wildcard', function () {
    expect(resolvedTrustedProxies())->toBe(TrustedProxies::parse(config('app.trusted_proxies')));
});

test('trusted proxy configuration is readable at bootstrap time', function () {
    expect(config('app.trusted_proxies'))->not->toBeNull();
});

test('a comma separated proxy list is parsed into individual entries', function () {
    expect(TrustedProxies::parse('10.0.0.1, 10.0.0.2'))->toBe(['10.0.0.1', '10.0.0.2']);
});

test('a wildcard proxy value is passed through untouched', function () {
    expect(TrustedProxies::parse('*'))->toBe('*');
});

test('an empty proxy value trusts nothing', function () {
    expect(TrustedProxies::parse(''))->toBe([])
        ->and(TrustedProxies::parse(null))->toBe([]);
});

test('blank entries in a proxy list are discarded', function () {
    expect(TrustedProxies::parse('10.0.0.1,,  ,10.0.0.2'))->toBe(['10.0.0.1', '10.0.0.2']);
});

test('an array of proxies is accepted as given', function () {
    expect(TrustedProxies::parse(['10.0.0.1', '10.0.0.2']))->toBe(['10.0.0.1', '10.0.0.2']);
});

/**
 * The reason this setting matters: $request->ip() backs the per-IP login throttle,
 * so a caller who can dictate it can rotate past that limit at will.
 */
describe('client IP spoofing', function () {
    beforeEach(function () {
        Route::middleware('web')->get('/__test_client_ip', fn (Request $request) => $request->ip());
    });

    afterEach(function () {
        TrustProxies::flushState();
    });

    it('believes a forwarded client IP when every proxy is trusted', function () {
        TrustProxies::at('*');

        $this->get('/__test_client_ip', ['X-Forwarded-For' => '203.0.113.9'])
            ->assertOk()
            ->assertSee('203.0.113.9');
    });

    it('ignores a forwarded client IP when no proxy is trusted', function () {
        TrustProxies::at([]);

        $response = $this->get('/__test_client_ip', ['X-Forwarded-For' => '203.0.113.9']);

        $response->assertOk();
        expect($response->getContent())->not->toBe('203.0.113.9');
    });

    it('ignores a forwarded client IP sent by an untrusted proxy', function () {
        TrustProxies::at(['198.51.100.7']);

        $response = $this->get('/__test_client_ip', ['X-Forwarded-For' => '203.0.113.9']);

        $response->assertOk();
        expect($response->getContent())->not->toBe('203.0.113.9');
    });
});
