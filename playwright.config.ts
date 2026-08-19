import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** This config is ESM, so `__dirname` does not exist; derive it from the module URL. */
const projectDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Reads `KEY=value` lines out of a dotenv-style file.
 *
 * Hand-parsed rather than pulled from dotenv: this is the whole feature needed
 * and it is a few lines of `node:fs`, not worth a dependency.
 *
 * @returns the parsed pairs, or an empty object when the file does not exist.
 */
function readEnvFile(filePath: string): Record<string, string> {
    if (!existsSync(filePath)) {
        return {};
    }

    const values: Record<string, string> = {};

    for (const line of readFileSync(filePath, 'utf8').split('\n')) {
        const trimmed = line.trim();

        if (trimmed === '' || trimmed.startsWith('#')) {
            continue;
        }

        const separator = trimmed.indexOf('=');

        if (separator === -1) {
            continue;
        }

        const key = trimmed.slice(0, separator).trim();
        // Strip one layer of wrapping quotes so passwords with spaces survive.
        const value = trimmed
            .slice(separator + 1)
            .trim()
            .replace(/^(['"])(.*)\1$/, '$2');

        if (key !== '') {
            values[key] = value;
        }
    }

    return values;
}

/**
 * Resolves the credentials the authenticated specs log in with.
 *
 * Precedence, first non-empty wins:
 *   1. a real shell environment variable, so CI injects secrets without a file
 *   2. `playwright.env.local` (gitignored), the normal local setup
 *   3. `SEED_TESTER_PASSWORD` from `.env` (gitignored), so the password can live
 *      in one place rather than being kept in sync across two files
 *
 * These specs log in as the dedicated TESTER account, never an administrator:
 * it can edit sections but cannot publish, delete, or lock a report year. When
 * none of the three yields a password the auth specs skip rather than fail.
 */
function loadE2eCredentials(): void {
    const local = readEnvFile(path.resolve(projectDir, 'playwright.env.local'));
    const appEnv = readEnvFile(path.resolve(projectDir, '.env'));

    const resolved: Record<string, string | undefined> = {
        E2E_USERNAME: local.E2E_USERNAME,
        E2E_PASSWORD: local.E2E_PASSWORD || appEnv.SEED_TESTER_PASSWORD,
        E2E_BASE_URL: local.E2E_BASE_URL,
    };

    for (const [key, value] of Object.entries(resolved)) {
        if (value !== undefined && value !== '' && !process.env[key]) {
            process.env[key] = value;
        }
    }
}

loadE2eCredentials();

/** Where the shared signed-in session is written; gitignored. */
const TESTER_STATE = path.resolve(projectDir, 'playwright/.auth/tester.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Herd serves the app over its own TLS cert, which is not in the CI trust store. */
        baseURL: process.env.E2E_BASE_URL ?? 'https://gadcorner.test',
        ignoreHTTPSErrors: true,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        /*
         * Signs in once and saves the session. Every browser project depends on
         * it, so the rate-limited login route (throttle:10,1) is hit once per
         * run instead of once per test.
         */
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },

        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], storageState: TESTER_STATE },
            dependencies: ['setup'],
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], storageState: TESTER_STATE },
            dependencies: ['setup'],
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], storageState: TESTER_STATE },
            dependencies: ['setup'],
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
