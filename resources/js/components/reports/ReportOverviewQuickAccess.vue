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
    <!--
        The card shell is `report-view-block`, not `report-view-metric`: the
        latter is a three-row label/value/meta grid meant for a single figure.
    -->
    <div class="report-view-block">
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
                <!--
                    Each metric occupies the same three rows whether or not it
                    has a meta line, so the divider rules and figures line up
                    across every card in the row instead of going ragged.
                -->
                <div
                    v-for="(metric, metricIndex) in program.metrics"
                    :key="metric.label"
                    class="report-view-quick-metric"
                    :class="metricIndex > 0 ? 'report-view-quick-metric--divided' : ''"
                >
                    <p class="report-view-quick-label">{{ metric.label }}</p>
                    <p class="report-view-quick-value-sm">{{ metric.value }}</p>
                    <p class="report-view-quick-meta" :aria-hidden="metric.meta ? undefined : 'true'">{{ metric.meta ?? '' }}</p>
                </div>
            </button>
        </div>
    </div>
</template>
