<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
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

    <div class="theme-light-isolate inter-font flex min-h-dvh flex-col bg-white text-foreground">
        <div class="px-safe pt-safe flex w-full flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
            <div class="w-full max-w-[440px]">
                <div
                    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
                >
                    <div class="bg-[#003d7a] px-3.5 py-3 sm:px-4 sm:py-3.5">
                        <div class="flex items-center gap-2.5 sm:gap-3">
                            <img
                                src="/svg/dost.svg"
                                alt="DOST Region IX"
                                class="h-10 w-auto shrink-0 sm:h-12"
                                width="56"
                                height="56"
                                loading="eager"
                                decoding="async"
                            />
                            <div class="min-w-0 text-white">
                                <p
                                    class="text-[11px] leading-snug font-bold tracking-wide uppercase sm:text-xs sm:leading-tight"
                                >
                                    Department of Science and Technology Region IX
                                </p>
                                <p class="mt-1 text-[10px] leading-snug text-white/95 sm:text-[11px]">
                                    <span class="font-semibold">GAD Corner</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="px-4 pt-3 sm:px-5">
                        <div
                            class="flex gap-2 rounded-lg border border-amber-200/90 border-l-4 border-l-amber-400 bg-amber-50/80 px-3 py-2.5 text-amber-900"
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
                        class="mx-4 mt-3 rounded-lg border border-emerald-200/90 bg-emerald-50/90 px-3 py-2 text-center text-sm text-emerald-800 sm:mx-5"
                        role="status"
                        aria-live="polite"
                    >
                        {{ statusMessage }}
                    </div>

                    <form class="space-y-3.5 px-4 py-4 sm:px-5 sm:py-5" @submit.prevent="submit">
                        <div class="grid gap-1.5">
                            <Label for="username" class="text-sm font-medium text-slate-700">Username</Label>
                            <div class="relative">
                                <UserRound
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
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
                                    class="h-10 border-slate-200 bg-white pr-3 pl-10 shadow-xs transition-colors duration-200 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <InputError :message="form.errors.username" />
                        </div>

                        <div class="grid gap-1.5">
                            <Label for="password" class="text-sm font-medium text-slate-600">Password</Label>
                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
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
                                    class="h-10 border-slate-200 bg-white pr-10 pl-10 shadow-xs transition-colors duration-200 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    class="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25"
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

                        <div class="flex items-center gap-2">
                            <input
                                id="remember"
                                v-model="form.remember"
                                type="checkbox"
                                name="remember"
                                class="size-4 cursor-pointer rounded border-slate-300 bg-white text-indigo-600 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 focus:ring-offset-white"
                            />
                            <Label for="remember" class="cursor-pointer text-sm font-normal text-slate-600">
                                Remember me
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            class="h-11 w-full cursor-pointer rounded-full bg-[#003d7a] font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#002d5c]"
                            :disabled="form.processing"
                        >
                            Sign in
                        </Button>
                    </form>

                    <div class="border-white/15 border-t bg-[#003d7a] px-4 py-2.5 sm:px-5">
                        <div class="text-center">
                            <Link
                                :href="route('index')"
                                class="inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium text-slate-200 transition-colors duration-200 hover:text-white focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                            >
                                <ArrowLeft class="size-3.5 shrink-0 text-current" stroke-width="2" aria-hidden="true" />
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
