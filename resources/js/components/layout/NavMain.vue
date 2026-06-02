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
            class="mb-2 px-2 pt-0.5 pb-2 text-[10px] font-semibold tracking-widest text-blue-200/55 uppercase group-data-[collapsible=icon]:hidden"
        >
            {{ sectionLabel }}
        </SidebarGroupLabel>
        <SidebarMenu class="gap-1.5">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="navItemIsActive(page.url, item.href)"
                    :tooltip="item.title"
                    class="h-auto min-h-11 rounded-xl border border-transparent py-2.5 text-[14px] font-medium text-blue-100/75 transition-[background-color,color,border-color,transform] duration-200 ease-out hover:border-blue-200/15 hover:bg-white/8 hover:text-blue-50 active:scale-[0.985] data-[active=true]:border-blue-200/30 data-[active=true]:bg-blue-500/15 data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] data-[active=true]:[&_svg]:text-blue-100"
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
