<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import UserMenuContent from '@/components/user/UserMenuContent.vue';
import { type User } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { ChevronsUpDown } from 'lucide-vue-next';
import { ref } from 'vue';

const page = usePage();
const user = page.props.auth.user! as User;

const menuOpen = ref(false);
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <Collapsible v-model:open="menuOpen" class="w-full">
                <CollapsibleTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        type="button"
                        class="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <span class="min-w-0 flex-1 truncate text-left font-medium">{{ user.name }}</span>
                        <ChevronsUpDown
                            class="size-4 shrink-0 opacity-60 transition-transform duration-200"
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
