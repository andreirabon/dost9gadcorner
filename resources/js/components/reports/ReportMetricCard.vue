<script setup lang="ts">
interface Props {
    label: string;
    value: string | number;
    meta?: string | number | null;
    valueClass?: string;
}

withDefaults(defineProps<Props>(), {
    meta: null,
    valueClass: '',
});
</script>

<template>
    <div class="report-view-metric">
        <p class="report-view-metric-label">{{ label }}</p>
        <p class="report-view-metric-value" :class="valueClass">{{ value }}</p>
        <p v-if="meta !== null" class="report-view-metric-meta">{{ meta }}</p>
    </div>
</template>
