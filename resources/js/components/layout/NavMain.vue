<script setup lang="ts">
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';

defineProps<{
    items: NavItem[];
}>();

const page = usePage();
</script>

<template>
    <SidebarGroup class="px-0 py-0">
        <SidebarGroupLabel class="px-2 pb-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase dark:text-zinc-500">
            Menu
        </SidebarGroupLabel>
        <SidebarMenu class="gap-0.5">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="item.href === page.url"
                    :tooltip="item.title"
                    class="rounded-lg border border-transparent data-[active=true]:border-indigo-200 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-950 dark:data-[active=true]:border-indigo-900/60 dark:data-[active=true]:bg-indigo-950/40 dark:data-[active=true]:text-indigo-100"
                >
                    <Link :href="item.href" class="cursor-pointer">
                        <component :is="item.icon" class="size-[1.125rem] shrink-0" :stroke-width="2" />
                        <span class="font-medium">{{ item.title }}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
