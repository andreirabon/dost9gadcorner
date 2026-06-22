<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{

    public function run(): void
    {
        $this->seedPrimaryAdministrator();

        if (app()->environment('local')) {
            $this->seedLocalSampleAccounts();
        }
    }

    private function seedPrimaryAdministrator(): void
    {
        $password = $this->passwordFromEnv('PRIMARY_ADMIN_PASSWORD', 'password');
        $username = env('PRIMARY_ADMIN_USERNAME', 'admin');

        Model::unguarded(function () use ($password, $username): void {
            User::query()->updateOrCreate(
                ['username' => $username],
                [
                    'password' => $password,
                    'role' => UserRole::ADMINISTRATOR,
                ],
            );
        });
    }

    private function seedLocalSampleAccounts(): void
    {
        $password = $this->passwordFromEnv('LOCAL_SAMPLE_PASSWORD', 'password');

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
