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
        class="relative flex min-h-dvh flex-col bg-linear-to-b from-purple-950 via-purple-950/98 to-fuchsia-950/35 text-purple-50 selection:bg-purple-500/30 scheme-dark"
    >
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div class="absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/12 blur-[120px] mix-blend-screen" />
            <div class="absolute -right-[10%] bottom-0 h-[600px] w-[600px] rounded-full bg-purple-600/12 blur-[150px] mix-blend-screen" />
            <div
                class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50"
            />
        </div>

        <div class="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-12 px-safe pt-safe sm:px-6">
            <div class="w-full max-w-[420px] space-y-8">
                <div class="flex flex-col items-center text-center">
                    <img
                        src="/dostlogo.png"
                        alt="DOST Region IX"
                        class="mb-6 h-16 w-auto drop-shadow-2xl"
                        loading="eager"
                        decoding="async"
                    />
                    <h1 class="text-2xl font-semibold tracking-tight text-purple-100">
                        Gender and Development Corner
                    </h1>
                    <p class="mt-2 text-sm font-light text-purple-200/80">
                        Department of Science and Technology Region IX
                    </p>
                </div>

                <div
                    class="rounded-2xl border border-purple-400/35 bg-purple-900/55 p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:p-8"
                >
                    <div class="mb-6 flex items-start gap-2">
                        <ShieldCheck class="mt-0.5 size-4 shrink-0 text-fuchsia-300/90" stroke-width="2" aria-hidden="true" />
                        <p class="text-xs leading-relaxed font-light text-purple-200/80">
                            System restricted to authorized government personnel. Access is logged.
                        </p>
                    </div>

                    <div
                        v-if="statusMessage"
                        class="mb-6 rounded-xl border border-purple-400/35 bg-purple-900/65 px-4 py-3 text-sm text-purple-100"
                        role="status"
                        aria-live="polite"
                    >
                        {{ statusMessage }}
                    </div>

                    <form class="space-y-5" @submit.prevent="submit">
                        <div class="space-y-2">
                            <Label for="username" class="text-[13px] font-medium text-purple-100">Username</Label>
                            <div class="relative">
                                <UserRound
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-purple-300/50"
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
                                    class="h-11 border-purple-400/35 bg-purple-950/60 pr-3 pl-10 text-sm text-purple-50 transition-colors duration-200 placeholder:text-purple-300/40 focus-visible:border-purple-400 focus-visible:bg-purple-950 focus-visible:ring-4 focus-visible:ring-purple-500/20"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <InputError :message="form.errors.username" />
                        </div>

                        <div class="space-y-2">
                            <Label for="password" class="text-[13px] font-medium text-purple-100">Password</Label>
                            <div class="relative">
                                <Lock
                                    class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-purple-300/50"
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
                                    class="h-11 border-purple-400/35 bg-purple-950/60 pr-10 pl-10 text-sm text-purple-50 transition-colors duration-200 placeholder:text-purple-300/40 focus-visible:border-purple-400 focus-visible:bg-purple-950 focus-visible:ring-4 focus-visible:ring-purple-500/20"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    class="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-purple-300/50 transition-colors duration-200 hover:bg-purple-900/50 hover:text-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
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
                            class="h-11 w-full cursor-pointer rounded-xl border border-purple-400/50 bg-purple-600 text-[14px] font-semibold text-white shadow-lg shadow-purple-950/40 transition-[transform,background-color,box-shadow,border-color] duration-200 ease-out hover:border-purple-300/55 hover:bg-purple-500 hover:shadow-purple-950/55 active:scale-[0.97] disabled:opacity-50"
                            :disabled="form.processing"
                        >
                            Sign In
                        </Button>
                    </form>
                </div>

                <div class="text-center">
                    <Link
                        :href="route('index')"
                        class="inline-flex cursor-pointer items-center justify-center gap-1.5 text-[13px] font-medium text-purple-200/80 transition-colors duration-200 hover:text-purple-100"
                    >
                        <ArrowLeft class="size-3.5 shrink-0 text-current" stroke-width="2" aria-hidden="true" />
                        Return to public site
                    </Link>
                </div>
            </div>
        </div>
    </div>
</template>
