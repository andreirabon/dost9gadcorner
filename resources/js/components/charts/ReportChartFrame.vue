<script setup lang="ts">
import type { ReportChartVariant } from '@/composables/useReportChartHeight';
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

const frameClass = computed<string[]>(() => {
    const classes = [`report-chart-frame--${props.variant}`];
    const rows = props.rowCount ?? 0;

    if (props.variant !== 'pie') {
        if (rows >= 10) {
            classes.push('report-chart-frame--rows-xl');
        } else if (rows >= 7) {
            classes.push('report-chart-frame--rows-lg');
        } else if (rows >= 5) {
            classes.push('report-chart-frame--rows-md');
        }
    }

    return classes;
});
</script>

<template>
    <div class="report-chart-frame relative w-full min-w-0" :class="frameClass">
        <slot />
    </div>
</template>
