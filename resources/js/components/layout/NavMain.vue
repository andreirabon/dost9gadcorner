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
        sectionLabel: '',
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
            v-if="sectionLabel"
            class="mb-2.5 px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.16em] text-blue-200/40 uppercase group-data-[collapsible=icon]:hidden"
        >
            {{ sectionLabel }}
        </SidebarGroupLabel>
        <SidebarMenu class="gap-1">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="navItemIsActive(page.url, item.href)"
                    :tooltip="item.title"
                    class="sidebar-nav-item"
                >
                    <template v-if="item.onClick">
                        <button
                            type="button"
                            class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                            @click="item.onClick"
                        >
                            <component :is="item.icon" class="size-[18px] shrink-0" :stroke-width="1.8" />
                            <span class="group-data-[collapsible=icon]:hidden">{{ item.title }}</span>
                        </button>
                    </template>
                    <template v-else>
                        <Link
                            :href="item.href"
                            class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                        >
                            <component :is="item.icon" class="size-[18px] shrink-0" :stroke-width="1.8" />
                            <span class="group-data-[collapsible=icon]:hidden">{{ item.title }}</span>
                        </Link>
                    </template>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
