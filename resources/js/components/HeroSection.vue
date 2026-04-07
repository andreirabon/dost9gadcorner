<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineOptions({
    name: 'HeroSection',
});

defineProps<{
    reportManagementHref?: string | null;
}>();

defineEmits<{
    scrollToYears: [];
    scrollToNews: [];
}>();
</script>

<template>
    <section
        v-once
        aria-labelledby="hero-heading"
        class="min-h-screen min-h-screen-safe pt-safe relative isolate flex flex-col justify-center overflow-hidden px-0 pb-56 text-center sm:pb-64 md:pt-28 md:pb-72 lg:pb-80"
    >
        <div v-if="reportManagementHref" class="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
            <Link
                :href="reportManagementHref"
                class="inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                Manage Reports
                <span aria-hidden="true">→</span>
            </Link>
        </div>
        <!-- Left side decorative illustrations -->
        <div
            aria-hidden="true"
            class="pointer-events-none absolute top-[12%] left-[2%] flex w-20 items-center justify-center sm:w-28 md:w-32 lg:w-40"
        >
            <img src="/svg/gendericon.svg" alt="" class="block h-auto w-full opacity-70 sm:opacity-90" loading="lazy" decoding="async" />
        </div>

        <!-- Right side decorative illustration -->
        <div
            aria-hidden="true"
            class="pointer-events-none absolute top-[30%] right-[2%] flex w-20 items-center justify-center sm:w-28 md:w-32 lg:w-40"
        >
            <img src="/svg/development1.svg" alt="" class="block h-auto w-full opacity-70 sm:opacity-90" loading="lazy" decoding="async" />
        </div>
        <div class="absolute inset-0 -z-10 overflow-hidden">
            <!-- Subtle single-hue atmospheric background (purple) -->
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--color-purple-400)/25%,transparent_70%)]" />
        </div>

        <!-- Hero textual content -->
        <div class="px-safe relative z-10 mx-auto w-full max-w-6xl space-y-6">
            <!-- DOST Logo -->
            <div class="flex justify-center">
                <img
                    src="/svg/dost.svg"
                    alt="Department of Science and Technology"
                    class="h-16 w-auto opacity-95 sm:h-20 md:h-24"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                />
            </div>
            <p
                class="inline-block rounded-full border border-cyan-300/50 bg-cyan-800/50 bg-linear-to-r from-[#47BACD] to-[#44B4C8] bg-clip-text px-3 py-1 text-sm font-normal tracking-wide text-transparent shadow-sm sm:px-4 sm:text-base"
            >
                Department of Science and Technology Region IX
            </p>
            <h1
                id="hero-heading"
                class="glow-text m-0 bg-linear-to-r from-purple-100 via-fuchsia-300 to-pink-200 bg-clip-text px-4 text-3xl leading-tight font-semibold tracking-tight text-transparent sm:px-0 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
                Gender and Development
            </h1>
            <p class="text-responsive mx-auto max-w-2xl px-4 leading-relaxed text-pretty text-purple-100 sm:px-6">
                Discover how our projects drive gender equality, women's empowerment, and inclusive development through science and technology.
            </p>
            <div class="flex flex-col items-center justify-center gap-3 px-4 pt-2 sm:flex-row sm:gap-4">
                <button
                    type="button"
                    @click="$emit('scrollToYears')"
                    aria-label="Scroll to yearly reports section"
                    class="group touch-target tap-highlight-none inline-flex w-full items-center justify-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto sm:text-base"
                >
                    Years
                    <span aria-hidden="true">↓</span>
                </button>
                <!-- <button
                    type="button"
                    @click="$emit('scrollToNews')"
                    aria-label="Scroll to news section"
                    class="group touch-target tap-highlight-none inline-flex w-full items-center justify-center gap-2 rounded-md bg-fuchsia-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-fuchsia-500 focus-visible:ring-2 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto sm:text-base"
                >
                    View News
                    <span aria-hidden="true">↓</span>
                </button> -->
                <Link
                    v-if="reportManagementHref"
                    :href="reportManagementHref"
                    class="group touch-target tap-highlight-none inline-flex w-full items-center justify-center gap-2 rounded-md border border-cyan-300/60 bg-cyan-700/40 px-6 py-3 text-sm font-medium text-cyan-50 shadow-lg hover:bg-cyan-600/60 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto sm:text-base"
                >
                    Manage Reports
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
        <!-- Center bottom layered illustration -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex w-full justify-center select-none">
            <img
                src="/svg/huddletogether_layered.svg"
                alt=""
                class="h-32 w-auto opacity-95 sm:h-44 md:h-52 lg:h-60 xl:h-72"
                loading="lazy"
                decoding="async"
            />
        </div>
    </section>
</template>

<style scoped>
.glow-text {
    filter: drop-shadow(0 0 25px rgba(232, 121, 249, 0.5)) drop-shadow(0 0 50px rgba(168, 85, 247, 0.3)) drop-shadow(0 0 80px rgba(139, 92, 246, 0.2));
    animation: glow-pulse 4s ease-in-out infinite;
}

@keyframes glow-pulse {
    0%,
    100% {
        filter: drop-shadow(0 0 20px rgba(232, 121, 249, 0.4)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.25)) drop-shadow(0 0 70px rgba(139, 92, 246, 0.15));
    }
    33% {
        filter: drop-shadow(0 0 28px rgba(232, 121, 249, 0.55)) drop-shadow(0 0 55px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 90px rgba(139, 92, 246, 0.25));
    }
    66% {
        filter: drop-shadow(0 0 24px rgba(232, 121, 249, 0.5)) drop-shadow(0 0 48px rgba(168, 85, 247, 0.35)) drop-shadow(0 0 80px rgba(139, 92, 246, 0.2));
    }
}
</style>
