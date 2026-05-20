import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue';

export type ReportChartAppearance = 'light';

export const REPORT_PAGE_THEME_KEY: InjectionKey<Ref<ReportChartAppearance>> = Symbol('reportPageTheme');

/** Public `/reports/*` pages use light chart styling only. */
export function provideReportPageTheme(): { mode: Ref<ReportChartAppearance> } {
    const mode = ref<ReportChartAppearance>('light');

    provide(REPORT_PAGE_THEME_KEY, mode);

    return { mode };
}

export function useReportChartAppearance(): ComputedRef<ReportChartAppearance> {
    const injected = inject(REPORT_PAGE_THEME_KEY, undefined);
    return computed(() => injected?.value ?? 'light');
}
