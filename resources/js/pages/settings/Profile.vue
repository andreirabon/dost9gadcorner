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
            <div class="app-surface-card rounded-2xl p-5 sm:p-6">
                <HeadingSmall title="Profile" description="Your sign-in username" />

                <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">Username</p>
                    <p class="mt-1.5 font-sans text-base font-semibold tabular-nums tracking-tight text-slate-900">
                        {{ user.username ?? '—' }}
                    </p>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600">
                        Contact an administrator to change this value.
                    </p>
                </div>
            </div>

            <DeleteUser />
        </SettingsLayout>
    </AppLayout>
</template>
