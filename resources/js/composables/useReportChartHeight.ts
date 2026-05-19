import { useWindowSize } from '@vueuse/core';
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';

export type ReportChartVariant = 'pie' | 'bar' | 'tall';

type VariantConfig = {
    minPx: number;
    maxPx: number;
    /** Share of viewport height below chrome reserved for the chart */
    vhRatio: number;
    /** Share of viewport width used as a height floor on wide displays */
    widthRatio: number;
    widthBreakpoints: { minWidth: number; bonusPx: number }[];
};

/** Approximate header, tabs, metrics, and padding above a chart block */
const VIEWPORT_CHROME_PX = 300;

const VARIANTS: Record<ReportChartVariant, VariantConfig> = {
    pie: {
        minPx: 220,
        maxPx: 360,
        vhRatio: 0.32,
        widthRatio: 0.2,
        widthBreakpoints: [
            { minWidth: 0, bonusPx: 0 },
            { minWidth: 640, bonusPx: 20 },
            { minWidth: 1024, bonusPx: 40 },
            { minWidth: 1536, bonusPx: 56 },
        ],
    },
    bar: {
        minPx: 260,
        maxPx: 480,
        vhRatio: 0.38,
        widthRatio: 0.24,
        widthBreakpoints: [
            { minWidth: 0, bonusPx: 0 },
            { minWidth: 640, bonusPx: 28 },
            { minWidth: 1024, bonusPx: 56 },
            { minWidth: 1536, bonusPx: 80 },
        ],
    },
    tall: {
        minPx: 300,
        maxPx: 560,
        vhRatio: 0.44,
        widthRatio: 0.28,
        widthBreakpoints: [
            { minWidth: 0, bonusPx: 0 },
            { minWidth: 768, bonusPx: 40 },
            { minWidth: 1280, bonusPx: 72 },
            { minWidth: 1536, bonusPx: 96 },
        ],
    },
};

function widthBonus(width: number, breakpoints: VariantConfig['widthBreakpoints']): number {
    let bonus = 0;

    for (const breakpoint of breakpoints) {
        if (width >= breakpoint.minWidth) {
            bonus = breakpoint.bonusPx;
        }
    }

    return bonus;
}

function rowCountBonus(rowCount: number | undefined): number {
    if (rowCount === undefined || rowCount <= 4) {
        return 0;
    }

    return Math.min(140, (rowCount - 4) * 16);
}

function clamp(min: number, max: number, value: number): number {
    return Math.min(max, Math.max(min, value));
}

export function useReportChartHeight(
    variant: MaybeRefOrGetter<ReportChartVariant> = 'bar',
    rowCount: MaybeRefOrGetter<number | undefined> = undefined,
): {
    heightPx: ComputedRef<number>;
    frameStyle: ComputedRef<{ height: string; minHeight: string }>;
} {
    const { width, height } = useWindowSize();

    const heightPx = computed(() => {
        const config = VARIANTS[toValue(variant)];
        const viewportHeight = height.value > 0 ? height.value : 800;
        const viewportWidth = width.value > 0 ? width.value : 1280;

        const availableBelowChrome = Math.max(config.minPx, viewportHeight - VIEWPORT_CHROME_PX);
        const fromViewport = Math.round(availableBelowChrome * config.vhRatio);
        const fromWidth = Math.round(viewportWidth * config.widthRatio);
        const bonus = widthBonus(viewportWidth, config.widthBreakpoints);
        const rows = rowCountBonus(toValue(rowCount));

        const target = Math.max(fromViewport, fromWidth) + bonus + rows;

        return clamp(config.minPx, config.maxPx, target);
    });

    const frameStyle = computed(() => ({
        height: `${heightPx.value}px`,
        minHeight: `${heightPx.value}px`,
    }));

    return { heightPx, frameStyle };
}
