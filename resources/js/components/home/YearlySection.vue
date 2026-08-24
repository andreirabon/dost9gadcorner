<script setup lang="ts">
import YearCard from '@/components/home/YearCard.vue';
import type { YearItem } from '@/types';
import { computed } from 'vue';

defineOptions({
    name: 'YearlySection',
});

const props = defineProps<{
    years: YearItem[];
}>();

const sortedYears = computed(() => [...props.years].sort((a, b) => Number(b.year) - Number(a.year)));

const reportCount = computed(() => props.years.length);
</script>

<template>
    <section id="yearly" class="home-index-section px-page-gutter" aria-labelledby="yearly-heading">
        <div class="home-index-section__inner max-w-7xl">
            <header class="home-section-header">
                <p class="home-eyebrow">Annual reporting</p>
                <h2 id="yearly-heading" data-focus-anchor="true" tabindex="-1" class="home-section-title">Sex-disaggregated data reports</h2>
                <p class="home-section-lead">
                    Yearly GAD reports covering programs, outcomes, and progress toward gender equality across DOST Region IX.
                </p>
                <p v-if="reportCount > 0" class="home-note tabular-nums">
                    {{ reportCount }} {{ reportCount === 1 ? 'report' : 'reports' }} published
                </p>
            </header>

            <div v-if="reportCount === 0" class="rounded-xl border border-dashed border-brand-800 px-6 py-10 text-center">
                <p class="text-base font-medium text-brand-50">No reports published yet</p>
                <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-300">
                    Yearly sex-disaggregated data reports appear here once they are added.
                </p>
            </div>

            <ul v-else class="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="year in sortedYears" :key="year.id" v-memo="[year.id, year.href, year.description]" class="min-w-0 list-none">
                    <YearCard :year="year" />
                </li>
            </ul>
        </div>
    </section>
</template>
