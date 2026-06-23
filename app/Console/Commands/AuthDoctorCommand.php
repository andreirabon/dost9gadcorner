<?php

namespace App\Console\Commands;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class AuthDoctorCommand extends Command
{
    protected $signature = 'auth:doctor {--fix : Re-run UserSeeder to reset the primary admin password}';

    protected $description = 'Diagnose login/session issues (run on the production server via SSH)';

    public function handle(): int
    {
        $this->components->info('Auth & session diagnostics');

        $this->line('APP_URL: '.config('app.url'));
        $this->line('APP_ENV: '.config('app.env'));
        $this->line('Session driver: '.config('session.driver'));
        $this->line('Session domain: '.($this->stringOrNull(config('session.domain')) ?? '(empty — correct)'));
        $this->line('Session secure cookie: '.$this->formatBool(config('session.secure')));
        $this->line('Session same_site: '.config('session.same_site'));

        if (! Schema::hasTable('sessions')) {
            $this->components->error('Missing `sessions` table. Run: php artisan migrate --force');

            return self::FAILURE;
        }

        if (config('session.driver') === 'database') {
            $this->line('Sessions in DB: '.(string) Schema::getConnection()->table('sessions')->count());
        }

        if (! Schema::hasTable('users')) {
            $this->components->error('Missing `users` table. Run: php artisan migrate --force');

            return self::FAILURE;
        }

        $users = User::query()->orderBy('username')->get(['id', 'username', 'role']);

        if ($users->isEmpty()) {
            $this->components->warn('No users in database. Run: php artisan db:seed --class=UserSeeder --force');
        } else {
            $this->table(
                ['id', 'username', 'role'],
                $users->map(fn (User $user) => [
                    $user->id,
                    $user->username,
                    $user->role?->value ?? '—',
                ])->all(),
            );
        }

        $admin = User::query()->where('username', UserSeeder::PRIMARY_ADMIN_USERNAME)->first();

        if ($admin === null) {
            $this->components->warn('Primary admin "'.UserSeeder::PRIMARY_ADMIN_USERNAME.'" not found.');
        } elseif (Hash::check(UserSeeder::PRIMARY_ADMIN_PASSWORD, $admin->password)) {
            $this->components->info('Primary admin password matches seeder (UploadIloveYou2026).');
        } else {
            $this->components->error('Primary admin exists but password does NOT match seeder.');
            $this->line('Run: php artisan auth:doctor --fix');
        }

        if ($this->option('fix')) {
            $this->call('db:seed', ['--class' => UserSeeder::class, '--force' => true]);
            $this->components->info('UserSeeder completed.');
        }

        if (config('session.domain') === 'null') {
            $this->components->error('SESSION_DOMAIN is the literal string "null" — browsers will reject the session cookie.');
            $this->line('Set SESSION_DOMAIN= (empty) in .env, then: php artisan config:clear && php artisan config:cache');
        }

        return self::SUCCESS;
    }

    private function stringOrNull(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        return $value;
    }

    private function formatBool(mixed $value): string
    {
        if ($value === null) {
            return 'auto (from request HTTPS)';
        }

        return $value ? 'true' : 'false';
    }
}
