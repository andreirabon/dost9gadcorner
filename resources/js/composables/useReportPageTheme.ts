import { computed, inject, provide, ref, watch, type ComputedRef, type InjectionKey, type Ref } from 'vue';

const STORAGE_KEY = 'report-public-view-theme';

export const REPORT_PAGE_THEME_KEY: InjectionKey<Ref<'light' | 'dark'>> = Symbol('reportPageTheme');

function readStored(): 'light' | 'dark' {
    if (typeof window === 'undefined') {
        return 'dark';
    }
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === 'light' || raw === 'dark') {
            return raw;
        }
    } catch {
        /* ignore */
    }
    return 'dark';
}

export function provideReportPageTheme(): { mode: Ref<'light' | 'dark'>; toggle: () => void } {
    const mode = ref<'light' | 'dark'>(readStored());

    watch(mode, (v) => {
        try {
            localStorage.setItem(STORAGE_KEY, v);
        } catch {
            /* ignore */
        }
    });

    provide(REPORT_PAGE_THEME_KEY, mode);

    function toggle(): void {
        mode.value = mode.value === 'dark' ? 'light' : 'dark';
    }

    return { mode, toggle };
}

export function useReportChartAppearance(): ComputedRef<'light' | 'dark'> {
    const injected = inject(REPORT_PAGE_THEME_KEY, undefined);
    return computed(() => (injected?.value === 'light' ? 'light' : 'dark'));
}
