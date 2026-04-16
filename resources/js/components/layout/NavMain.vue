<script setup lang="ts">
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';

withDefaults(
    defineProps<{
        items: NavItem[];
        sectionLabel?: string;
    }>(),
    {
        sectionLabel: 'Menu',
    },
);

const page = usePage();

function navItemIsActive(rawUrl: string, href: string): boolean {
    const pathname = rawUrl.split('?')[0] ?? rawUrl;
    if (pathname === href) {
        return true;
    }
    const base = href.replace(/\/$/, '');
    if (base === '' || base === '/') {
        return false;
    }
    return pathname.startsWith(`${base}/`);
}
</script>

<template>
    <SidebarGroup class="p-0">
        <SidebarGroupLabel
            class="mb-2 px-2 pt-0.5 pb-2 text-[10px] font-semibold tracking-[0.2em] text-[#8a99c0] uppercase group-data-[collapsible=icon]:hidden"
        >
            {{ sectionLabel }}
        </SidebarGroupLabel>
        <SidebarMenu class="gap-1.5">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="navItemIsActive(page.url, item.href)"
                    :tooltip="item.title"
                    class="h-auto min-h-11 rounded-lg border border-transparent py-2 text-[15px] text-sidebar-foreground transition-colors duration-200 hover:bg-white/10 hover:text-white data-[active=true]:border-transparent data-[active=true]:bg-transparent data-[active=true]:font-bold data-[active=true]:text-white data-[active=true]:[&_svg]:text-white"
                >
                    <Link
                        :href="item.href"
                        class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                    >
                        <component :is="item.icon" class="size-5 shrink-0 opacity-90" :stroke-width="2" />
                        <span class="group-data-[collapsible=icon]:hidden">{{ item.title }}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
