<script setup lang="ts">
import type { YearItem } from '@/types';
import { Link } from '@inertiajs/vue3';
import { ArrowUpRight } from '@lucide/vue';
import { computed } from 'vue';

defineOptions({
    name: 'YearCard',
});

const props = defineProps<{
    year: YearItem;
}>();

const yearTheme = computed(() => {
    const themes: Record<string, { border: string; bg: string; accent: string }> = {
        '2025': {
            border: 'border-fuchsia-400/35',
            bg: 'bg-linear-to-br from-fuchsia-900/40 via-purple-900/50 to-purple-950/60',
            accent: 'text-fuchsia-200/90',
        },
        '2026': {
            border: 'border-purple-400/35',
            bg: 'bg-linear-to-br from-purple-900/45 via-fuchsia-950/35 to-purple-950/60',
            accent: 'text-purple-200/90',
        },
        default: {
            border: 'border-purple-400/30',
            bg: 'bg-linear-to-br from-purple-900/40 via-fuchsia-950/30 to-purple-950/55',
            accent: 'text-purple-200/85',
        },
    };

    return themes[props.year.year] ?? themes.default;
});
</script>

<template>
    <Link
        :href="year.href"
        prefetch
        :class="[
            'year-card group touch-target tap-highlight-none relative flex min-h-42 flex-col overflow-hidden rounded-[1.75rem] border p-5 text-left shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/10 contain-[paint] transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none active:scale-[0.98] sm:min-h-46 sm:p-6',
            yearTheme.border,
            yearTheme.bg,
            'hover:border-purple-400/50 hover:shadow-[0_12px_36px_-14px_rgba(0,0,0,0.5)]',
        ]"
        :aria-label="`View ${year.year} sex-disaggregated data report`"
    >
        <p
            :class="[
                'text-[0.6875rem] font-semibold tracking-[0.14em] uppercase',
                yearTheme.accent,
            ]"
        >
            Annual report
        </p>

        <h3 class="mt-3 font-sans text-3xl font-bold tracking-tighter text-purple-50 sm:text-4xl">
            {{ year.year }}
        </h3>

        <p
            v-if="year.description"
            class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-purple-200/80"
        >
            {{ year.description }}
        </p>
        <p v-else class="mt-2 flex-1 text-sm text-purple-200/60">
            Open the full report for indicators, activities, and outcomes.
        </p>

        <span
            class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-200/90 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:gap-2 motion-reduce:transition-none"
        >
            View report
            <ArrowUpRight
                class="size-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                stroke-width="2"
                aria-hidden="true"
            />
        </span>
    </Link>
</template>
