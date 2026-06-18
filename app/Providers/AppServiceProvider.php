<?php

namespace App\Providers;

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

        // ponytail: minimum bar for password complexity.
        // Upgrade path: ->uncompromised() adds Have I Been Pwned check (needs network).
        Password::defaults(fn () => Password::min(8)->letters()->numbers());
    }
}

