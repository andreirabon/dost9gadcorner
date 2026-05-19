<script setup lang="ts">
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import type { BreadcrumbItemType } from '@/types';
import { ChevronsLeft, ChevronsRight } from '@lucide/vue';
import { computed } from 'vue';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItemType[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

const { open, toggleSidebar, isMobile } = useSidebar();

/** Desktop only: full width vs icon strip. */
const isIconOnly = computed(() => !isMobile.value && !open.value);
</script>

<template>
    <header
        v-if="breadcrumbs && breadcrumbs.length > 0"
        class="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border/70 px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:h-16 sm:px-4 md:px-6"
    >
        <SidebarTrigger
            class="shrink-0 rounded-md border border-sidebar-border/80 bg-background shadow-sm md:hidden"
            aria-label="Open sidebar"
        />
        <div class="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <Breadcrumbs :breadcrumbs="breadcrumbs" />
        </div>
        <Button
            type="button"
            variant="outline"
            size="icon"
            class="hidden shrink-0 rounded-md shadow-sm md:inline-flex"
            :aria-label="
                isIconOnly ? 'Expand sidebar to full width' : 'Collapse sidebar to icon strip'
            "
            :title="
                isIconOnly ? 'Expand sidebar (full width)' : 'Collapse to icon strip (Ctrl+B)'
            "
            @click="toggleSidebar"
        >
            <ChevronsLeft v-if="!isIconOnly" class="size-4" :stroke-width="2" aria-hidden="true" />
            <ChevronsRight v-else class="size-4" :stroke-width="2" aria-hidden="true" />
        </Button>
    </header>
</template>
