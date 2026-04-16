<?php

namespace Database\Seeders;

use App\Models\SchoolYear;
use Illuminate\Database\Seeder;

class SchoolYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SchoolYear::query()->upsert([
            ['name' => '2023-2024', 'sort_order' => 1],
            ['name' => '2024-2025', 'sort_order' => 2],
            ['name' => '2025-2026', 'sort_order' => 3],
            ['name' => '2026-2027', 'sort_order' => 4],
        ], ['name'], ['sort_order']);
    }
}
