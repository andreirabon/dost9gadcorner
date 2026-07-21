<script setup lang="ts">
import type { TabType } from '@/helpers/reportTabs';

export interface OverviewProgram {
    tab: Exclude<TabType, 'Overview'>;
    title: string;
    metrics: Array<{
        label: string;
        value: string | number;
        meta?: string;
    }>;
}

interface Props {
    programs: OverviewProgram[];
}

defineProps<Props>();

const emit = defineEmits<{
    'select-tab': [tab: Exclude<TabType, 'Overview'>];
}>();
</script>

<template>
    <div class="report-view-metric">
        <div class="report-view-block-header">
            <h3 class="report-view-block-title">Quick Access</h3>
        </div>
        <div class="report-view-quick-grid">
            <button
                v-for="program in programs"
                :key="program.tab"
                type="button"
                class="report-view-quick-item"
                @click="emit('select-tab', program.tab)"
            >
                <p class="report-view-quick-title">{{ program.title }}</p>
                <div
                    v-for="(metric, metricIndex) in program.metrics"
                    :key="metric.label"
                    :class="metricIndex > 0 ? 'mt-2 border-t border-purple-500/10 pt-2 report-light:border-slate-200/80' : ''"
                >
                    <p class="report-view-quick-label">{{ metric.label }}</p>
                    <p class="report-view-quick-value-sm">{{ metric.value }}</p>
                    <p v-if="metric.meta" class="text-[10px] text-purple-300/60 report-light:text-slate-500">{{ metric.meta }}</p>
                </div>
            </button>
        </div>
    </div>
</template>
