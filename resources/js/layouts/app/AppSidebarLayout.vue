<script setup lang="ts">
import AppContent from '@/components/layout/AppContent.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import AppShell from '@/components/layout/AppShell.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppSidebarHeader from '@/components/layout/AppSidebarHeader.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItemType } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
    showFooter?: boolean;
    /** Main column (below breadcrumb bar): flex + background for full-height pages */
    contentClass?: string;
    /**
     * When true, the block below the header does not use flex-1, so it only spans page content
     * (avoids a tall empty flex shell on short forms). Lists/editor pages keep default false.
     */
    compactMainColumn?: boolean;
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
    showFooter: true,
    contentClass: '',
    compactMainColumn: false,
});
</script>

<template>
    <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" class="app-main-shell flex min-h-0 flex-1 flex-col overflow-x-hidden">
            <div
                v-if="breadcrumbs.length === 0"
                class="flex h-12 shrink-0 items-center border-b border-sidebar-border/70 bg-background px-3 md:hidden"
            >
                <SidebarTrigger
                    class="rounded-md border border-sidebar-border/80 bg-background shadow-sm"
                    aria-label="Open sidebar"
                />
            </div>
            <AppSidebarHeader :breadcrumbs="breadcrumbs" />
            <div class="flex min-h-0 flex-col" :class="compactMainColumn ? 'flex-none' : 'flex-1'">
                <div
                    class="min-h-0"
                    :class="[contentClass, compactMainColumn ? false : 'flex-1']"
                >
                    <slot />
                </div>
                <AppFooter v-if="showFooter" />
            </div>
        </AppContent>
    </AppShell>
</template>
