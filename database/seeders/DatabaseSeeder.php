<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ReportLookupSeeder::class);
        $this->call(ReportYear2025Seeder::class);

        // User::factory(10)->create();

        $user = User::query()->updateOrCreate(
            ['email' => 'dost9misgad@gmail.com'],
            [
                'name' => 'Administrator',
                'username' => 'aubreyaaagad',
                'password' => 'Dost9MisGad2026',
            ],
        );

        $user->forceFill(['is_admin' => true])->save();
    }
}
