import { usePreferredReducedMotion } from '@vueuse/core';
import type { ApexOptions } from 'apexcharts';
import { computed, type ComputedRef } from 'vue';

/** Matches `--font-sans` in resources/css/app.css */
export const REPORT_CHART_FONT_FAMILY = 'Geist, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

export const REPORT_CHART_SEX_COLORS = {
    female: '#f87171',
    male: '#60a5fa',
    femaleSoft: '#fca5a5',
    maleSoft: '#93c5fd',
} as const;

export const REPORT_CHART_STROKE_COLORS = ['#ef4444', '#3b82f6'] as const;

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
