<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useInitials } from '@/composables/useInitials';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';
import { LogOut } from '@lucide/vue';

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
            <div class="flex w-full flex-col gap-2.5">
                <!-- Expanded: user row (see .sidebar-user-card — a row, not a card) -->
                <div class="sidebar-user-card group-data-[collapsible=icon]:hidden">
                    <div class="flex items-center gap-2.5">
                        <!-- Avatar -->
                        <Avatar class="size-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                            <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="displayHandle" />
                            <AvatarFallback class="rounded-lg bg-blue-700 text-[11px] font-semibold text-white">
                                {{ getInitials(displayHandle) }}
                            </AvatarFallback>
                        </Avatar>

                        <!-- Name + role -->
                        <div class="min-w-0 flex-1 text-left">
                            <p class="truncate text-[13px] leading-tight font-semibold text-blue-50" :title="displayHandle">
                                {{ displayHandle }}
                            </p>
                            <!-- /60 measures 5.1:1; /45 measured 3.46:1 and failed AA. -->
                            <p class="mt-0.5 text-[11px] font-medium text-blue-200/60">Signed in</p>
                        </div>
                    </div>
                </div>

                <!-- Collapsed: avatar only. Placed before the logout link so the
                     rail order matches the expanded order — user identity, then
                     the action that acts on it. -->
                <div class="hidden justify-center py-1 group-data-[collapsible=icon]:flex">
                    <Avatar class="size-9 shrink-0 overflow-hidden rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
                        <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="displayHandle" />
                        <AvatarFallback class="rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100">
                            {{ getInitials(displayHandle) }}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <!-- Logout sits under the identity it acts on, so the row reads
                     "this is you" then "leave". Kept a sibling of the user row, not a
                     child: nesting it inherited the row's inset and pushed its icon
                     10px right of the avatar and the Homepage arrow. -->
                <Link class="sidebar-logout-btn" method="post" :href="route('logout')" as="button" title="Log out" @click="handleLogout">
                    <LogOut class="size-4 shrink-0" :stroke-width="1.8" aria-hidden="true" />
                    <span class="group-data-[collapsible=icon]:hidden">Log out</span>
                </Link>
            </div>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
