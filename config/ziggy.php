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
    */

    'groups' => [
        'guest' => [
            'index',
            'login',
            'login.store',
            'reports.show',
        ],

        'staff-reports' => [
            'index',
            'logout',
            'print-report',
            'print-report.generate',
            'report-years.index',
            'report-years.create',
            'report-years.store',
            'report-years.edit',
            'report-years.update',
            'report-years.metadata.update',
            'report-years.destroy',
            'report-years.gfps-membership.update',
            'report-years.gfps-assemblies.update',
            'report-years.employee-statuses.update',
            'report-years.scholarship.store',
            'report-years.scholarship.update',
            'report-years.scholarship.destroy',
            'report-years.rstl-monthly.update',
            'report-years.program-funding.update',
        ],

        'staff-settings' => [
            'index',
            'logout',
            'report-years.index',
            'print-report',
            'settings.profile.edit',
            'settings.profile.destroy',
            'settings.password.edit',
            'settings.password.update',
        ],
    ],

];
