import { expect, test } from '@playwright/test';

/**
 * Layout guards across the resolution range, for the pages a signed-out visitor
 * can reach. Two classes of regression are covered:
 *
 *  - horizontal overflow, which is invisible on a wide developer monitor and
 *    the first thing a phone user hits;
 *  - container drift, where a region ends up with its cap and its gutter on
 *    different levels of the tree and lands a gutter-width off the content
 *    above it. Only shows up past the max-width, so only on large displays.
 *
 * Signed out on purpose: these are public pages, and the assertions are about
 * layout, not about what a session can see.
 */
test.use({ storageState: { cookies: [], origins: [] } });

const WIDTHS = [
    { w: 360, h: 740, name: '360-android' },
    { w: 390, h: 844, name: '390-iphone' },
    { w: 768, h: 1024, name: '768-tablet' },
    { w: 1024, h: 768, name: '1024-tablet-ls' },
    { w: 1280, h: 800, name: '1280-laptop' },
    { w: 1440, h: 900, name: '1440-laptop' },
    { w: 1920, h: 1080, name: '1920-desktop' },
    { w: 2560, h: 1440, name: '2560-qhd' },
];

const PAGES = [
    { url: '/', name: 'home' },
    { url: '/reports/1', name: 'report' },
    { url: '/open', name: 'login' },
    { url: '/nope-404', name: 'error' },
];

for (const vp of WIDTHS) {
    for (const pg of PAGES) {
        test(`${pg.name} @ ${vp.name}`, async ({ page }) => {
            await page.setViewportSize({ width: vp.w, height: vp.h });
            await page.goto(pg.url, { waitUntil: 'load' });
            await page.evaluate(async () => {
                await document.fonts.ready;
                await Promise.all(
                    [...document.images]
                        .filter((i) => !i.complete)
                        .map(
                            (i) =>
                                new Promise((r) => {
                                    i.onload = i.onerror = r;
                                }),
                        ),
                );
            });
            await page.waitForTimeout(900);

            const overflow = await page.evaluate(() => {
                const de = document.documentElement;
                const offenders: string[] = [];
                if (de.scrollWidth > window.innerWidth + 1) {
                    document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
                        const r = el.getBoundingClientRect();
                        if (r.right > window.innerWidth + 1 || r.left < -1) {
                            const cs = getComputedStyle(el);
                            if (cs.position === 'fixed' || cs.visibility === 'hidden') return;
                            offenders.push(
                                `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)} right=${Math.round(r.right)}`,
                            );
                        }
                    });
                }
                return { scrollWidth: de.scrollWidth, inner: window.innerWidth, offenders: offenders.slice(0, 5) };
            });

            // Content and footer must share a left edge at every width.
            if (pg.name === 'report' || pg.name === 'home') {
                const edges = await page.evaluate(() => {
                    const L = (sel: string) => {
                        const el = document.querySelector(sel);
                        return el ? Math.round(el.getBoundingClientRect().left) : null;
                    };
                    return {
                        heading: L('.report-view-title') ?? L('.home-section-title'),
                        footer: L('.app-footer-inner p'),
                        nav: L('.home-topnav img'),
                        hero: L('#hero-heading'),
                    };
                });
                if (edges.heading !== null && edges.footer !== null) {
                    expect(Math.abs(edges.heading - edges.footer), `content/footer left edges diverge: ${JSON.stringify(edges)}`).toBeLessThanOrEqual(
                        1,
                    );
                }
                // On the home page the nav, hero and section headings all sit in
                // the same max-w-7xl container and must share one left edge.
                if (edges.nav !== null && edges.hero !== null) {
                    expect(Math.abs(edges.nav - edges.hero), `nav/hero left edges diverge: ${JSON.stringify(edges)}`).toBeLessThanOrEqual(1);
                    expect(
                        Math.abs(edges.hero - (edges.heading ?? edges.hero)),
                        `hero/section left edges diverge: ${JSON.stringify(edges)}`,
                    ).toBeLessThanOrEqual(1);
                }
            }

            expect(overflow.scrollWidth, `horizontal overflow: ${JSON.stringify(overflow.offenders)}`).toBeLessThanOrEqual(overflow.inner + 1);
        });
    }
}
