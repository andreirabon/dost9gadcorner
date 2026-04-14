<script setup lang="ts">
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
import { Head, Link, useForm } from '@inertiajs/vue3';
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Lock, UserRound } from 'lucide-vue-next';
import { computed, ref } from 'vue';

interface Props {
    status?: string | null;
}

const props = defineProps<Props>();

defineOptions({
    name: 'LoginPage',
});

const form = useForm({
    username: '',
    password: '',
    remember: false,
});

const statusMessage = computed(() => props.status ?? null);

const showPassword = ref(false);

const submit = (): void => {
    form.post(route('login.store'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <Head title="Sign in" />

    <div class="theme-light-isolate inter-font flex min-h-dvh flex-col bg-slate-50 text-foreground">
        <div class="px-safe pt-safe flex w-full flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
            <div class="w-full max-w-[420px]">
                <div
                    class="rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_6px_-1px_rgba(15,23,42,0.06),0_20px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-950/4"
                >


                    <div class="px-6 pt-5">
                        <div
                            class="flex gap-3 rounded-xl border border-amber-200/90 bg-amber-50 px-3.5 py-3 text-amber-950"
                            role="note"
                        >
                            <AlertTriangle class="mt-0.5 size-4 shrink-0 text-amber-600" stroke-width="2" aria-hidden="true" />
                            <p class="text-xs leading-snug sm:text-[13px]">
                                <span class="font-semibold">Security notice:</span>
                                This system is restricted to authorized government personnel only.
                            </p>
                        </div>
                    </div>

                    <div
                        v-if="statusMessage"
                        class="mx-6 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center text-sm text-emerald-900"
                        role="status"
                        aria-live="polite"
                    >
                        {{ statusMessage }}
                    </div>

                    <form class="space-y-5 px-6 py-6" @submit.prevent="submit">
                        <div class="grid gap-2">
                            <Label for="username" class="text-sm font-medium text-foreground"> Username </Label>
                            <div class="relative">
                                <UserRound
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    stroke-width="2"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="username"
                                    v-model="form.username"
                                    type="text"
                                    name="username"
                                    required
                                    autocomplete="username"
                                    autocapitalize="none"
                                    autocorrect="off"
                                    spellcheck="false"
                                    class="h-11 border-slate-200 bg-white pr-3 pl-10 shadow-xs transition-colors focus-visible:border-indigo-300 focus-visible:ring-indigo-500/20"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <InputError :message="form.errors.username" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="password" class="text-sm font-medium text-foreground"> Password </Label>
                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    stroke-width="2"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="password"
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    name="password"
                                    required
                                    autocomplete="current-password"
                                    class="h-11 border-slate-200 bg-white pr-10 pl-10 shadow-xs transition-colors focus-visible:border-indigo-300 focus-visible:ring-indigo-500/20"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    class="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-slate-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                                    :aria-pressed="showPassword"
                                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                    @click="showPassword = !showPassword"
                                >
                                    <EyeOff v-if="showPassword" class="size-4" stroke-width="2" />
                                    <Eye v-else class="size-4" stroke-width="2" />
                                </button>
                            </div>
                            <InputError :message="form.errors.password" />
                        </div>

                        <div class="flex items-center gap-2.5">
                            <input
                                id="remember"
                                v-model="form.remember"
                                type="checkbox"
                                name="remember"
                                class="size-4 cursor-pointer rounded border-slate-300 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 focus:ring-offset-white"
                            />
                            <Label for="remember" class="cursor-pointer text-sm font-normal text-muted-foreground">
                                Remember me
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            class="h-11 w-full cursor-pointer rounded-lg bg-indigo-600 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700"
                            :disabled="form.processing"
                        >
                            Sign in
                        </Button>
                    </form>

                    <div class="space-y-4 rounded-b-2xl border-border border-t bg-slate-50/80 px-6 py-4">
                        <p class="text-center text-sm text-muted-foreground">
                            Forgot your password?
                            <Dialog>
                                <DialogTrigger as-child>
                                    <button
                                        type="button"
                                        class="cursor-pointer font-medium text-indigo-600 underline decoration-indigo-600/30 underline-offset-2 transition-colors duration-200 hover:text-indigo-700 hover:decoration-indigo-600/50 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                                    >
                                        Click here
                                    </button>
                                </DialogTrigger>
                                <DialogContent class="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Forgot your password?</DialogTitle>
                                        <DialogDescription class="text-base text-muted-foreground">
                                            Please contact the Administrator.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose as-child>
                                            <Button type="button" class="cursor-pointer"> OK </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </p>
                        <div class="text-center">
                            <Link
                                :href="route('index')"
                                class="inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                            >
                                <ArrowLeft class="size-3.5" stroke-width="2" aria-hidden="true" />
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
