<script setup lang="ts">
import type { FundingCategorySummaryData } from '@/types/reports';
import { computed, ref, watch } from 'vue';

interface Props {
    title: string;
    description: string;
    emptyDescription: string;
    categories: FundingCategorySummaryData[];
}

const props = defineProps<Props>();

defineSlots<{
    default(props: { category: FundingCategorySummaryData }): unknown;
}>();

const selectedSlug = ref<string | null>(null);

/** Auto-select the first category when the list (re)populates, and clear selection if it empties out. */
watch(
    () => props.categories,
    (rows) => {
        if (rows.length === 0) {
            selectedSlug.value = null;
            return;
        }

        if (selectedSlug.value === null || !rows.some((row) => row.slug === selectedSlug.value)) {
            selectedSlug.value = rows[0].slug;
        }
    },
    { immediate: true },
);

const selectedCategory = computed<FundingCategorySummaryData | null>(
    () => props.categories.find((row) => row.slug === selectedSlug.value) ?? null,
);

const selectCategory = (slug: string): void => {
    selectedSlug.value = slug;
};

const buttonClass = (isActive: boolean): string[] => [
    'inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide transition-[transform,background-color,border-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 active:scale-[0.97]',
    isActive
        ? 'border-purple-500 bg-purple-600 text-white shadow-sm'
        : 'border-purple-400/35 bg-purple-900/55 text-purple-100 hover:border-purple-400/55 hover:bg-purple-900/75 report-light:border-slate-300 report-light:bg-slate-50 report-light:text-slate-700 report-light:hover:border-slate-400 report-light:hover:bg-slate-100',
];
</script>

<template>
    <div v-if="categories.length === 0" class="report-view-block">
        <div class="report-view-chart-head">
            <h3 class="report-view-block-title">{{ title }}</h3>
            <p class="report-view-block-desc">{{ emptyDescription }}</p>
        </div>
    </div>

    <div v-else class="report-view-block space-y-4">
        <div class="report-view-chart-head">
            <h3 class="report-view-block-title">{{ title }}</h3>
            <p class="report-view-block-desc">{{ description }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
            <button
                v-for="category in categories"
                :key="category.slug"
                type="button"
                :class="buttonClass(selectedSlug === category.slug)"
                :aria-pressed="selectedSlug === category.slug"
                @click="selectCategory(category.slug)"
            >
                {{ category.label }}
            </button>
        </div>
        <div v-if="selectedCategory" class="report-chart-panel">
            <slot :category="selectedCategory" />
        </div>
    </div>
</template>
