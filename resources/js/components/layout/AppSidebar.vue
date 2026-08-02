<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue';
import NavMain from '@/components/layout/NavMain.vue';
import NavUser from '@/components/layout/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { ArrowLeft, ChevronsLeft, ChevronsRight, FileChartColumnIncreasing, Printer } from '@lucide/vue';
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

        items.push({
            title: 'Print Report',
            href: '/print-report',
            icon: Printer,
        });
    }

    return items;
});
</script>

<template>
    <Sidebar collapsible="icon" variant="sidebar" class="sidebar-shell border-r border-white/[0.06] text-sidebar-foreground">
        <!-- Header: logo + collapse toggle -->
        <SidebarHeader
            class="border-b border-white/[0.07] px-3 pt-4 pb-3.5 group-data-[collapsible=icon]:px-2.5 group-data-[collapsible=icon]:pt-4 group-data-[collapsible=icon]:pb-3"
        >
            <div
                class="flex items-center justify-between gap-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3"
            >
                <SidebarMenu
                    class="min-w-0 flex-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center"
                >
                    <SidebarMenuItem
                        class="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                    >
                        <SidebarMenuButton
                            size="lg"
                            as-child
                            tooltip="Home"
                            class="h-auto min-h-0 w-full p-0 group-data-[collapsible=icon]:justify-center hover:bg-transparent"
                        >
                            <Link
                                :href="route('index')"
                                class="sidebar-logo-link flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0 hover:bg-white/[0.04] active:scale-[0.98]"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <button
                    type="button"
                    class="sidebar-collapse-btn shrink-0 rounded-lg p-2 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-2.5 focus-visible:ring-2 focus-visible:ring-blue-300/40 focus-visible:outline-none active:scale-[0.93]"
                    :aria-label="isMobile ? 'Close sidebar' : isIconOnly ? 'Expand sidebar to full width' : 'Collapse sidebar to icon strip'"
                    :aria-expanded="isMobile ? true : !isIconOnly"
                    :title="isMobile ? 'Close sidebar' : isIconOnly ? 'Expand sidebar (full width)' : 'Collapse to icon strip (Ctrl+B)'"
                    @click="toggleSidebar"
                >
                    <ChevronsLeft v-if="!isIconOnly" class="size-4.5" :stroke-width="1.8" aria-hidden="true" />
                    <ChevronsRight v-else class="size-4.5" :stroke-width="1.8" aria-hidden="true" />
                </button>
            </div>
        </SidebarHeader>

        <!-- Main navigation. Wrapped in a real landmark so screen-reader users can
             jump straight here; the sidebar itself renders as a plain div. -->
        <SidebarContent class="px-2.5 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
            <nav aria-label="Main">
                <NavMain :items="mainNavItems" section-label="Reports" />
            </nav>
        </SidebarContent>

        <!-- Footer: back link + user card -->
        <SidebarFooter class="mt-auto space-y-1 border-t border-white/[0.07] px-2.5 pt-2.5 pb-3 group-data-[collapsible=icon]:p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton as-child size="default" tooltip="Go back to homepage">
                        <Link
                            :href="route('index')"
                            class="sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                        >
                            <ArrowLeft class="size-4 shrink-0" :stroke-width="1.8" aria-hidden="true" />
                            <span class="truncate group-data-[collapsible=icon]:hidden">Homepage</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <NavUser />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
    <slot />
</template>
