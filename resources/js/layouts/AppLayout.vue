<script setup lang="ts">
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
    showFooter?: boolean;
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
    showFooter: true,
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs" :show-footer="showFooter">
        <slot />
    </AppLayout>
</template>
