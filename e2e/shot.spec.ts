import { test } from '@playwright/test';

/** Throwaway shots. Delete after use. */
test('public setup', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/reports/1');
    await page.getByRole('tab', { name: /^SETUP\b/ }).click();
    await page.waitForTimeout(1400);
    await page.screenshot({ path: 'test-results/shots/pub-setup.png', fullPage: true });
});

test('public scholarship', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/reports/1');
    await page.getByRole('tab', { name: /^Scholarship\b/ }).click();
    await page.waitForTimeout(1400);
    await page.screenshot({ path: 'test-results/shots/pub-scholarship.png', fullPage: true });
});
