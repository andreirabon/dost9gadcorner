<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';

import DeleteUser from '@/components/settings/DeleteUser.vue';
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem, type User } from '@/types';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

const user = usePage().props.auth.user! as User;
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Profile settings" />

        <SettingsLayout>
            <div class="flex flex-col space-y-6">
                <HeadingSmall title="Profile" description="Your sign-in username" />

                <div class="rounded-lg border border-neutral-200 bg-neutral-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
                    <p class="text-sm font-medium text-foreground">Username</p>
                    <p class="mt-1.5 font-sans text-sm font-medium tabular-nums tracking-tight text-muted-foreground">{{ user.username ?? '—' }}</p>
                    <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Contact an administrator to change this.</p>
                </div>
            </div>

            <DeleteUser />
        </SettingsLayout>
    </AppLayout>
</template>
