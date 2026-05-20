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

export function reportChartCspNonce(): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    return document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content') ?? undefined;
}
