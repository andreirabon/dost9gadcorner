<script setup lang="ts">
interface Props {
    isLoading?: boolean;
}

defineProps<Props>();
</script>

<template>
    <div class="chart-container relative h-80 w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
        <!-- Loading spinner -->
        <div v-if="isLoading" class="chart-loading absolute inset-0 flex items-center justify-center bg-gray-50/80">
            <div class="flex items-center gap-3">
                <div class="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                <span class="text-responsive text-gray-600">Loading charts...</span>
            </div>
        </div>
        <slot :is-loading="isLoading" />
    </div>
</template>
