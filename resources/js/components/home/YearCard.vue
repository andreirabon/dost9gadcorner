<script setup lang="ts">
import type { YearItem } from '@/types';
import { Link } from '@inertiajs/vue3';
import { ArrowUpRight } from '@lucide/vue';

defineOptions({
    name: 'YearCard',
});

defineProps<{
    year: YearItem;
}>();
</script>

<!--
    Every card is the same card. It used to pick a different gradient per year
    from a hard-coded map, which meant 2025 and 2026 looked like different kinds
    of thing and any year outside the map looked like a third kind. The year is
    the only variable, and it is already the largest element on the card.
-->
<template>
    <Link
        :href="year.href"
        prefetch
        class="group touch-target tap-highlight-none flex min-h-40 flex-col rounded-xl border border-brand-800 bg-brand-900 p-5 text-left transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:border-brand-700 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-brand-800"
        :aria-label="`View the ${year.year} sex-disaggregated data report`"
    >
        <p class="home-eyebrow">Annual report</p>

        <h3 class="mt-2 text-4xl font-semibold tracking-tight text-brand-50 tabular-nums">
            {{ year.year }}
        </h3>

        <p v-if="year.description" class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-200">
            {{ year.description }}
        </p>
        <p v-else class="mt-2 flex-1 text-sm leading-relaxed text-brand-300">Indicators, activities, and outcomes for the reporting year.</p>

        <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
            View report
            <ArrowUpRight
                class="size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                stroke-width="2"
                aria-hidden="true"
            />
        </span>
    </Link>
</template>
