<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue';
import NavMain from '@/components/layout/NavMain.vue';
import NavUser from '@/components/layout/NavUser.vue';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { CircleDot, FileChartColumnIncreasing } from 'lucide-vue-next';
import { computed } from 'vue';

const page = usePage();
const { toggleSidebar } = useSidebar();

const mainNavItems = computed((): NavItem[] => {
    const items: NavItem[] = [];
    if (page.props.auth.user?.is_admin) {
        items.push({
            title: 'Reports',
            href: '/report-years',
            icon: FileChartColumnIncreasing,
        });
    }

    return items;
});
</script>

<template>
    <Sidebar collapsible="icon" variant="sidebar" class="border-r border-white/10 shadow-none">
        <SidebarHeader class="border-b border-white/10 px-3 pt-4 pb-3">
            <div class="flex items-start justify-between gap-2">
                <SidebarMenu class="min-w-0 flex-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            as-child
                            tooltip="Home"
                            class="h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                        >
                            <Link
                                :href="route('index')"
                                class="flex min-w-0 cursor-pointer rounded-lg py-0.5 pr-1 text-left transition-colors hover:bg-white/5 group-data-[collapsible=icon]:justify-center"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <Button
                    variant="ghost"
                    size="icon"
                    class="group-data-[collapsible=icon]:hidden h-9 w-9 shrink-0 text-[#b8c2de] hover:bg-white/10 hover:text-white"
                    aria-label="Toggle sidebar"
                    @click="toggleSidebar"
                >
                    <CircleDot class="size-5" :stroke-width="2" />
                </Button>
            </div>
        </SidebarHeader>

        <SidebarContent class="px-3 py-5">
            <NavMain section-label="Reports" :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter class="border-t border-white/10 p-2">
            <NavUser />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
    <slot />
</template>
