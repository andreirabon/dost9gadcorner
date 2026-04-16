<script setup lang="ts">
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';
import type { BreadcrumbItemType } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItemType[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);
</script>

<template>
    <header
        v-if="breadcrumbs && breadcrumbs.length > 0"
        class="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border/70 px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:h-16 sm:px-4 md:px-6"
    >
        <div class="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <Breadcrumbs :breadcrumbs="breadcrumbs" />
        </div>
    </header>
</template>
