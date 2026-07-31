import { expect, test, type Page } from '@playwright/test';

/**
 * Covers the report-year edit screen after it was split from one 1854-line file
 * into a shell plus seven section components. Static tooling cannot see whether
 * the panels still render, the totals still recompute, or the notice line the
 * sections now emit into still reaches the page shell.
 */

/**
 * Credentials come from the environment only — never a default in the repo.
 * Run with: E2E_PASSWORD="$SEED_ADMIN_PASSWORD" npx playwright test
 */
const ADMIN_USERNAME = process.env.E2E_USERNAME ?? 'ARR';
const ADMIN_PASSWORD = process.env.E2E_PASSWORD ?? '';

test.skip(ADMIN_PASSWORD === '', 'E2E_PASSWORD is not set; skipping authenticated tests.');

const TABS = [
    { name: 'Metadata', panel: 'panel-metadata', heading: 'Metadata' },
    { name: 'GFPS Membership', panel: 'panel-gfps_membership', heading: 'GFPS membership' },
    { name: 'Scholarship', panel: 'panel-scholarship', heading: 'Scholarship' },
    { name: 'GFPS Assemblies', panel: 'panel-gfps_assemblies', heading: 'GFPS assemblies' },
    { name: 'Employee Status', panel: 'panel-employee_status', heading: 'Employee status' },
    { name: 'RSTL by Month', panel: 'panel-rstl_monthly', heading: 'RSTL by month' },
    { name: 'Program Funding', panel: 'panel-program_funding', heading: 'Program funding' },
];

async function login(page: Page): Promise<void> {
    await page.goto('/open');
    // Target the inputs by id: /password/i also matches the "Show password" toggle.
    await page.locator('#username').fill(ADMIN_USERNAME);
    await page.locator('#password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForURL(/report-years/, { timeout: 15_000 });
}

/**
 * Collects genuine page errors.
 *
 * Inertia signals a client-side redirect with HTTP 409, which the browser logs
 * as a failed resource load. That is normal protocol traffic on login, not a
 * fault, so it is filtered out rather than allowed to mask real errors.
 */
function trackPageErrors(page: Page): string[] {
    const errors: string[] = [];
    const isInertiaRedirect = (text: string) => text.includes('409');

    page.on('console', (msg) => {
        if (msg.type() === 'error' && !isInertiaRedirect(msg.text())) {
            errors.push(`console: ${msg.text()}`);
        }
    });
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

    return errors;
}

test.describe('report year edit screen', () => {
    test('every section panel renders its own content', async ({ page }) => {
        const errors = trackPageErrors(page);

        await login(page);
        await page.goto('/report-years/1/edit');

        for (const tab of TABS) {
            await page.getByRole('tab', { name: tab.name, exact: true }).click();

            const panel = page.locator(`#${tab.panel}`);
            await expect(panel).toBeVisible();
            await expect(panel).toContainText(tab.heading);
        }

        expect(errors, `page reported errors:\n${errors.join('\n')}`).toEqual([]);
    });

    test('a section with no edits reports back through the shared notice line', async ({ page }) => {
        await login(page);
        await page.goto('/report-years/1/edit');

        await page.getByRole('tab', { name: 'GFPS Membership', exact: true }).click();
        await page.getByRole('button', { name: /save gfps membership/i }).click();

        // The section emits 'notice'; the shell owns the element that shows it.
        await expect(page.getByRole('status').filter({ hasText: 'No changes to save.' })).toBeVisible();
    });

    test('membership totals recompute as values are typed', async ({ page }) => {
        await login(page);
        await page.goto('/report-years/1/edit');

        await page.getByRole('tab', { name: 'GFPS Membership', exact: true }).click();

        await page.locator('#gfps_female_count').fill('7');
        await page.locator('#gfps_male_count').fill('5');

        await expect(page.locator('#panel-gfps_membership')).toContainText('Total members: 12');
    });

    test('assembly column totals recompute across rows', async ({ page }) => {
        await login(page);
        await page.goto('/report-years/1/edit');

        await page.getByRole('tab', { name: 'GFPS Assemblies', exact: true }).click();

        const panel = page.locator('#panel-gfps_assemblies');
        const femaleInputs = panel.locator('input[id^="gfps_assembly_female_"]');
        const count = await femaleInputs.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await femaleInputs.nth(i).fill('2');
        }

        await expect(panel).toContainText(`F: ${count * 2}`);
    });

    test('program funding splits rows into SETUP and CEST groups', async ({ page }) => {
        await login(page);
        await page.goto('/report-years/1/edit');

        await page.getByRole('tab', { name: 'Program Funding', exact: true }).click();

        const panel = page.locator('#panel-program_funding');
        await expect(panel).toContainText('SETUP');
        await expect(panel).toContainText('CEST');
        await expect(panel).toContainText('SETUP totals');
        await expect(panel).toContainText('CEST totals');
    });

    test('keyboard arrows move between tabs', async ({ page }) => {
        await login(page);
        await page.goto('/report-years/1/edit');

        const first = page.getByRole('tab', { name: 'Metadata', exact: true });
        await first.click();
        await first.press('ArrowRight');

        await expect(page.getByRole('tab', { name: 'GFPS Membership', exact: true })).toHaveAttribute('aria-selected', 'true');
    });
});
