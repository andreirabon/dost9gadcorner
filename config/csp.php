<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Content-Security-Policy (production)
    |--------------------------------------------------------------------------
    |
    | When enabled, SecurityHeaders sends a strict CSP on production responses.
    | Non-production environments skip the header so Vite HMR and dev tooling work.
    |
    */

    'enabled' => env('CSP_ENABLED', true),

];
