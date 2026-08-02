<script setup lang="ts">
import { formatCurrency } from '@/helpers/formatCurrency';

/** ₱0.00 reads as a validated zero; funding never recorded should read as absent, not confirmed nil. */
const formatFundingOrEmpty = (amount: number): string => (amount > 0 ? formatCurrency(amount) : 'No data yet');
import type { FundingCategorySummaryData } from '@/types/reports';

interface Props {
    title: string;
    description: string;
    categories: FundingCategorySummaryData[];
    emptyLabel: string;
}

defineProps<Props>();
</script>

<template>
    <div class="report-view-block">
        <div class="report-view-chart-head">
            <h3 class="report-view-block-title">{{ title }}</h3>
            <p class="report-view-block-desc">{{ description }}</p>
        </div>
        <div v-if="categories.length === 0" class="report-view-block-desc">{{ emptyLabel }}</div>
        <div v-else class="report-view-category-grid">
            <div v-for="category in categories" :key="category.slug" class="report-view-quick-item">
                <p class="report-view-quick-title">{{ category.label }}</p>
                <p class="report-view-quick-label">Projects</p>
                <p class="report-view-quick-value">{{ category.maleProjects + category.femaleProjects }}</p>
                <p class="report-view-quick-label">Funding</p>
                <p class="report-view-quick-value-sm">{{ formatFundingOrEmpty(category.maleAmount + category.femaleAmount) }}</p>
            </div>
        </div>
    </div>
</template>
