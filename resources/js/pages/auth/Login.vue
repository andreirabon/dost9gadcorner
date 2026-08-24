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

    <div class="auth-shell">
        <main class="px-safe pt-safe relative z-10 mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 sm:px-6">
            <div class="grid w-full gap-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start lg:gap-10">
                <!--
                    Context column, hidden below lg. On a phone it was scroll
                    between the visitor and the only thing they came here to do.
                -->
                <section class="hidden flex-col gap-8 pt-6 lg:flex">
                    <div class="flex items-center gap-4">
                        <img src="/dostlogo.png" alt="DOST Region IX logo" class="h-14 w-auto" loading="eager" decoding="async" />
                        <img src="/gadlogo.png" alt="Gender and Development logo" class="h-14 w-auto" loading="eager" decoding="async" />
                        <img
                            src="/Bagong_Pilipinas_logo.png"
                            alt="Bagong Pilipinas logo"
                            class="h-14 w-auto max-w-[170px] object-contain"
                            loading="eager"
                            decoding="async"
                        />
                    </div>

                    <div>
                        <p class="auth-eyebrow">Regional GAD reporting workspace</p>
                        <h1 class="mt-3 max-w-[22ch] text-4xl leading-[1.1] font-semibold tracking-tight text-brand-50">
                            Gender-disaggregated reporting for DOST Region IX.
                        </h1>
                        <p class="mt-4 max-w-[58ch] text-base leading-relaxed text-brand-200">
                            Encode, validate, and publish annual data across GFPS membership, employees, scholarship, RSTL, and funding programs.
                        </p>
                    </div>

                    <ul class="m-0 flex list-none flex-col gap-4 p-0 text-sm leading-relaxed text-brand-200">
                        <li class="flex items-start gap-3">
                            <ShieldCheck class="mt-0.5 size-4 shrink-0 text-brand-300" stroke-width="2" aria-hidden="true" />
                            Access is restricted to authorized personnel. All sign-ins are recorded for accountability.
                        </li>
                        <li class="flex items-start gap-3">
                            <Lock class="mt-0.5 size-4 shrink-0 text-brand-300" stroke-width="2" aria-hidden="true" />
                            Use your assigned account credentials to continue to the reporting dashboard.
                        </li>
                    </ul>
                </section>

                <section class="auth-panel">
                    <div class="mb-4 flex items-center gap-2.5 lg:hidden">
                        <img src="/dostlogo.png" alt="DOST Region IX logo" class="h-10 w-auto" loading="eager" decoding="async" />
                        <img src="/gadlogo.png" alt="Gender and Development logo" class="h-10 w-auto" loading="eager" decoding="async" />
                        <img
                            src="/Bagong_Pilipinas_logo.png"
                            alt="Bagong Pilipinas logo"
                            class="h-10 w-auto max-w-[118px] object-contain"
                            loading="eager"
                            decoding="async"
                        />
                    </div>

                    <p class="auth-eyebrow">Authorized access</p>
                    <h2 class="mt-2 text-2xl font-semibold tracking-tight text-brand-50">Sign in to continue</h2>
                    <p class="mt-2 text-sm leading-relaxed text-brand-200">Department of Science and Technology Region IX</p>

                    <div
                        v-if="statusMessage"
                        class="mt-5 rounded-xl border border-brand-700 bg-brand-800 px-4 py-3 text-sm text-brand-50"
                        role="status"
                        aria-live="polite"
                    >
                        {{ statusMessage }}
                    </div>

                    <form class="mt-6 space-y-5" @submit.prevent="submit">
                        <div class="space-y-2">
                            <Label for="username" class="text-sm font-medium text-brand-100">Username</Label>
                            <div class="relative">
                                <UserRound
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-300"
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
                                    class="auth-field pr-3 pl-10"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <InputError :message="form.errors.username" />
                        </div>

                        <div class="space-y-2">
                            <Label for="password" class="text-sm font-medium text-brand-100">Password</Label>
                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-300"
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
                                    class="auth-field pr-10 pl-10"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    class="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-brand-300 transition-colors duration-200 hover:bg-brand-800 hover:text-brand-50 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none active:scale-[0.97]"
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

                        <Button type="submit" class="auth-submit" :disabled="form.processing">Sign In</Button>
                    </form>

                    <div class="mt-6 border-t border-brand-800 pt-5">
                        <Link
                            :href="route('index')"
                            class="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand-200 transition-colors duration-200 hover:text-brand-50"
                        >
                            <ArrowLeft
                                class="size-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1 motion-reduce:transition-none"
                                stroke-width="2"
                                aria-hidden="true"
                            />
                            Return to public site
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>
