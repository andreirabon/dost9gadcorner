<?php

namespace App\Providers;

use App\Support\TrustedProxies;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use RuntimeException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production') && class_exists('Laravel\\Boost\\BoostServiceProvider')) {
            throw new RuntimeException(
                'Laravel Boost is a dev dependency and must not be installed in production. Run composer install --no-dev before deploying.'
            );
        }

        // Trust reverse proxies so HTTPS/session cookies work behind nginx, Cloudflare,
        // or a load balancer. Set here rather than in bootstrap/app.php because config
        // is not bound that early, so a cached config would silently fall back to "*".
        //
        // Narrow TRUSTED_PROXIES to the real proxy addresses where you can: a trusted
        // proxy's X-Forwarded-For becomes $request->ip(), and that IP backs the per-IP
        // login throttle in LoginRequest.
        TrustProxies::at(TrustedProxies::parse(config('app.trusted_proxies')));

        $rootUrl = config('app.url');

        if (is_string($rootUrl) && $rootUrl !== '') {
            URL::forceRootUrl($rootUrl);

            if ($this->app->isProduction() && str_starts_with($rootUrl, 'https://')) {
                URL::forceScheme('https');
            }
        }

        // ponytail: minimum bar for password complexity.
        // Upgrade path: ->uncompromised() adds Have I Been Pwned check (needs network).
        Password::defaults(fn () => Password::min(8)->letters()->numbers());
    }
}
