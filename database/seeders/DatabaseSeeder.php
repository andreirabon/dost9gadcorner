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
        $this->call(ReportYearDemoSeeder::class);

    }
}
