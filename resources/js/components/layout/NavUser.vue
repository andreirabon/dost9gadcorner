<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useInitials } from '@/composables/useInitials';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';

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

                <div
                    class="group-data-[collapsible=icon]:hidden rounded-2xl border border-blue-200/15 bg-blue-950/35 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_36px_-22px_rgba(0,0,0,0.65)]"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0 flex-1 text-left">
                            <p class="text-[10px] font-semibold uppercase tracking-widest text-blue-200/55">Signed in as</p>
                            <p
                                class="mt-0.5 truncate text-[13.5px] font-medium leading-snug tracking-tight text-blue-50"
                                :title="displayHandle"
                            >
                                {{ displayHandle }}
                            </p>
                        </div>
                        <Link
                            class="inline-flex h-8 items-center justify-center rounded-lg border border-red-300/25 bg-red-500/10 px-2.5 text-xs font-semibold text-red-200 shadow-sm transition-[background-color,color,border-color,transform] duration-200 ease-out hover:border-red-200/40 hover:bg-red-500/20 hover:text-red-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/55"
                            method="post"
                            :href="route('logout')"
                            as="button"
                            @click="handleLogout"
                        >
                            Log out
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
