<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

const passwordInput = ref<HTMLInputElement | null>(null);
const currentPasswordInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = () => {
    form.put(route('settings.password.update'), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: (errors: any) => {
            if (errors.password) {
                form.reset('password', 'password_confirmation');
                if (passwordInput.value instanceof HTMLInputElement) {
                    passwordInput.value.focus();
                }
            }

            if (errors.current_password) {
                form.reset('current_password');
                if (currentPasswordInput.value instanceof HTMLInputElement) {
                    currentPasswordInput.value.focus();
                }
            }
        },
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Password settings" />

        <SettingsLayout>
            <div class="app-surface-card space-y-6 rounded-2xl p-5 sm:p-6">
                <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                <form @submit.prevent="updatePassword" class="space-y-6">
                    <div class="grid gap-2">
                        <Label for="current_password" class="text-[13px] font-medium text-slate-800">Current password</Label>
                        <Input
                            id="current_password"
                            ref="currentPasswordInput"
                            v-model="form.current_password"
                            type="password"
                            class="mt-1 block h-11 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                            autocomplete="current-password"
                            placeholder="Current password"
                        />
                        <InputError :message="form.errors.current_password" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="password" class="text-[13px] font-medium text-slate-800">New password</Label>
                        <Input
                            id="password"
                            ref="passwordInput"
                            v-model="form.password"
                            type="password"
                            class="mt-1 block h-11 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                            autocomplete="new-password"
                            placeholder="New password"
                        />
                        <InputError :message="form.errors.password" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="password_confirmation" class="text-[13px] font-medium text-slate-800">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            type="password"
                            class="mt-1 block h-11 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                            autocomplete="new-password"
                            placeholder="Confirm password"
                        />
                        <InputError :message="form.errors.password_confirmation" />
                    </div>

                    <div class="flex items-center gap-4">
                        <Button
                            :disabled="form.processing"
                            class="h-10 cursor-pointer rounded-xl border border-blue-800/15 bg-blue-700 px-5 text-sm font-semibold text-white transition-[transform,background-color,border-color] duration-200 ease-out hover:bg-blue-600 active:scale-[0.97]"
                        >
                            Save password
                        </Button>

                        <Transition
                            enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition duration-150 ease-out"
                            leave-to-class="opacity-0"
                        >
                            <p v-show="form.recentlySuccessful" class="text-sm font-medium text-emerald-700">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
