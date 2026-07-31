<?php

namespace App\Console\Commands;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;

class AuthDoctorCommand extends Command
{
    protected $signature = 'production:check {--fix : Re-run UserSeeder (admin + staff) with --force}';

    protected $aliases = ['auth:doctor'];

    protected $description = 'Verify production readiness (auth, sessions, env, assets). Run on the server after deploy.';

    public function handle(): int
    {
        $this->components->info('Production readiness check');

        $failures = 0;

        $failures += $this->checkEnvironment();
        $failures += $this->checkSession();
        $failures += $this->checkDatabase();
        $failures += $this->checkUsers();
        $failures += $this->checkAssets();

        if ($this->option('fix')) {
            $this->call('db:seed', ['--class' => UserSeeder::class, '--force' => true]);
            $this->components->info('UserSeeder completed — admin and staff accounts reset.');
        }

        if ($failures > 0) {
            $this->newLine();
            $this->components->error("{$failures} issue(s) found. Fix the items above, then run:");
            $this->line('  php artisan config:clear && php artisan config:cache');
            $this->line('  php artisan migrate --force');
            $this->line('  php artisan db:seed --force');
            $this->line('  php artisan production:check --fix');

            return self::FAILURE;
        }

        $this->newLine();
        $this->components->info('All checks passed. Account passwords come from SEED_ADMIN_PASSWORD / SEED_STAFF_PASSWORD.');

        return self::SUCCESS;
    }

    private function checkEnvironment(): int
    {
        $this->components->twoColumnDetail('APP_ENV', config('app.env'));
        $this->components->twoColumnDetail('APP_URL', config('app.url'));
        $this->components->twoColumnDetail('APP_DEBUG', config('app.debug') ? 'true' : 'false');

        $failures = 0;

        if (config('app.key') === null || config('app.key') === '') {
            $this->components->error('APP_KEY is missing. Run: php artisan key:generate');
            $failures++;
        }

        if (app()->isProduction() && config('app.debug')) {
            $this->components->error('APP_DEBUG must be false in production.');
            $failures++;
        }

        if (app()->isProduction() && ! config('app.debug')) {
            $this->components->twoColumnDetail('APP_DEBUG (production)', 'ok');
        }

        if (str_ends_with((string) config('app.url'), '/')) {
            $this->components->warn('APP_URL has a trailing slash — config now strips it, but remove it from .env.');
        }

        return $failures;
    }

    private function checkSession(): int
    {
        $this->newLine();
        $this->components->info('Session');

        $this->components->twoColumnDetail('Driver', (string) config('session.driver'));
        $this->components->twoColumnDetail('Domain', $this->formatSessionDomain(config('session.domain')));
        $this->components->twoColumnDetail('Secure cookie', $this->formatBool(config('session.secure')));
        $this->components->twoColumnDetail('SameSite', (string) config('session.same_site'));

        $failures = 0;

        if (config('session.domain') === 'null') {
            $this->components->error('SESSION_DOMAIN is the literal string "null". Set SESSION_DOMAIN= (empty) in .env.');
            $failures++;
        }

        if (app()->isProduction()
            && config('session.secure') === false
            && str_starts_with((string) config('app.url'), 'https://')) {
            $this->components->warn('SESSION_SECURE_COOKIE=false but APP_URL is https — sessions may fail. Remove SESSION_SECURE_COOKIE from .env to auto-detect.');
        }

        return $failures;
    }

    private function checkDatabase(): int
    {
        $this->newLine();
        $this->components->info('Database');

        $failures = 0;

        foreach (['users', 'sessions', 'cache'] as $table) {
            if (! Schema::hasTable($table)) {
                $this->components->error("Missing `{$table}` table. Run: php artisan migrate --force");
                $failures++;
            } else {
                $this->components->twoColumnDetail("Table `{$table}`", 'ok');
            }
        }

        if (config('session.driver') === 'database' && Schema::hasTable('sessions')) {
            $count = Schema::getConnection()->table('sessions')->count();
            $this->components->twoColumnDetail('Sessions stored', (string) $count);
        }

        return $failures;
    }

    private function checkUsers(): int
    {
        $this->newLine();
        $this->components->info('Users & login');

        if (! Schema::hasTable('users')) {
            return 0;
        }

        $failures = 0;
        $users = User::query()->orderBy('username')->get(['id', 'username', 'role']);

        if ($users->isEmpty()) {
            $this->components->error('No users found. Run: php artisan production:check --fix');
            $failures++;

            return $failures;
        }

        $this->table(
            ['id', 'username', 'role'],
            $users->map(fn (User $user) => [
                $user->id,
                $user->username,
                $user->role?->value ?? '—',
            ])->all(),
        );

        $admin = User::query()->where('username', UserSeeder::PRIMARY_ADMIN_USERNAME)->first();

        if ($admin === null) {
            $this->components->error('Primary admin "'.UserSeeder::PRIMARY_ADMIN_USERNAME.'" not found. Run: php artisan production:check --fix');
            $failures++;
        } elseif (! is_string($admin->password) || $admin->password === '') {
            $this->components->error('Primary admin has no password set. Run: php artisan production:check --fix');
            $failures++;
        } else {
            $this->components->twoColumnDetail('Primary admin password', 'set');
        }

        if (app()->isProduction() && $users->count() < count(UserSeeder::STAFF_ACCOUNTS) + 1) {
            $this->components->warn('Expected all seeded staff accounts — run: php artisan db:seed --class=UserSeeder --force');
        }

        return $failures;
    }

    private function checkAssets(): int
    {
        $this->newLine();
        $this->components->info('Frontend assets');

        $failures = 0;
        $hotFile = public_path('hot');
        $manifest = public_path('build/manifest.json');

        if (is_file($hotFile)) {
            if (app()->isProduction()) {
                $this->components->error('public/hot exists — delete it on production (forces Vite dev server).');
                $this->line('  rm public/hot');
                $failures++;
            } else {
                $this->components->twoColumnDetail('public/hot', 'present (ok for local dev — remove before deploy)');
            }
        } else {
            $this->components->twoColumnDetail('public/hot', 'absent (ok)');
        }

        if (! is_file($manifest)) {
            $this->components->error('Missing public/build/manifest.json. Run: npm run build');
            $failures++;
        } else {
            $this->components->twoColumnDetail('Vite manifest', 'present');
        }

        $storageWritable = is_writable(storage_path('framework'));
        if (! $storageWritable) {
            $this->components->error('storage/framework is not writable by the web server.');
            $failures++;
        } else {
            $this->components->twoColumnDetail('storage/framework', 'writable');
        }

        return $failures;
    }

    private function formatSessionDomain(mixed $domain): string
    {
        if (! is_string($domain) || $domain === '') {
            return '(empty — correct)';
        }

        return $domain;
    }

    private function formatBool(mixed $value): string
    {
        if ($value === null) {
            return 'auto (from HTTPS request)';
        }

        return $value ? 'true' : 'false';
    }
}
