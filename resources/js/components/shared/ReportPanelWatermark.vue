<script setup lang="ts">
/**
 * Large decorative Lucide icon for the right side of `.report-panel` (50% opacity).
 */
</script>

<template>
    <div
        class="report-panel-watermark pointer-events-none absolute inset-y-0 right-0 z-0 flex w-[min(42%,14rem)] max-w-68 shrink-0 items-center justify-center pr-1 opacity-50 text-zinc-400 sm:pr-4 dark:text-zinc-500"
        aria-hidden="true"
    >
        <slot />
    </div>
</template>
