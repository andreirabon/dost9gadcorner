<script setup lang="ts">
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

                <div
                    class="group-data-[collapsible=icon]:hidden rounded-2xl border border-blue-500/20 bg-purple-900/20 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0 flex-1 text-left">
                            <p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Username</p>
                            <p
                                class="mt-1 truncate font-sans text-[13px] font-semibold leading-snug tracking-tight text-slate-900 tabular-nums"
                                :title="displayHandle"
                            >
                                {{ displayHandle }}
                            </p>
                        </div>
                        <Link
                            class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
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
