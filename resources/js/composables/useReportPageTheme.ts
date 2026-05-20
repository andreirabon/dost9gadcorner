import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue';

export const REPORT_PAGE_THEME_KEY: InjectionKey<Ref<'light' | 'dark'>> = Symbol('reportPageTheme');

/** Public `/reports/*` pages always use light theme (toggle hidden). */
export function provideReportPageTheme(): { mode: Ref<'light' | 'dark'> } {
    const mode = ref<'light' | 'dark'>('light');

    provide(REPORT_PAGE_THEME_KEY, mode);

    return { mode };
}

export function useReportChartAppearance(): ComputedRef<'light' | 'dark'> {
    const injected = inject(REPORT_PAGE_THEME_KEY, undefined);
    return computed(() => (injected?.value === 'light' ? 'light' : 'dark'));
}
