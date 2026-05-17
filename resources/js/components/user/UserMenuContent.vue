<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import UserInfo from '@/components/user/UserInfo.vue';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/vue3';


interface Props {
    user: User;
    /** Hide when a standalone Log out control is shown in the shell */
    hideLogout?: boolean;
}

const handleLogout = () => {
    router.flushAll();
};

withDefaults(defineProps<Props>(), {
    hideLogout: false,
});
</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-3 px-2 py-2 text-left">
            <UserInfo :user="user" />
        </div>
    </DropdownMenuLabel>
        <DropdownMenuSeparator v-if="!hideLogout" />
        <DropdownMenuItem v-if="!hideLogout" variant="destructive" :as-child="true" class="cursor-pointer">
            <Link class="flex w-full items-center" method="post" :href="route('logout')" @click="handleLogout" as="button">
                Log out
            </Link>
        </DropdownMenuItem>
</template>
