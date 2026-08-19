import { expect, test, type Page } from '@playwright/test';

/**
 * Covers the report-year edit screen after it was split from one 1854-line file
 * into a shell plus seven section components. Static tooling cannot see whether
 * the panels still render, the totals still recompute, or the notice line the
 * sections now emit into still reaches the page shell.
 */

/**
 * These run already signed in: `auth.setup.ts` authenticates once as the
 * dedicated TESTER account and every browser project reuses that session, so
 * the rate-limited login route is hit once per run rather than once per test.
 *
 * TESTER can edit every data section but cannot publish, delete, or lock a
 * report year, so a runaway run cannot destroy data.
 */
test.skip(process.env.E2E_PASSWORD === undefined || process.env.E2E_PASSWORD === '', 'E2E_PASSWORD is not set; skipping authenticated tests.');

/**
 * `marker` is text the panel genuinely renders. Panels have no headings of
 * their own — the tab bar names the section — so each one is identified by its
 * own save button, which is unique per section and always present.
 */
const TABS = [
    { name: 'Metadata', panel: 'panel-metadata', marker: 'Save metadata' },
    { name: 'GFPS Membership', panel: 'panel-gfps_membership', marker: 'Save GFPS membership' },
    // Scholarship has no always-visible save button: its save lives inside the
    // add-snapshot form, which is collapsed until opened.
    { name: 'Scholarship', panel: 'panel-scholarship', marker: 'Add New Snapshot' },
    { name: 'Scholarship Applicants', panel: 'panel-scholarship_applicants', marker: 'Save scholarship applicants' },
    { name: 'GFPS Assemblies', panel: 'panel-gfps_assemblies', marker: 'Save assemblies' },
    { name: 'Employee Status', panel: 'panel-employee_status', marker: 'Save employee status' },
    { name: 'RSTL', panel: 'panel-rstl_monthly', marker: 'Save RSTL' },
    { name: 'SETUP', panel: 'panel-setup_funding', marker: 'Save SETUP program funding' },
    { name: 'CEST', panel: 'panel-cest_funding', marker: 'Save CEST program funding' },
];

/**
 * Locates a section tab by its visible label.
 *
 * Each tab button also carries a visually-hidden completion suffix for screen
 * readers ("Metadata — complete", "RSTL — partly entered"), so its accessible
 * name is never the bare label and an exact match can never hit. Anchoring to
 * the start keeps the match unambiguous without depending on that suffix,
 * which changes as data is entered.
 */
function tabByName(page: Page, name: string) {
    // Anchored at both ends of the visible label: a bare `\b` would let
    // "Scholarship" also match "Scholarship Applicants". The suffix is either
    // the em dash that introduces the status, or the end of the string.
    return page.getByRole('tab', { name: new RegExp(`^${name}(\\s+—|$)`) });
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

        await page.goto('/report-years/1/edit');

        for (const tab of TABS) {
            await tabByName(page, tab.name).click();

            const panel = page.locator(`#${tab.panel}`);
            await expect(panel).toBeVisible();
            await expect(panel).toContainText(tab.marker);
        }

        expect(errors, `page reported errors:\n${errors.join('\n')}`).toEqual([]);
    });

    test('a section with no edits reports back through the shared notice line', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        await tabByName(page, 'GFPS Membership').click();
        await page.getByRole('button', { name: /save gfps membership/i }).click();

        // The section emits 'notice'; the shell owns the element that shows it.
        await expect(page.getByRole('status').filter({ hasText: 'No changes to save.' })).toBeVisible();
    });

    test('membership totals recompute as values are typed', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        await tabByName(page, 'GFPS Membership').click();

        await page.locator('#gfps_female_count').fill('7');
        await page.locator('#gfps_male_count').fill('5');

        // The total is a readonly derived input, so its value is an attribute
        // rather than page text — toContainText can never see it.
        await expect(page.locator('#gfps_total_count')).toHaveValue('12');
    });

    test('an assembly row total recomputes from its own female and male counts', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        await tabByName(page, 'GFPS Assemblies').click();

        const panel = page.locator('#panel-gfps_assemblies');
        const femaleInputs = panel.locator('input[id^="gfps_assembly_female_"]');
        expect(await femaleInputs.count()).toBeGreaterThan(0);

        await femaleInputs.first().fill('2');
        await panel.locator('input[id^="gfps_assembly_male_"]').first().fill('3');

        // Row totals are readonly derived inputs; assert the value, not page text.
        await expect(panel.locator('input[id^="gfps_assembly_total_"]').first()).toHaveValue('5');
    });

    test('SETUP and CEST program funding are separate tabs, not one crowded panel', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        // SETUP tab shows only SETUP content.
        await tabByName(page, 'SETUP').click();
        const setupPanel = page.locator('#panel-setup_funding');
        await expect(setupPanel).toBeVisible();
        await expect(setupPanel).toContainText('SETUP Program');
        await expect(setupPanel).not.toContainText('CEST');

        // CEST tab shows only CEST content, in its own panel.
        await tabByName(page, 'CEST').click();
        const cestPanel = page.locator('#panel-cest_funding');
        await expect(cestPanel).toBeVisible();
        await expect(cestPanel).toContainText('CEST Program');
        await expect(cestPanel).not.toContainText('SETUP');
    });

    test('SETUP tab shows the program metrics as separate tables without a youth column', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        await tabByName(page, 'SETUP').click();

        const panel = page.locator('#panel-setup_funding');
        await expect(panel).toContainText('Funded projects');
        await expect(panel).toContainText('Value of funded projects');
        await expect(panel).toContainText('Training participants');
        await expect(panel).toContainText('Jobs generated');
        await expect(panel).toContainText('Jobs breakdown');
        await expect(panel).toContainText('Person with Disability');
        await expect(panel).toContainText('Senior Citizen');
        await expect(panel).toContainText('Indigenous People');
        await expect(panel).toContainText('Pantawid Pamilyang Pilipino Program');
        await expect(panel).toContainText('Special projects research');
        await expect(panel).not.toContainText('Youth');
    });

    test('program funding flags a jobs male + female mismatch before saving', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        await tabByName(page, 'SETUP').click();

        const panel = page.locator('#panel-setup_funding');
        const totalInput = panel.locator('input[id^="jobs_total_"]').first();
        const maleInput = panel.locator('input[id^="jobs_male_"]').first();
        const femaleInput = panel.locator('input[id^="jobs_female_"]').first();

        await totalInput.fill('100');
        await maleInput.fill('50');
        await femaleInput.fill('40');

        await expect(panel.locator('text=Male + female ≠ total').first()).toBeVisible();

        await femaleInput.fill('50');
        await expect(panel.locator('text=Male + female ≠ total')).toHaveCount(0);
    });

    for (const group of ['SETUP', 'CEST']) {
        test(`${group}: every table on the tab shares one column grid`, async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 1200 });
            await page.goto('/report-years/1/edit');
            await tabByName(page, group).click();

            const panel = page.locator(`#panel-${group.toLowerCase()}_funding`);
            await expect(panel).toBeVisible();

            /*
             * The tab stacks five tables carrying two to four data columns each.
             * Sized per table their label columns landed anywhere from 666px to
             * 1116px, so reading one programme's figures down the tab meant
             * re-finding the column in every block. The grid is declared in CSS,
             * which nothing else in the suite would catch if it regressed.
             */
            const columnEdges = await page.evaluate((panelId) => {
                const root = document.getElementById(panelId);
                return Array.from(root?.querySelectorAll('.report-years-data-head') ?? []).map((head) =>
                    Array.from(head.children).map((cell) => Math.round(cell.getBoundingClientRect().right)),
                );
            }, `panel-${group.toLowerCase()}_funding`);

            expect(columnEdges.length, 'the tab should stack several tables').toBeGreaterThan(1);

            for (const edges of columnEdges) {
                expect(edges, 'every table on the tab must use the same column positions').toEqual(columnEdges[0]);
            }
        });
    }

    test('an amount reads with thousands separators but still saves as a plain number', async ({ page }) => {
        await page.goto('/report-years/1/edit');
        await tabByName(page, 'SETUP').click();

        const panel = page.locator('#panel-setup_funding');
        const amount = panel.locator('input[id^="funding_female_amount_"]').first();

        // Typed raw, it must group the moment focus leaves the field.
        await amount.fill('50000.25');
        await amount.blur();
        await expect(amount).toHaveValue('50,000.25');

        // Focusing must not rewrite the box: doing so would move the caret out
        // from under the user and make select-all-then-type replace nothing.
        await amount.focus();
        await expect(amount).toHaveValue('50,000.25');

        await amount.blur();

        const save = panel.getByRole('button', { name: /save setup program funding/i });

        /*
         * The section only submits fields that changed, so a rerun starting with
         * this value already stored would send nothing. Writing a different value
         * first guarantees the save under test actually reaches the server.
         */
        await amount.fill('1');
        await amount.blur();
        await save.click();
        await expect(save).toBeEnabled();

        await amount.fill('50000.25');
        await amount.blur();
        await expect(amount).toHaveValue('50,000.25');
        await save.click();
        await expect(save).toBeEnabled();

        /*
         * The round trip is the real assertion: a separator reaching the server
         * is rejected as non-numeric, so the stored value would still read 1.
         */
        await page.reload();
        await tabByName(page, 'SETUP').click();
        await expect(panel.locator('input[id^="funding_female_amount_"]').first()).toHaveValue('50,000.25');
    });

    test('keyboard arrows move between tabs', async ({ page }) => {
        await page.goto('/report-years/1/edit');

        const first = tabByName(page, 'Metadata');
        await first.click();
        await first.press('ArrowRight');

        await expect(tabByName(page, 'GFPS Membership')).toHaveAttribute('aria-selected', 'true');
    });
});
