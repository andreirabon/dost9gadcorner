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

    'funding_program_scopes' => [
        'toszcic' => ['setup-zc-ic', 'cest-zc-ic'],
        'toszsp' => ['setup-zsp', 'cest-zsp'],
        'toszds' => ['setup-zds', 'cest-zds'],
        'toszdn' => ['setup-zdn', 'cest-zdn'],
    ],

];
