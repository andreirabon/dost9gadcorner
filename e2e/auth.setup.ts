import { expect, test as setup } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Authenticates once and saves the session for every other spec to reuse.
 *
 * The login route is rate limited (`throttle:10,1`), so a suite where each test
 * signs in on its own starts failing as soon as it runs in parallel or is rerun
 * within the minute. Logging in once here keeps the suite under the limit and
 * removes a login round trip from every test.
 *
 * The saved state lands in `playwright/.auth/`, which is gitignored — it holds
 * a live session cookie and must never be committed.
 */
const projectDir = path.dirname(fileURLToPath(import.meta.url));

export const TESTER_STATE = path.resolve(projectDir, '../playwright/.auth/tester.json');

const TESTER_USERNAME = process.env.E2E_USERNAME ?? 'e2e-tester';
const TESTER_PASSWORD = process.env.E2E_PASSWORD ?? '';

setup('authenticate as the e2e tester', async ({ page }) => {
    setup.skip(TESTER_PASSWORD === '', 'E2E_PASSWORD is not set; skipping authenticated tests.');

    await page.goto('/open');
    // Target the inputs by id: /password/i also matches the "Show password" toggle.
    await page.locator('#username').fill(TESTER_USERNAME);
    await page.locator('#password').fill(TESTER_PASSWORD);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    await page.waitForURL(/report-years/, { timeout: 15_000 });
    // Fail loudly here rather than letting every downstream spec time out on a
    // page it was never signed in to.
    await expect(page.getByRole('tablist').or(page.getByRole('table')).first()).toBeVisible();

    await page.context().storageState({ path: TESTER_STATE });
});
