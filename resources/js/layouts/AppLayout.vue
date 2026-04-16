<script setup lang="ts">
/**
 * App shell: sidebar + main column. Delegates to AppSidebarLayout.vue.
 */
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
    showFooter?: boolean;
    contentClass?: string;
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
    showFooter: true,
    contentClass: '',
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs" :show-footer="showFooter" :content-class="contentClass">
        <slot />
    </AppLayout>
</template>
