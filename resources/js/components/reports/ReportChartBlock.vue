<script setup lang="ts">
interface Props {
    title: string;
    description?: string | null;
    /**
     * The finding this chart shows, stated as one sentence. When present it
     * leads the block and `title` drops to a label above it.
     *
     * Null whenever the figures cannot support a sentence — an unrecorded
     * section, or a breakdown whose groups overlap and must not be ranked.
     */
    takeaway?: string | null;
}

withDefaults(defineProps<Props>(), {
    description: null,
    takeaway: null,
});
</script>

<template>
    <div class="report-view-block">
        <div class="report-view-chart-head" :class="{ 'report-view-chart-head--story': takeaway !== null }">
            <h3 class="report-view-block-title">{{ title }}</h3>
            <p v-if="takeaway !== null" class="report-view-block-takeaway">{{ takeaway }}</p>
            <p v-if="description !== null || $slots.description" class="report-view-block-desc">
                <slot name="description">{{ description }}</slot>
            </p>
        </div>
        <div class="report-chart-panel">
            <slot />
        </div>
    </div>
</template>
