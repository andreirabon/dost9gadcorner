<script setup lang="ts">
import { formatNumber } from '@/helpers/formatNumber';
import { computed } from 'vue';

interface Props {
    label: string;
    value: string | number;
    meta?: string | number | null;
    valueClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    meta: null,
    valueClass: '',
});

/**
 * Numbers get thousands separators; strings are passed through untouched.
 *
 * The type test is load-bearing: a year and a school year ("2025", "2025-2026")
 * arrive here as strings and must never be grouped into "2,025".
 */
const displayValue = computed(() => (typeof props.value === 'number' ? formatNumber(props.value) : props.value));
</script>

<template>
    <!--
        Three fixed rows: label, value, meta. The meta row is rendered even when
        empty so every card in a row has the same internal geometry — otherwise
        cards without a meta line end short and the row bottoms go ragged. The
        value row is bottom-aligned so cards using a smaller `valueClass` (long
        currency figures) still share a baseline with the large plain numbers
        beside them.
    -->
    <div class="report-view-metric">
        <p class="report-view-metric-label">{{ label }}</p>
        <p class="report-view-metric-value" :class="valueClass">{{ displayValue }}</p>
        <p class="report-view-metric-meta" :aria-hidden="meta === null ? 'true' : undefined">{{ meta ?? '' }}</p>
    </div>
</template>
