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

test('seeder credentials are not hardcoded anywhere in tracked source', function () {
    $leaked = [];

    exec('git ls-files', $trackedFiles);

    foreach ($trackedFiles as $relativePath) {
        $path = base_path($relativePath);

        if (! is_file($path) || filesize($path) > 2_000_000) {
            continue;
        }

        $contents = (string) file_get_contents($path);

        // Historic plaintext credentials. They must never reappear in the repo.
        if (str_contains($contents, 'UploadIloveYou2026') || str_contains($contents, 'UploadIHateYou2026')) {
            $leaked[] = $relativePath;
        }
    }

    expect($leaked)->toBe([]);
});
