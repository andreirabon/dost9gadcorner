<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import UserInfo from '@/components/user/UserInfo.vue';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/vue3';
import { FileChartColumnIncreasing, LogOut, Settings } from 'lucide-vue-next';

interface Props {
    user: User;
    /** Hide when Reports menu on home nav already lists management links */
    hideManageReports?: boolean;
    /** Hide when a standalone Log out control is shown in the shell */
    hideLogout?: boolean;
    /** Stacked links under sidebar user row (no dropdown primitives) */
    plain?: boolean;
}

const handleLogout = () => {
    router.flushAll();
};

withDefaults(defineProps<Props>(), {
    hideManageReports: false,
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
            <nav class="flex flex-col gap-0.5" aria-label="Account">
                <Link :class="sidebarLinkClass" :href="route('settings.profile.edit')" prefetch>
                    <Settings class="size-4 shrink-0 opacity-80" :stroke-width="2" aria-hidden="true" />
                    Settings
                </Link>
                <Link
                    v-if="user.is_admin && !hideManageReports"
                    :class="sidebarLinkClass"
                    :href="route('report-years.index')"
                    prefetch
                >
                    <FileChartColumnIncreasing class="size-4 shrink-0 opacity-80" :stroke-width="2" aria-hidden="true" />
                    Manage Reports
                </Link>
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
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem :as-child="true">
                <Link class="block w-full" :href="route('settings.profile.edit')" prefetch as="button">
                    <Settings class="mr-2 h-4 w-4" />
                    Settings
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem v-if="user.is_admin && !hideManageReports" :as-child="true">
                <Link class="block w-full" :href="route('report-years.index')" prefetch as="button">
                    <FileChartColumnIncreasing class="mr-2 h-4 w-4" />
                    Manage Reports
                </Link>
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator v-if="!hideLogout" />
        <DropdownMenuItem v-if="!hideLogout" :as-child="true">
            <Link class="block w-full" method="post" :href="route('logout')" @click="handleLogout" as="button">
                <LogOut class="mr-2 h-4 w-4" />
                Log out
            </Link>
        </DropdownMenuItem>
    </template>
</template>
