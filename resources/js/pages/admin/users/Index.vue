<script setup lang="ts">
import Heading from '@/components/shared/Heading.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import type { UserRoleSlug } from '@/types';
import { Head } from '@inertiajs/vue3';
import UserPasswordRow from './UserPasswordRow.vue';

interface ManagedUser {
    id: number;
    username: string | null;
    role: UserRoleSlug | null;
}

defineProps<{
    users: ManagedUser[];
}>();
</script>

<template>
    <AppLayout>
        <Head title="Settings" />

        <div class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6">
                <Heading title="Settings" description="Reset any account's password." />
            </div>

            <div class="space-y-3">
                <UserPasswordRow v-for="user in users" :key="user.id" :id="user.id" :username="user.username ?? '—'" :role="user.role" />
            </div>
        </div>
    </AppLayout>
</template>
