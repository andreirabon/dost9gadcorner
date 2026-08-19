import { expect, test } from '@playwright/test';

/**
 * Smoke coverage for the pages a signed-out visitor can reach. No credentials
 * needed, so this runs anywhere the app is served.
 */

/**
 * Browser projects default to the shared signed-in session from `auth.setup.ts`.
 * These assertions are about being signed *out* — a logged-in visitor is not
 * redirected to the login page — so the session is discarded here.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test('the homepage renders for a signed-out visitor', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1').first()).toBeVisible();
});

test('the login page is reachable and asks for credentials', async ({ page }) => {
    await page.goto('/open');

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
});

test('report management redirects a guest to the login page', async ({ page }) => {
    await page.goto('/report-years');

    await expect(page).toHaveURL(/\/open$/);
});

test('the favicon is the downscaled icon, not the full-size logo', async ({ page }) => {
    await page.goto('/');

    const href = await page.locator('link[rel="icon"]').getAttribute('href');
    expect(href).toBe('/favicon.png');

    // Regression guard for the 546 kB logo that used to be fetched on every page.
    const response = await page.request.get('/favicon.png');
    expect(response.ok()).toBe(true);
    expect((await response.body()).byteLength).toBeLessThan(100_000);
});

test('the dead font directory is gone', async ({ page }) => {
    const response = await page.request.get('/inter/Inter-VariableFont_opsz,wght.ttf');

    expect(response.status()).toBe(404);
});
