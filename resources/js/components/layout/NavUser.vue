<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import UserMenuContent from '@/components/user/UserMenuContent.vue';
import { useInitials } from '@/composables/useInitials';
import { type User } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { ChevronsUpDown } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const page = usePage();
const user = page.props.auth.user! as User;

const menuOpen = ref(false);
const { getInitials } = useInitials();
const showAvatar = computed(() => Boolean(user.avatar && user.avatar !== ''));
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <Collapsible v-model:open="menuOpen" class="w-full">
                <CollapsibleTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        type="button"
                        class="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
                        :aria-label="`Account menu (${user.name})`"
                    >
                        <Avatar class="size-8 shrink-0 overflow-hidden rounded-lg">
                            <AvatarImage v-if="showAvatar" :src="user.avatar!" :alt="user.name" />
                            <AvatarFallback class="rounded-lg text-xs font-semibold text-black dark:text-white">
                                {{ getInitials(user.name) }}
                            </AvatarFallback>
                        </Avatar>
                        <span class="min-w-0 flex-1 truncate text-left font-medium group-data-[collapsible=icon]:hidden">{{
                            user.name
                        }}</span>
                        <ChevronsUpDown
                            class="size-4 shrink-0 opacity-60 transition-transform duration-200 group-data-[collapsible=icon]:hidden"
                            :class="menuOpen ? 'rotate-180' : ''"
                            aria-hidden="true"
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent class="overflow-hidden">
                    <UserMenuContent :user="user" plain />
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
