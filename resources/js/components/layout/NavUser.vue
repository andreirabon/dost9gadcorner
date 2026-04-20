<script setup lang="ts">
import AppearanceTabs from '@/components/settings/AppearanceTabs.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useInitials } from '@/composables/useInitials';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const user = usePage().props.auth.user! as User;

const { getInitials } = useInitials();
const showAvatar = computed(() => Boolean(user.avatar && user.avatar !== ''));

function handleLogout(): void {
    router.flushAll();
}
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <div class="flex w-full flex-col gap-3">
                <div class="px-1.5 group-data-[collapsible=icon]:hidden">
                    <AppearanceTabs compact />
                </div>

                <div
                    class="flex w-full items-center gap-2 rounded-lg px-0.5 py-1.5 transition-colors group-data-[collapsible=icon]:hidden"
                >
                    <span class="min-w-0 flex-1 truncate text-left text-sm font-medium text-sidebar-foreground">{{ user.name }}</span>
                    <Link
                        class="shrink-0 cursor-pointer rounded-md border border-red-400/45 bg-red-950/55 px-3 py-1.5 text-sm font-semibold text-red-100 shadow-[inset_0_1px_0_0_rgba(254,202,202,0.12)] transition-colors hover:border-red-300/55 hover:bg-red-900/65 hover:text-white focus-visible:ring-2 focus-visible:ring-red-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
                        method="post"
                        :href="route('logout')"
                        as="button"
                        @click="handleLogout"
                    >
                        Log out
                    </Link>
                </div>

                <div class="hidden justify-center py-1 group-data-[collapsible=icon]:flex">
                    <Avatar class="size-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
                        <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="user.name" />
                        <AvatarFallback class="rounded-lg bg-white/15 text-xs font-semibold text-white">
                            {{ getInitials(user.name) }}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
