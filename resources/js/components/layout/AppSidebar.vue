<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue';
import NavMain from '@/components/layout/NavMain.vue';
import NavUser from '@/components/layout/NavUser.vue';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { ChevronsLeft, ChevronsRight, FileChartColumnIncreasing } from '@lucide/vue';
import { computed } from 'vue';

const page = usePage();
const { open, toggleSidebar, isMobile } = useSidebar();

/** Desktop: icon strip when `open` is false. Mobile overlay ignores this (always full-width sheet). */
const isIconOnly = computed(() => !isMobile.value && !open.value);

const mainNavItems = computed((): NavItem[] => {
    const items: NavItem[] = [];
    if (page.props.auth.user?.can?.accessReportYears) {
        items.push({
            title: 'Sex Disaggregated Data Report',
            href: '/report-years',
            icon: FileChartColumnIncreasing,
        });
    }

    return items;
});
</script>

<template>
    <Sidebar collapsible="icon" variant="sidebar" class="border-r border-white/10 shadow-none">
        <SidebarHeader
            class="border-b border-white/10 px-3 pt-4 pb-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-3 group-data-[collapsible=icon]:pb-2"
        >
            <div
                class="flex items-start justify-between gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3"
            >
                <SidebarMenu
                    class="min-w-0 flex-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center"
                >
                    <SidebarMenuItem class="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
                        <SidebarMenuButton
                            size="lg"
                            as-child
                            tooltip="Home"
                            class="h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                        >
                            <Link
                                :href="route('index')"
                                class="flex min-w-0 cursor-pointer rounded-lg py-0.5 pr-1 text-left transition-colors hover:bg-white/5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="h-9 w-9 shrink-0 rounded-md border border-white/10 bg-white/5 text-purple-300/50 shadow-sm transition-[background-color,color,transform] duration-300 hover:bg-white/10 hover:text-purple-100 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:outline-none group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10"
                    :aria-label="
                        isMobile
                            ? 'Close sidebar'
                            : isIconOnly
                              ? 'Expand sidebar to full width'
                              : 'Collapse sidebar to icon strip'
                    "
                    :aria-expanded="isMobile ? true : !isIconOnly"
                    :title="
                        isMobile
                            ? 'Close sidebar'
                            : isIconOnly
                              ? 'Expand sidebar (full width)'
                              : 'Collapse to icon strip (Ctrl+B)'
                    "
                    @click="toggleSidebar"
                >
                    <ChevronsLeft v-if="!isIconOnly" class="size-5" :stroke-width="2" aria-hidden="true" />
                    <ChevronsRight v-else class="size-5" :stroke-width="2" aria-hidden="true" />
                </Button>
            </div>
        </SidebarHeader>

        <SidebarContent class="px-3 py-5">
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter class="border-t border-white/10 p-2">
            <NavUser />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
    <slot />
</template>
