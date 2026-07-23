<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck, UserRound } from '@lucide/vue';
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
    <Head title="Sign In" />

    <div
        class="relative flex min-h-dvh flex-col bg-linear-to-b from-slate-950 via-blue-950/95 to-slate-950 text-slate-50 scheme-dark selection:bg-blue-500/30"
    >
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div class="absolute top-0 left-[-10%] h-[520px] w-[520px] rounded-full bg-blue-500/14 mix-blend-screen blur-[130px]" />
            <div class="absolute right-[-10%] bottom-0 h-[620px] w-[620px] rounded-full bg-cyan-500/12 mix-blend-screen blur-[150px]" />
            <div
                class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50"
            />
        </div>

        <div class="px-safe pt-safe relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
            <div class="grid w-full gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
                <section
                    class="hidden min-h-[560px] flex-col justify-between rounded-3xl border border-blue-200/15 bg-slate-900/55 p-8 text-left shadow-[0_18px_44px_-22px_rgba(2,6,23,0.75)] ring-1 ring-white/10 backdrop-blur-xl lg:flex"
                >
                    <div>
                        <div class="mb-6 flex items-center gap-3">
                            <img src="/dostlogo.png" alt="DOST Region IX logo" class="h-14 w-auto drop-shadow-xl" loading="eager" decoding="async" />
                            <img
                                src="/gadlogo.png"
                                alt="Gender and Development logo"
                                class="h-14 w-auto rounded-full bg-white/5 p-0.5 drop-shadow-xl"
                                loading="eager"
                                decoding="async"
                            />
                            <img
                                src="/Bagong_Pilipinas_logo.png"
                                alt="Bagong Pilipinas logo"
                                class="h-14 w-auto max-w-[170px] object-contain drop-shadow-xl"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                        <p class="text-xs font-semibold tracking-[0.18em] text-blue-200/85 uppercase">Regional GAD reporting workspace</p>
                        <h1 class="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
                            Reliable gender-disaggregated reporting for DOST Region IX.
                        </h1>
                        <p class="mt-4 max-w-[60ch] text-sm leading-relaxed text-slate-300/85">
                            Securely encode, validate, and publish annual data across GFPS membership, employees, scholarship, RSTL, and funding
                            programs.
                        </p>
                    </div>

                    <div class="space-y-3">
                        <div class="rounded-2xl border border-blue-300/14 bg-slate-950/40 p-4">
                            <div class="flex items-start gap-2.5">
                                <ShieldCheck class="mt-0.5 size-4 shrink-0 text-blue-300/90" stroke-width="2" aria-hidden="true" />
                                <p class="text-sm leading-relaxed text-slate-300/85">
                                    Access is restricted to authorized personnel. All sign-ins are recorded for accountability.
                                </p>
                            </div>
                        </div>
                        <div class="rounded-2xl border border-blue-300/14 bg-slate-950/40 p-4">
                            <div class="flex items-start gap-2.5">
                                <Lock class="mt-0.5 size-4 shrink-0 text-blue-300/90" stroke-width="2" aria-hidden="true" />
                                <p class="text-sm leading-relaxed text-slate-300/85">
                                    Use your assigned account credentials to continue to the reporting dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="w-full lg:flex">
                    <div
                        class="flex w-full flex-col rounded-3xl border border-white/12 bg-slate-900/68 p-6 shadow-[0_18px_44px_-22px_rgba(2,6,23,0.72)] ring-1 ring-white/10 backdrop-blur-xl sm:p-8 lg:min-h-[560px]"
                    >
                        <div class="mb-6 text-left lg:pt-20">
                            <div class="mb-4 flex items-center gap-2.5 lg:hidden">
                                <img
                                    src="/dostlogo.png"
                                    alt="DOST Region IX logo"
                                    class="h-10 w-auto drop-shadow-lg"
                                    loading="eager"
                                    decoding="async"
                                />
                                <img
                                    src="/gadlogo.png"
                                    alt="Gender and Development logo"
                                    class="h-10 w-auto rounded-full bg-white/5 p-0.5 drop-shadow-lg"
                                    loading="eager"
                                    decoding="async"
                                />
                                <img
                                    src="/Bagong_Pilipinas_logo.png"
                                    alt="Bagong Pilipinas logo"
                                    class="h-10 w-auto max-w-[118px] object-contain drop-shadow-lg"
                                    loading="eager"
                                    decoding="async"
                                />
                            </div>
                            <p class="text-xs font-semibold tracking-[0.18em] text-blue-200/80 uppercase">Authorized access</p>
                            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Sign in to continue</h2>
                            <p class="mt-2 text-sm leading-relaxed text-slate-300/80">Department of Science and Technology Region IX</p>
                        </div>

                        <div
                            v-if="statusMessage"
                            class="mb-6 rounded-xl border border-blue-300/30 bg-blue-500/12 px-4 py-3 text-sm text-blue-100"
                            role="status"
                            aria-live="polite"
                        >
                            {{ statusMessage }}
                        </div>

                        <form class="space-y-5" @submit.prevent="submit">
                            <div class="space-y-2">
                                <Label for="username" class="text-sm font-medium text-slate-100">Username</Label>
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
                                        maxlength="255"
                                        autocomplete="username"
                                        autocapitalize="none"
                                        autocorrect="off"
                                        spellcheck="false"
                                        class="h-11 border-white/15 bg-slate-950/65 pr-3 pl-10 text-slate-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-slate-400/70 focus-visible:border-blue-400/60 focus-visible:bg-slate-950 focus-visible:ring-4 focus-visible:ring-blue-500/20"
                                        placeholder="Enter your username"
                                    />
                                </div>
                                <InputError :message="form.errors.username" />
                            </div>

                            <div class="space-y-2">
                                <Label for="password" class="text-sm font-medium text-slate-100">Password</Label>
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
                                        maxlength="255"
                                        autocomplete="current-password"
                                        class="h-11 border-white/15 bg-slate-950/65 pr-10 pl-10 text-slate-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-slate-400/70 focus-visible:border-blue-400/60 focus-visible:bg-slate-950 focus-visible:ring-4 focus-visible:ring-blue-500/20"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        class="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-slate-800/70 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:outline-none active:scale-[0.97]"
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

                            <Button
                                type="submit"
                                class="group h-11 w-full cursor-pointer rounded-xl border border-blue-300/35 bg-blue-600 text-[14px] font-semibold text-white shadow-lg shadow-blue-950/35 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-blue-200/50 hover:bg-blue-500 hover:shadow-blue-950/50 active:scale-[0.97] disabled:opacity-50"
                                :disabled="form.processing"
                            >
                                Sign In
                            </Button>
                        </form>
                        <div class="mt-6 border-t border-white/10 pt-5 text-center lg:mt-auto">
                            <Link
                                :href="route('index')"
                                class="group inline-flex cursor-pointer items-center justify-center gap-1.5 text-[13px] font-medium text-slate-300/80 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-slate-100"
                            >
                                <ArrowLeft
                                    class="size-3.5 shrink-0 text-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1"
                                    stroke-width="2"
                                    aria-hidden="true"
                                />
                                Return to public site
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
