<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

// Components
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const passwordInput = ref<HTMLInputElement | null>(null);

const form = useForm({
    password: '',
});

const deleteUser = (e: Event) => {
    e.preventDefault();

    form.delete(route('settings.profile.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value?.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    form.clearErrors();
    form.reset();
};
</script>

<template>
    <div class="app-surface-card space-y-6 rounded-2xl p-5 sm:p-6">
        <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />
        <div class="space-y-4 rounded-xl border border-red-200 bg-red-50/90 p-4">
            <div class="relative space-y-1 text-red-700">
                <p class="text-xs font-semibold tracking-[0.14em] uppercase">Warning</p>
                <p class="text-sm leading-relaxed">This action permanently deletes your account and all associated data.</p>
            </div>
            <Dialog>
                <DialogTrigger as-child>
                    <Button
                        variant="destructive"
                        class="cursor-pointer rounded-xl border border-red-700/20 transition-[transform,background-color,border-color] duration-200 ease-out active:scale-[0.97]"
                    >
                        Delete account
                    </Button>
                </DialogTrigger>
                <DialogContent class="border-slate-200 bg-white text-slate-900 sm:max-w-md">
                    <form class="space-y-6" @submit="deleteUser">
                        <DialogHeader class="space-y-3">
                            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                            <DialogDescription>
                                Once your account is deleted, all resources and data will be permanently removed.
                                Please enter your password to confirm.
                            </DialogDescription>
                        </DialogHeader>

                        <div class="grid gap-2">
                            <Label for="password" class="sr-only">Password</Label>
                            <Input
                                id="password"
                                ref="passwordInput"
                                v-model="form.password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                class="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                            />
                            <InputError :message="form.errors.password" />
                        </div>

                        <DialogFooter class="gap-2">
                            <DialogClose as-child>
                                <Button
                                    variant="secondary"
                                    class="cursor-pointer rounded-xl"
                                    @click="closeModal"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                variant="destructive"
                                class="cursor-pointer rounded-xl transition-transform duration-200 ease-out active:scale-[0.97]"
                                :disabled="form.processing"
                            >
                                Delete account
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
