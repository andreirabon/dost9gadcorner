<script setup lang="ts">
import ReportBackArrowIcon from '@/components/reports/ReportBackArrowIcon.vue';
import { Link } from '@inertiajs/vue3';

const props = withDefaults(
    defineProps<{
        href: string;
        /** Fits in a header row without stretching full width */
        inline?: boolean;
    }>(),
    {
        inline: false,
    },
);
</script>

<template>
    <Link
        :href="href"
        :class="[
            'report-years-btn-primary shrink-0',
            props.inline ? 'w-auto' : 'w-full sm:w-auto',
        ]"
        prefetch
    >
        <ReportBackArrowIcon />
        <slot />
    </Link>
</template>
