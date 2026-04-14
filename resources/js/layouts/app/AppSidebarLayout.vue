<script setup lang="ts">
import AppContent from '@/components/layout/AppContent.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import AppShell from '@/components/layout/AppShell.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppSidebarHeader from '@/components/layout/AppSidebarHeader.vue';
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
    <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" class="flex min-h-0 flex-1 flex-col overflow-x-hidden">
            <AppSidebarHeader :breadcrumbs="breadcrumbs" />
            <div class="flex min-h-0 flex-1 flex-col">
                <div class="min-h-0 flex-1">
                    <slot />
                </div>
                <AppFooter v-if="showFooter" />
            </div>
        </AppContent>
    </AppShell>
</template>
