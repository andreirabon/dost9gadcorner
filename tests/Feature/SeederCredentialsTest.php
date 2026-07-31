<?php

use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user seeder refuses to run when admin password is not configured', function () {
    config(['auth.seed.admin_password' => null]);

    expect(fn () => (new UserSeeder)->run())
        ->toThrow(RuntimeException::class, 'SEED_ADMIN_PASSWORD');
});

test('user seeder refuses to run when admin password is blank', function () {
    config(['auth.seed.admin_password' => '']);

    expect(fn () => (new UserSeeder)->run())
        ->toThrow(RuntimeException::class, 'SEED_ADMIN_PASSWORD');
});

test('user seeder refuses to run when staff password is not configured', function () {
    config(['auth.seed.staff_password' => null]);

    expect(fn () => (new UserSeeder)->run())
        ->toThrow(RuntimeException::class, 'SEED_STAFF_PASSWORD');
});

/**
 * Read the live seed passwords straight from .env.
 *
 * Deliberately not from config(): phpunit.xml overrides those with dummy values,
 * so the guard would only ever search for the placeholder. Reading .env means no
 * real credential is ever written into this file — the needles are discovered at
 * run time and the test adapts automatically when the passwords are rotated.
 *
 * @return list<string>
 */
function liveSeedPasswords(): array
{
    $envPath = base_path('.env');

    if (! is_file($envPath)) {
        return [];
    }

    $values = [];

    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (! preg_match('/^\s*(SEED_ADMIN_PASSWORD|SEED_STAFF_PASSWORD)\s*=\s*(.*)$/', $line, $matches)) {
            continue;
        }

        $value = trim($matches[2], " \t\"'");

        if ($value !== '') {
            $values[] = $value;
        }
    }

    return $values;
}

test('the configured seeder passwords appear in no tracked file', function () {
    $needles = liveSeedPasswords();

    if ($needles === []) {
        $this->markTestSkipped('No SEED_* passwords set in .env; nothing to check for.');
    }

    $leaked = [];

    exec('git ls-files', $trackedFiles);

    foreach ($trackedFiles as $relativePath) {
        $path = base_path($relativePath);

        if (! is_file($path) || filesize($path) > 2_000_000) {
            continue;
        }

        $contents = (string) file_get_contents($path);

        foreach ($needles as $needle) {
            if (str_contains($contents, $needle)) {
                $leaked[] = $relativePath;

                break;
            }
        }
    }

    expect($leaked)->toBe([]);
});
