<script setup lang="ts">
import AppearanceTabs from '@/components/settings/AppearanceTabs.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useInitials } from '@/composables/useInitials';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';
import { LogOut } from 'lucide-vue-next';
import { computed } from 'vue';

const user = usePage().props.auth.user! as User;

const { getInitials } = useInitials();
const showAvatar = computed(() => Boolean(user.avatar && user.avatar !== ''));
const displayHandle = computed(() => user.username?.trim() || '—');

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
                    class="group-data-[collapsible=icon]:hidden rounded-lg border border-sidebar-border bg-sidebar-accent/35 px-3 py-2.5 shadow-sm backdrop-blur-[2px]"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0 flex-1 text-left">
                            <p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-foreground/55">Username</p>
                            <p
                                class="mt-1 truncate font-sans text-[13px] font-semibold leading-snug tracking-tight text-sidebar-accent-foreground tabular-nums"
                                :title="displayHandle"
                            >
                                {{ displayHandle }}
                            </p>
                        </div>
                        <Link
                            class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-red-700/40 bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:border-red-800/50 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar [&_svg]:text-white"
                            method="post"
                            :href="route('logout')"
                            as="button"
                            @click="handleLogout"
                        >
                            <LogOut class="size-3.5 shrink-0 opacity-95" aria-hidden="true" />
                            <span>Log out</span>
                        </Link>
                    </div>
                </div>

                <div class="hidden justify-center py-1 group-data-[collapsible=icon]:flex">
                    <Avatar class="size-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
                        <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="displayHandle" />
                        <AvatarFallback class="rounded-lg bg-white/15 text-xs font-semibold text-white">
                            {{ getInitials(displayHandle) }}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
