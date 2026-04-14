<script setup lang="ts">
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';
import YearCard from '@/components/home/YearCard.vue';
import type { YearItem } from '@/types';

defineOptions({
    name: 'YearlySection',
});

defineProps<{
    years: YearItem[];
}>();
</script>

<template>
    <section
        id="yearly"
        class="relative isolate min-h-screen border-t border-purple-500/45 bg-linear-to-b from-purple-900/75 via-violet-950/55 to-purple-950/90 px-page-gutter pt-20 pb-8 sm:pt-24 md:pt-28 md:pb-10 lg:pt-32"
        aria-labelledby="yearly-heading"
    >
        <IndexSectionDecor variant="yearly" />
        <div class="relative z-10 mx-auto w-full max-w-6xl">
            <div class="mb-5 flex flex-col items-center gap-2 text-center sm:mb-6 md:mb-8">
                <div class="mb-2 flex justify-center sm:mb-3">
                    <img
                        src="/svg/reports.svg"
                        alt="Reports"
                        class="h-24 w-auto opacity-90 sm:h-28 md:h-32 lg:h-36"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                    />
                </div>
                <h2
                    id="yearly-heading"
                    data-focus-anchor="true"
                    tabindex="-1"
                    class="bg-linear-to-r from-purple-200 via-fuchsia-300 to-pink-200 bg-clip-text px-4 text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-4xl"
                >
                    Yearly Reports
                </h2>
                <p class="text-responsive mx-auto max-w-2xl px-4 text-pretty text-purple-100 sm:px-6">
                    Our yearly reports provide a comprehensive overview of our activities and achievements. Explore each report to see how we promote gender equality and inclusive development.
                </p>
            </div>

            <div
                v-if="years.length === 0"
                class="rounded-xl border border-purple-400/25 bg-purple-900/50 p-8 text-center text-sm text-purple-100 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
            >
                No yearly reports have been added yet.
            </div>

            <div v-else class="grid grid-cols-1 gap-2.5 px-3 sm:grid-cols-2 sm:gap-3 sm:px-4 lg:grid-cols-3 lg:gap-4">
                <YearCard v-for="year in years" :key="year.id" v-memo="[year.id, year.href]" :year="year" />
            </div>
        </div>
    </section>
</template>
