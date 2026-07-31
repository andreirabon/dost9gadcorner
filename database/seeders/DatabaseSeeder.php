<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ReportLookupSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(SchoolYearSeeder::class);

        // Demo 2025 report (GFPS, RSTL, scholarship, program funding). Deploys run
        // `db:seed --force`, so this must not be part of a production seed — it
        // would publish invented figures on a live reporting site. Run it there
        // deliberately with `db:seed --class=ReportYear2025Seeder --force`.
        if (! app()->isProduction()) {
            $this->call(ReportYear2025Seeder::class);
        }
    }
}
