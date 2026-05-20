<script setup lang="ts">
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';
import YearCard from '@/components/home/YearCard.vue';
import type { YearItem } from '@/types';
import { FileBarChart2 } from '@lucide/vue';
import { computed } from 'vue';

defineOptions({
    name: 'YearlySection',
});

const props = defineProps<{
    years: YearItem[];
}>();

const sortedYears = computed(() => [...props.years].sort((a, b) => Number(b.year) - Number(a.year)));

const reportCount = computed(() => props.years.length);

const headerIntroCardClass =
    'relative overflow-hidden rounded-[2.5rem] border border-purple-400/35 bg-purple-900/55 p-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-10';

const reportsPanelClass =
    'relative overflow-hidden rounded-[2.5rem] border border-purple-400/35 bg-purple-900/40 p-5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-6 md:p-8';

const emptyStateClass =
    'relative overflow-hidden rounded-[2.5rem] border border-dashed border-purple-400/30 bg-purple-950/50 px-8 py-14 text-center shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/5 sm:py-16';
</script>

<template>
    <section
        id="yearly"
        class="home-index-section bg-linear-to-b from-purple-950/98 via-fuchsia-950/28 to-purple-950 px-page-gutter"
        aria-labelledby="yearly-heading"
    >
        <IndexSectionDecor variant="yearly" />

        <div class="home-index-section__inner max-w-7xl">
            <article :class="headerIntroCardClass">
                <div
                    class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/35 to-transparent"
                    aria-hidden="true"
                />
                <div class="relative z-10 flex flex-col gap-5 text-center lg:items-start lg:text-left">
                    <p
                        class="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/50 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-fuchsia-100/90 uppercase ring-1 ring-white/10 lg:mx-0"
                    >
                        <span class="size-1.5 shrink-0 rounded-full bg-fuchsia-300/85" aria-hidden="true" />
                        Annual reporting
                    </p>

                    <div class="space-y-4">
                        <h2
                            id="yearly-heading"
                            data-focus-anchor="true"
                            tabindex="-1"
                            class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"
                        >
                            Sex-Disaggregated Data <span class="text-fuchsia-300/90">Reports</span>
                        </h2>
                        <p class="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/85 sm:text-lg lg:mx-0">
                            Browse yearly GAD reports documenting programs, outcomes, and progress toward gender equality
                            across DOST Region IX.
                        </p>
                    </div>

                    <p
                        v-if="reportCount > 0"
                        class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-950/40 px-3 py-1.5 text-xs font-medium text-purple-100/85 ring-1 ring-white/5 lg:mx-0"
                    >
                        <FileBarChart2 class="size-3.5 shrink-0 text-fuchsia-300/80" stroke-width="2" aria-hidden="true" />
                        {{ reportCount }} {{ reportCount === 1 ? 'report' : 'reports' }} available
                    </p>
                </div>
            </article>

            <div class="mt-6 sm:mt-8">
                <div v-if="reportCount === 0" :class="emptyStateClass">
                    <p class="text-base font-medium text-purple-100">No reports published yet</p>
                    <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-purple-200/75">
                        Yearly sex-disaggregated data reports will appear here once they are added.
                    </p>
                </div>

                <article v-else :class="reportsPanelClass" aria-label="Yearly report archive">
                    <div
                        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/20 to-transparent"
                        aria-hidden="true"
                    />
                    <ul
                        class="relative z-10 m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
                    >
                        <li v-for="year in sortedYears" :key="year.id" class="list-none min-w-0">
                            <YearCard v-memo="[year.id, year.href, year.description]" :year="year" />
                        </li>
                    </ul>
                </article>
            </div>
        </div>
    </section>
</template>
