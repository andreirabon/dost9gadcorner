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
        // Demo 2025 report (GFPS, RSTL, scholarship, program funding, etc.). Funding amounts live in that seeder.
        $this->call(ReportYear2025Seeder::class);
        $this->call(UserSeeder::class);
        $this->call(SchoolYearSeeder::class);

    }
}
