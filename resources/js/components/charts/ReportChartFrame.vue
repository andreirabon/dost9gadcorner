<script setup lang="ts">
import { useReportChartHeight, type ReportChartVariant } from '@/composables/useReportChartHeight';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        variant?: ReportChartVariant;
        rowCount?: number;
    }>(),
    {
        variant: 'bar',
        rowCount: undefined,
    },
);

const variantRef = computed(() => props.variant);
const rowCountRef = computed(() => props.rowCount);

const { frameStyle, heightPx } = useReportChartHeight(variantRef, rowCountRef);
</script>

<template>
    <div class="report-chart-frame relative w-full min-w-0" :style="frameStyle">
        <slot :height-px="heightPx" />
    </div>
</template>
