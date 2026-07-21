<script setup lang="ts">
interface Props {
    title: string;
    description?: string | null;
}

withDefaults(defineProps<Props>(), {
    description: null,
});
</script>

<template>
    <div class="report-view-block">
        <div class="report-view-chart-head">
            <h3 class="report-view-block-title">{{ title }}</h3>
            <p v-if="description !== null || $slots.description" class="report-view-block-desc">
                <slot name="description">{{ description }}</slot>
            </p>
        </div>
        <div class="report-chart-panel">
            <slot />
        </div>
    </div>
</template>
