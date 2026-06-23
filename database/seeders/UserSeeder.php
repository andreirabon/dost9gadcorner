<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public const PRIMARY_ADMIN_USERNAME = 'ARR';

    public const PRIMARY_ADMIN_PASSWORD = 'UploadIloveYou2026';

    public const STAFF_PASSWORD = 'UploadIHateYou2026';

    /** @var list<array{username: string, role: UserRole}> */
    public const STAFF_ACCOUNTS = [
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

    public function run(): void
    {
        $this->seedPrimaryAdministrator();
        $this->seedStaffAccounts();
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

    private function seedStaffAccounts(): void
    {
        Model::unguarded(function (): void {
            foreach (self::STAFF_ACCOUNTS as $row) {
                User::query()->updateOrCreate(
                    ['username' => $row['username']],
                    [
                        'password' => self::STAFF_PASSWORD,
                        'role' => $row['role'],
                    ],
                );
            }
        });
    }
}
