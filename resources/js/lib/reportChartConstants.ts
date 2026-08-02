import { usePreferredReducedMotion } from '@vueuse/core';
import type { ApexOptions } from 'apexcharts';
import { computed, type ComputedRef } from 'vue';

/** Matches `--font-sans` in resources/css/app.css */
export const REPORT_CHART_FONT_FAMILY =
    'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

export { REPORT_CHART_SEX_COLORS, REPORT_CHART_STROKE_COLORS, reportDisaggPalette, type ReportDisaggPalette } from '@/lib/reportDisaggColors';

export function useReportChartMotion(): ComputedRef<NonNullable<ApexOptions['chart']>['animations']> {
    const prefersReducedMotion = usePreferredReducedMotion();

    return computed(() => {
        if (prefersReducedMotion.value === 'reduce') {
            return { enabled: false };
        }

        return {
            enabled: true,
            speed: 400,
            easing: 'easeout',
        };
    });
}

/**
 * Y-axis max/tick-count pair guaranteed to divide evenly, so labels land on whole numbers
 * (e.g. 0/5/10/15/20/25) instead of `max / tickAmount` fractions like 20.8, 16.7, 4.2.
 */
export function niceAxisScale(maxValue: number, minTicks = 4, maxTicks = 8): { max: number; tickAmount: number } {
    const safeMax = Math.max(maxValue, 1);
    const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000, 100000];

    for (const step of steps) {
        const tickAmount = Math.ceil(safeMax / step);
        if (tickAmount >= minTicks && tickAmount <= maxTicks) {
            return { max: tickAmount * step, tickAmount };
        }
    }

    const step = steps[steps.length - 1];
    const tickAmount = Math.ceil(safeMax / step);

    return { max: tickAmount * step, tickAmount };
}

export function reportChartCspNonce(): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    return document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content') ?? undefined;
}
