<script setup lang="ts">
import AppearanceTabs from '@/components/settings/AppearanceTabs.vue';
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import UserInfo from '@/components/user/UserInfo.vue';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/vue3';
import { LogOut } from 'lucide-vue-next';

interface Props {
    user: User;
    /** Hide when a standalone Log out control is shown in the shell */
    hideLogout?: boolean;
    /** Stacked links under sidebar user row (no dropdown primitives) */
    plain?: boolean;
}

const handleLogout = () => {
    router.flushAll();
};

withDefaults(defineProps<Props>(), {
    hideLogout: false,
    plain: false,
});

const sidebarLinkClass =
    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring';
</script>

<template>
    <template v-if="plain">
        <div class="space-y-2 border-sidebar-border border-t pt-2">
            <p class="truncate px-2 text-xs text-muted-foreground">{{ user.email }}</p>
            <div class="px-2">
                <AppearanceTabs compact />
            </div>
            <nav class="flex flex-col gap-0.5" aria-label="Account">
                <Link
                    v-if="!hideLogout"
                    :class="sidebarLinkClass"
                    method="post"
                    :href="route('logout')"
                    as="button"
                    @click="handleLogout"
                >
                    <LogOut class="size-4 shrink-0 opacity-80" :stroke-width="2" aria-hidden="true" />
                    Log out
                </Link>
            </nav>
        </div>
    </template>

    <template v-else>
        <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserInfo :user="user" :show-email="true" />
            </div>
        </DropdownMenuLabel>
        <div class="px-2 pb-2">
            <AppearanceTabs compact />
        </div>
        <DropdownMenuSeparator v-if="!hideLogout" />
        <DropdownMenuItem v-if="!hideLogout" :as-child="true">
            <Link class="block w-full" method="post" :href="route('logout')" @click="handleLogout" as="button">
                <LogOut class="mr-2 h-4 w-4" />
                Log out
            </Link>
        </DropdownMenuItem>
    </template>
</template>
