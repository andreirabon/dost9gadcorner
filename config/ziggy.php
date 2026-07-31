<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ziggy Route Groups
    |--------------------------------------------------------------------------
    |
    | Guest-facing pages receive only the routes they need for client-side URL
    | generation. Authenticated users receive the full named route list.
    |
    | Only groups the application actually selects belong here — see
    | HandleInertiaRequests::resolveZiggyGroup() and app.blade.php. Two staff
    | groups previously sat here unreferenced and had drifted out of date
    | (report-years.toggle-lock and every settings.* route were missing), so
    | switching either on would have broken those pages at runtime.
    |
    */

    'groups' => [
        'guest' => [
            'index',
            'login',
            'login.store',
            'reports.show',
        ],
    ],

];
