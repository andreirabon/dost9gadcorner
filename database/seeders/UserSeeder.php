<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use RuntimeException;

class UserSeeder extends Seeder
{
    public const PRIMARY_ADMIN_USERNAME = 'ARR';

    public const GAD_STAFF_USERNAME = 'GADStaff';

    public const TESTER_USERNAME = 'e2e-tester';

    /** @var list<array{username: string, role: UserRole}> */
    public const STAFF_ACCOUNTS = [
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
        $adminPassword = $this->requiredPassword('auth.seed.admin_password', 'SEED_ADMIN_PASSWORD');
        $staffPassword = $this->requiredPassword('auth.seed.staff_password', 'SEED_STAFF_PASSWORD');
        $gadStaffPassword = $this->requiredPassword('auth.seed.gadstaff_password', 'SEED_GADSTAFF_PASSWORD');

        $this->seedPrimaryAdministrator($adminPassword);
        $this->seedGadStaffAccount($gadStaffPassword);
        $this->seedStaffAccounts($staffPassword);
        $this->seedTesterAccount();
    }

    /**
     * Account the Playwright specs log in as.
     *
     * Never created in production: an automation account with a shared password
     * has no business existing on a live site. Outside production it is created
     * only when SEED_TESTER_PASSWORD is set, so a developer who has not opted in
     * does not silently gain an extra login.
     */
    private function seedTesterAccount(): void
    {
        if (app()->isProduction()) {
            return;
        }

        $password = config('auth.seed.tester_password');

        if (! is_string($password) || trim($password) === '') {
            return;
        }

        Model::unguarded(function () use ($password): void {
            User::query()->updateOrCreate(
                ['username' => self::TESTER_USERNAME],
                [
                    'password' => $password,
                    'role' => UserRole::TESTER,
                ],
            );
        });
    }

    /**
     * Read a seed password from config, refusing to fall back to a default.
     *
     * A missing value is a deployment mistake, not something to paper over: any
     * default here would become a publicly known production credential.
     */
    private function requiredPassword(string $configKey, string $envKey): string
    {
        $password = config($configKey);

        if (! is_string($password) || trim($password) === '') {
            throw new RuntimeException("{$envKey} is not set. Add it to .env before seeding accounts.");
        }

        return $password;
    }

    private function seedPrimaryAdministrator(string $password): void
    {
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

    private function seedGadStaffAccount(string $password): void
    {
        Model::unguarded(function () use ($password): void {
            User::query()->updateOrCreate(
                ['username' => self::GAD_STAFF_USERNAME],
                [
                    'password' => $password,
                    'role' => UserRole::GAD,
                ],
            );
        });
    }

    private function seedStaffAccounts(string $password): void
    {
        Model::unguarded(function () use ($password): void {
            foreach (self::STAFF_ACCOUNTS as $row) {
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
