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

        /*
         * The demo report is fabricated data. A production `db:seed --force`
         * must not plant it in a live report year, so it is skipped there;
         * `db:seed --class=ReportYearDemoSeeder` still runs it on purpose.
         */
        if (! app()->environment('production')) {
            $this->call(ReportYearDemoSeeder::class);
        }
    }
}
