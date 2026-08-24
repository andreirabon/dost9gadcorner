<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, Ban, Clock, FileQuestion, Lock, ServerCrash, ShieldAlert, Timer, TriangleAlert } from '@lucide/vue';
import { computed, type Component } from 'vue';

interface Props {
    status: number;
}

const props = defineProps<Props>();

defineOptions({
    name: 'ErrorPage',
});

interface ErrorDetail {
    title: string;
    message: string;
    icon: Component;
}

/**
 * Copy is intentionally generic. The server never sends the exception message,
 * so nothing here can leak a stack trace, file path, or query.
 */
const details: Record<number, ErrorDetail> = {
    400: {
        title: 'Bad request',
        message: 'The request could not be understood. Check the address and try again.',
        icon: TriangleAlert,
    },
    401: {
        title: 'Sign in required',
        message: 'Your session is no longer active. Sign in to continue to the reporting workspace.',
        icon: Lock,
    },
    403: {
        title: 'Access denied',
        message: 'Your account does not have permission to view this page.',
        icon: ShieldAlert,
    },
    404: {
        title: 'Page not found',
        message: 'The page you are looking for was moved, renamed, or never existed.',
        icon: FileQuestion,
    },
    405: {
        title: 'Action not allowed',
        message: 'That action is not supported on this page.',
        icon: Ban,
    },
    419: {
        title: 'Session expired',
        message: 'Your session timed out for security. Reload the page and try again.',
        icon: Clock,
    },
    429: {
        title: 'Too many requests',
        message: 'You have made too many requests in a short time. Wait a moment before trying again.',
        icon: Timer,
    },
    500: {
        title: 'Something went wrong',
        message: 'An unexpected error occurred on our end. The issue has been logged for review.',
        icon: ServerCrash,
    },
    503: {
        title: 'Temporarily unavailable',
        message: 'The reporting workspace is down for maintenance. Please check back shortly.',
        icon: ServerCrash,
    },
};

const fallback: ErrorDetail = {
    title: 'Unexpected error',
    message: 'Something went wrong while loading this page.',
    icon: TriangleAlert,
};

const detail = computed<ErrorDetail>(() => details[props.status] ?? fallback);

const isSessionExpired = computed(() => props.status === 419);
const needsSignIn = computed(() => props.status === 401);

const reload = (): void => {
    window.location.reload();
};
</script>

<template>
    <Head :title="`${status} — ${detail.title}`" />

    <div class="auth-shell">
        <main class="px-safe pt-safe relative z-10 mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-10 sm:px-6">
            <div class="auth-panel sm:p-10">
                <div class="flex items-center gap-4">
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand-700 bg-brand-800">
                        <component :is="detail.icon" class="size-6 text-brand-300" stroke-width="2" aria-hidden="true" />
                    </div>
                    <p class="text-5xl font-semibold tracking-tight text-brand-50 tabular-nums sm:text-6xl">{{ status }}</p>
                </div>

                <h1 class="mt-6 text-2xl font-semibold tracking-tight text-brand-50 sm:text-3xl">{{ detail.title }}</h1>
                <p class="mt-3 max-w-[60ch] text-base leading-relaxed text-brand-200">{{ detail.message }}</p>

                <div class="mt-8 flex flex-col gap-3 border-t border-brand-800 pt-6 sm:flex-row">
                    <Button v-if="isSessionExpired" type="button" class="auth-submit sm:w-auto sm:px-6" @click="reload"> Reload page </Button>

                    <Button v-else-if="needsSignIn" as-child class="auth-submit sm:w-auto sm:px-6">
                        <Link :href="route('login')">Sign in</Link>
                    </Button>

                    <Link :href="route('index')" class="auth-quiet-link group">
                        <ArrowLeft
                            class="size-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1 motion-reduce:transition-none"
                            stroke-width="2"
                            aria-hidden="true"
                        />
                        Return to public site
                    </Link>
                </div>
            </div>
        </main>
    </div>
</template>
