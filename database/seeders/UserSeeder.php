<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    private const PRIMARY_ADMIN_USERNAME = 'ARR';

    private const PRIMARY_ADMIN_PASSWORD = 'UploadIloveYou2026';

    private const LOCAL_SAMPLE_PASSWORD = 'UploadIHateYou2026';

    public function run(): void
    {
        $this->seedPrimaryAdministrator();

        if (app()->environment('local')) {
            $this->seedLocalSampleAccounts();
        }
    }

    private function seedPrimaryAdministrator(): void
    {
        Model::unguarded(function (): void {
            User::query()->updateOrCreate(
                ['username' => self::PRIMARY_ADMIN_USERNAME],
                [
                    'password' => self::PRIMARY_ADMIN_PASSWORD,
                    'role' => UserRole::ADMINISTRATOR,
                ],
            );
        });
    }

    private function seedLocalSampleAccounts(): void
    {
        $password = self::LOCAL_SAMPLE_PASSWORD;

        $rows = [
            ['username' => 'GADStaff', 'role' => UserRole::GAD],
            ['username' => 'ScholarshipStaff', 'role' => UserRole::SCHOLARSHIP],
            ['username' => 'HRStaff', 'role' => UserRole::HR],
            ['username' => 'RSTLStaff', 'role' => UserRole::RSTL],
            ['username' => 'TOSStaff', 'role' => UserRole::TOS],
            ['username' => 'toszcic', 'role' => UserRole::TOS],
            ['username' => 'toszsp', 'role' => UserRole::TOS],
            ['username' => 'toszds', 'role' => UserRole::TOS],
            ['username' => 'toszdn', 'role' => UserRole::TOS],
        ];

        Model::unguarded(function () use ($rows, $password): void {
            foreach ($rows as $row) {
                User::query()->updateOrCreate(
                    ['username' => $row['username']],
                    [
                        'password' => $password,
                        'role' => $row['role'],
                    ],
                );
            }
        });
    }
}
