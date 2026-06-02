<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /** Default when `PRIMARY_ADMIN_PASSWORD` is unset (override via `.env` in production). */
    private const DEFAULT_PRIMARY_ADMIN_PASSWORD = 'UploadIloveYou2026';

    /** Default when `LOCAL_SAMPLE_PASSWORD` is unset. */
    private const DEFAULT_LOCAL_SAMPLE_PASSWORD = 'UploadIHateYou2026';

    private const PRIMARY_ADMIN_USERNAME = 'ARR';

    public function run(): void
    {
        $this->seedPrimaryAdministrator();

        if (app()->environment('local')) {
            $this->seedLocalSampleAccounts();
        }
    }

    private function seedPrimaryAdministrator(): void
    {
        $password = $this->passwordFromEnv('PRIMARY_ADMIN_PASSWORD', self::DEFAULT_PRIMARY_ADMIN_PASSWORD);

        Model::unguarded(function () use ($password): void {
            User::query()->updateOrCreate(
                ['username' => self::PRIMARY_ADMIN_USERNAME],
                [
                    'password' => $password,
                    'role' => UserRole::ADMINISTRATOR,
                ],
            );
        });
    }

    private function seedLocalSampleAccounts(): void
    {
        $password = $this->passwordFromEnv('LOCAL_SAMPLE_PASSWORD', self::DEFAULT_LOCAL_SAMPLE_PASSWORD);

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

    private function passwordFromEnv(string $key, string $default): string
    {
        $value = env($key);

        return (is_string($value) && $value !== '') ? $value : $default;
    }
}
