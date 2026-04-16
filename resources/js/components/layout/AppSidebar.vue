<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue';
import NavMain from '@/components/layout/NavMain.vue';
import NavUser from '@/components/layout/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { FileChartColumnIncreasing } from 'lucide-vue-next';
import { computed } from 'vue';

const page = usePage();

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
    <Sidebar collapsible="icon" variant="inset" class="border-zinc-200/80 border-r dark:border-zinc-800/80">
        <SidebarHeader class="border-zinc-200/60 border-b px-2 py-3 dark:border-zinc-800/80">
            <div class="flex items-center gap-1.5">
                <SidebarTrigger
                    class="touch-target shrink-0 group-data-[collapsible=icon]:hidden"
                    aria-label="Toggle sidebar"
                />
                <SidebarMenu class="min-w-0 flex-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            as-child
                            tooltip="Admin Panel"
                            class="h-auto min-h-10 py-1.5 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                        >
                            <Link
                                :href="route('index')"
                                class="flex min-w-0 cursor-pointer items-center rounded-lg px-2 py-1.5 text-left text-zinc-900 transition-colors hover:bg-zinc-100/80 group-data-[collapsible=icon]:justify-center dark:text-zinc-50 dark:hover:bg-zinc-800/50"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
        </SidebarHeader>

        <SidebarContent class="px-2 py-4">
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter class="border-zinc-200/60 border-t p-2 dark:border-zinc-800/80">
            <NavUser />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
    <slot />
</template>
