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
        class="relative isolate min-h-screen border-t border-white/5 bg-white px-page-gutter pt-20 pb-8 sm:pt-24 md:pt-28 md:pb-10 lg:pt-32"
        aria-labelledby="yearly-heading"
    >
        <!-- Subtle Radial Glow -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px] mix-blend-screen"></div>
        </div>

        <div class="relative z-10 mx-auto w-full max-w-7xl">
            <!-- Header -->
            <div class="mb-12 md:mb-16 text-center lg:text-left">
                <h2
                    id="yearly-heading"
                    data-focus-anchor="true"
                    tabindex="-1"
                    class="text-4xl font-semibold tracking-tighter text-slate-900 sm:text-5xl md:text-5xl"
                >
                    Yearly <span class="text-violet-400">Reports</span>
                </h2>
                <p class="mt-4 max-w-2xl text-lg text-purple-200/70 mx-auto lg:mx-0">
                    Our yearly reports provide a comprehensive overview of our activities and achievements. Explore each report to see how we promote gender equality and inclusive development.
                </p>
            </div>

            <div
                v-if="years.length === 0"
                class="rounded-[2rem] border border-slate-200 bg-purple-900/10 p-12 text-center text-base text-purple-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
            >
                No yearly reports have been added yet.
            </div>

            <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <YearCard v-for="year in years" :key="year.id" v-memo="[year.id, year.href]" :year="year" />
            </div>
        </div>
    </section>
</template>
