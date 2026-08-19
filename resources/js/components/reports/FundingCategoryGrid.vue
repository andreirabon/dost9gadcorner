<script setup lang="ts">
import { formatCurrency } from '@/helpers/formatCurrency';
import type { FundingCategorySummaryData } from '@/types/reports';

/** ₱0.00 reads as a validated zero; funding never recorded should read as absent, not confirmed nil. */
const formatFundingOrEmpty = (amount: number): string => (amount > 0 ? formatCurrency(amount) : 'No data yet');

interface Props {
    title: string;
    description: string;
    categories: FundingCategorySummaryData[];
    emptyLabel: string;
}

defineProps<Props>();

/**
 * Renders jobs the way the figure is actually reported: the total, then the
 * disaggregation in parentheses — "100 (50 m, 50 f, 5 PWD, 4 4Ps)". Categories
 * with no count are dropped rather than printed as zero, so the line stays
 * readable when only some apply.
 */
const formatJobsGenerated = (category: FundingCategorySummaryData): string | null => {
    const total = category.jobsTotal ?? 0;

    if (total === 0) {
        return null;
    }

    const parts = [
        { count: category.jobsMale ?? 0, label: 'm' },
        { count: category.jobsFemale ?? 0, label: 'f' },
        { count: category.jobsPwd ?? 0, label: 'PWD' },
        { count: category.jobsSeniorCitizen ?? 0, label: 'senior citizen' },
        { count: category.jobsIp ?? 0, label: 'IP' },
        { count: category.jobs4ps ?? 0, label: '4Ps' },
    ].filter((part) => part.count > 0);

    if (parts.length === 0) {
        return String(total);
    }

    return `${total} (${parts.map((part) => `${part.count} ${part.label}`).join(', ')})`;
};

const formatResearch = (category: FundingCategorySummaryData): string | null => {
    const male = category.specialProjectsResearchMale ?? 0;
    const female = category.specialProjectsResearchFemale ?? 0;

    return male + female > 0 ? `${male + female} (${male} m, ${female} f)` : null;
};
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

                <template v-if="(category.fundedProjectsCount ?? 0) > 0">
                    <p class="report-view-quick-label">Funded projects</p>
                    <p class="report-view-quick-value-sm">
                        {{ category.fundedProjectsCount }}
                        <span v-if="(category.fundedProjectsValue ?? 0) > 0">· {{ formatCurrency(category.fundedProjectsValue ?? 0) }}</span>
                    </p>
                </template>

                <template v-if="(category.trainingParticipants ?? 0) > 0">
                    <p class="report-view-quick-label">Training participants</p>
                    <p class="report-view-quick-value-sm">{{ category.trainingParticipants }}</p>
                </template>

                <template v-if="formatJobsGenerated(category)">
                    <p class="report-view-quick-label">Jobs generated</p>
                    <p class="report-view-quick-value-sm">{{ formatJobsGenerated(category) }}</p>
                </template>

                <template v-if="formatResearch(category)">
                    <p class="report-view-quick-label">Special projects research</p>
                    <p class="report-view-quick-value-sm">{{ formatResearch(category) }}</p>
                </template>
            </div>
        </div>
    </div>
</template>
