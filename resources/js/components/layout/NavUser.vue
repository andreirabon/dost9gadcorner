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

                <!-- Expanded: user info card -->
                <div
                    class="sidebar-user-card group-data-[collapsible=icon]:hidden"
                >
                    <div class="flex items-center gap-3">
                        <!-- Avatar -->
                        <Avatar class="size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]">
                            <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="displayHandle" />
                            <AvatarFallback class="rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100">
                                {{ getInitials(displayHandle) }}
                            </AvatarFallback>
                        </Avatar>

                        <!-- Name + role -->
                        <div class="min-w-0 flex-1 text-left">
                            <p
                                class="truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-blue-50"
                                :title="displayHandle"
                            >
                                {{ displayHandle }}
                            </p>
                            <p class="mt-0.5 text-[11px] font-medium text-blue-200/45">Signed in</p>
                        </div>

                        <!-- Logout -->
                        <Link
                            class="sidebar-logout-btn"
                            method="post"
                            :href="route('logout')"
                            as="button"
                            title="Log out"
                            @click="handleLogout"
                        >
                            <LogOut class="size-3.5" :stroke-width="1.8" aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <!-- Collapsed: avatar only -->
                <div class="hidden justify-center py-1 group-data-[collapsible=icon]:flex">
                    <Avatar class="size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]">
                        <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="displayHandle" />
                        <AvatarFallback class="rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100">
                            {{ getInitials(displayHandle) }}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
