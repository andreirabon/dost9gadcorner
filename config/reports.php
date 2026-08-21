<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Funding Program Scopes
    |--------------------------------------------------------------------------
    |
    | Regional TOS accounts may only edit their own province's funding programs.
    | Map a username to the funding program slugs it is allowed to write.
    |
    | A username absent from this map is unrestricted, as is any administrator.
    | Slugs must match `funding_programs.slug` (see ReportLookupSeeder).
    |
    | This is the single source of truth: the server rejects writes outside a
    | user's scope, and the edit screen hides the same rows from the same list.
    |
    */

    /*
     * Employment statuses the GFPS membership breakdown reports on.
     *
     * A subset of the `employment_statuses` lookup: GFPS membership is reported
     * across these three only, while the DOST IX Employees section keeps using
     * the full lookup. Slugs, so reordering or renaming a status cannot silently
     * change which ones appear here.
     */
    'gfps_member_status_slugs' => ['plantilla', 'cos', 'jo'],

    'funding_program_scopes' => [
        'toszcic' => ['setup-zc-ic', 'cest-zc-ic', 'gia-zc-ic'],
        'toszsp' => ['setup-zsp', 'cest-zsp', 'gia-zsp'],
        'toszds' => ['setup-zds', 'cest-zds', 'gia-zds'],
        'toszdn' => ['setup-zdn', 'cest-zdn', 'gia-zdn'],
    ],

];
