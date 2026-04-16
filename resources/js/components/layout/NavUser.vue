<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import UserMenuContent from '@/components/user/UserMenuContent.vue';
import { useInitials } from '@/composables/useInitials';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';
import { ChevronsUpDown } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const user = usePage().props.auth.user! as User;

const menuOpen = ref(false);
const { getInitials } = useInitials();
const showAvatar = computed(() => Boolean(user.avatar && user.avatar !== ''));

function handleLogout(): void {
    router.flushAll();
}
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <Collapsible v-model:open="menuOpen" class="w-full">
                <div
                    class="flex w-full items-center gap-2 rounded-lg px-0.5 py-1.5 transition-colors group-data-[collapsible=icon]:hidden"
                >
                    <CollapsibleTrigger as-child>
                        <button
                            type="button"
                            class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#8a99c0] transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                            :aria-expanded="menuOpen"
                            :aria-label="menuOpen ? 'Collapse account options' : 'Expand account options'"
                        >
                            <ChevronsUpDown
                                class="size-4 transition-transform duration-200"
                                :class="menuOpen ? 'rotate-180' : ''"
                                aria-hidden="true"
                            />
                        </button>
                    </CollapsibleTrigger>
                    <span class="min-w-0 flex-1 truncate text-left text-sm font-medium text-sidebar-foreground">{{ user.name }}</span>
                    <Link
                        class="shrink-0 cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
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

                <CollapsibleContent class="overflow-hidden">
                    <UserMenuContent :user="user" plain hide-logout />
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
