import { expect, test } from '@playwright/test';

/**
 * Layout invariants for the public report page.
 *
 * Every block on this page is a grid of figures, and figures are only
 * comparable when they sit on a shared grid. Each rule below was a real defect:
 * cards whose bottoms went ragged because only some had a meta line, side-by-side
 * charts that sized themselves independently and left one card half empty, and
 * five funding tables that each derived their own column widths so the same
 * reading position landed at a different x in every block.
 *
 * None of it is reachable by unit tests — it only exists once the browser has
 * laid the page out — so it is asserted here.
 */

/** The public report is readable signed out, so drop the shared tester session. */
test.use({ storageState: { cookies: [], origins: [] } });

const PUBLISHED_REPORT = '/reports/1';

const TABS = ['Overview', 'GFPS', 'DOST IX Employees', 'Scholarship', 'RSTL', 'SETUP', 'CEST'] as const;

const DESKTOP = { width: 1440, height: 1200 };

/** Rounded so sub-pixel layout noise does not make the assertions flaky. */
async function bottomEdges(page: import('@playwright/test').Page, selector: string): Promise<number[]> {
    return page.evaluate(
        (sel) => Array.from(document.querySelectorAll(sel)).map((node) => Math.round(node.getBoundingClientRect().bottom)),
        selector,
    );
}

/** Groups values into runs of equal numbers, so multi-row grids are checked per row. */
function distinctValues(values: number[]): number[] {
    return [...new Set(values)];
}

/**
 * Opens a tab and waits for `settleOn` before measuring. Charts are async
 * components and the tab panel swaps in on click, so measuring the moment the
 * click resolves reads a half-built layout.
 */
async function openTab(page: import('@playwright/test').Page, tab: string, settleOn = '.report-view-metric'): Promise<void> {
    await page.setViewportSize(DESKTOP);
    await page.goto(PUBLISHED_REPORT);
    await page.getByRole('tab', { name: new RegExp(`^${tab}\\b`) }).click();
    await expect(page.locator(settleOn).first()).toBeVisible();
}

for (const tab of TABS) {
    test(`${tab}: summary cards and their figures share one baseline`, async ({ page }) => {
        await openTab(page, tab);

        const cardBottoms = await bottomEdges(page, '.report-view-metric');
        const valueBottoms = await bottomEdges(page, '.report-view-metric-value');

        expect(cardBottoms.length, 'tab should render summary cards').toBeGreaterThan(0);
        expect(cardBottoms.length).toBe(valueBottoms.length);

        // A card without a meta line must still end level with one that has it,
        // and its figure must sit on the same baseline.
        const rowCount = distinctValues(cardBottoms).length;
        expect(distinctValues(valueBottoms).length, 'figures must share a baseline within each row').toBe(rowCount);

        // Cards on the same row end together.
        for (const bottom of distinctValues(cardBottoms)) {
            const sameRow = cardBottoms.filter((value) => value === bottom);
            expect(sameRow.length).toBeGreaterThan(0);
        }
    });
}

test('Overview: quick access cards line up row by row', async ({ page }) => {
    await openTab(page, 'Overview');

    const tops = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.report-view-quick-item')).map((node) => Math.round(node.getBoundingClientRect().top)),
    );
    const bottoms = await bottomEdges(page, '.report-view-quick-item');

    expect(tops.length).toBeGreaterThan(1);

    // Cards carrying a percentage line must not end lower than those without.
    expect(distinctValues(tops).length, 'cards should form clean rows').toBe(distinctValues(bottoms).length);
});

test('GFPS: side-by-side charts are the same height', async ({ page }) => {
    await openTab(page, 'GFPS', '.report-view-charts .report-chart-frame');

    // Both frames must exist before either is measured.
    await expect(page.locator('.report-view-charts .report-chart-frame')).toHaveCount(2);

    const frameBottoms = await bottomEdges(page, '.report-view-charts .report-chart-frame');

    expect(distinctValues(frameBottoms), 'paired charts must not size themselves independently').toHaveLength(1);
});

test('Scholarship: the two applicant charts share one axis scale', async ({ page }) => {
    // Stacked full width rather than side by side — the programme names need the
    // room — so these are located by the chart frame, not the two-up grid.
    await openTab(page, 'Scholarship', '.apexcharts-xaxis');
    await expect(page.locator('.report-chart-frame')).toHaveCount(3);

    /*
     * Small multiples only compare honestly on a shared scale. Sized to their own
     * data, the undergraduate chart topped out at 200 and the graduate one at 250,
     * so equal-length bars stood for different totals. The last x-axis tick is the
     * cheapest published proof that both now end at the same number.
     */
    const lastTicks = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.apexcharts-xaxis')).map((axis) => {
            const labels = Array.from(axis.querySelectorAll('text')).map((node) => node.textContent?.trim() ?? '');
            return labels.filter((text) => /^\d+$/.test(text)).pop() ?? '';
        }),
    );

    const ticks = lastTicks.filter((tick) => tick !== '');
    expect(ticks.length, 'both charts should publish a numeric axis').toBe(2);
    expect(new Set(ticks).size, `axis ceilings differ: ${ticks.join(' vs ')}`).toBe(1);
});

for (const group of ['SETUP', 'CEST']) {
    test(`${group}: every funding table uses the same column grid`, async ({ page }) => {
        await openTab(page, group, '.report-view-table');

        const tables = page.locator('.report-view-table');
        expect(await tables.count()).toBeGreaterThan(1);

        const columnEdges = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.report-view-table')).map((table) =>
                Array.from(table.querySelectorAll('thead th, thead td')).map((cell) => Math.round(cell.getBoundingClientRect().right)),
            ),
        );

        for (const edges of columnEdges) {
            expect(edges, 'every funding table must use the same column positions').toEqual(columnEdges[0]);
        }
    });
}

test('the page never scrolls sideways on a narrow screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(PUBLISHED_REPORT);
    await page.getByRole('tab', { name: /^SETUP\b/ }).click();
    await expect(page.locator('.report-view-table').first()).toBeVisible();

    // Wide tables scroll inside their own block; the page itself must not.
    const pageOverflowsSideways = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );

    expect(pageOverflowsSideways).toBe(false);
});
