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
</script>

<template>
    <template v-if="plain">
        <div class="border-t border-white/10 pt-2">
            <div class="px-2">
                <AppearanceTabs compact />
            </div>
        </div>
    </template>

    <template v-else>
        <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-3 px-2 py-2 text-left">
                <UserInfo :user="user" />
            </div>
        </DropdownMenuLabel>
        <div class="px-2 pb-2">
            <AppearanceTabs compact />
        </div>
        <DropdownMenuSeparator v-if="!hideLogout" />
        <DropdownMenuItem v-if="!hideLogout" variant="destructive" :as-child="true" class="cursor-pointer">
            <Link class="flex w-full items-center gap-2" method="post" :href="route('logout')" @click="handleLogout" as="button">
                <LogOut class="size-4 shrink-0" />
                Log out
            </Link>
        </DropdownMenuItem>
    </template>
</template>
