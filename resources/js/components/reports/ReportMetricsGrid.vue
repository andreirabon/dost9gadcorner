<script setup lang="ts">
import ReportMetricCard from '@/components/reports/ReportMetricCard.vue';

export interface ReportMetricItem {
    label: string;
    value: string | number;
    meta?: string | number | null;
    valueClass?: string;
}

interface Props {
    metrics: ReportMetricItem[];
    fiveUp?: boolean;
}

withDefaults(defineProps<Props>(), {
    fiveUp: false,
});
</script>

<template>
    <div class="report-view-metrics" :class="{ 'report-view-metrics--five-up': fiveUp }">
        <ReportMetricCard
            v-for="metric in metrics"
            :key="metric.label"
            :label="metric.label"
            :value="metric.value"
            :meta="metric.meta"
            :value-class="metric.valueClass"
        />
    </div>
</template>
