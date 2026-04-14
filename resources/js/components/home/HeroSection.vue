<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineOptions({
    name: 'HeroSection',
});

defineProps<{
    reportManagementHref?: string | null;
}>();

const heroNoiseDataUrl =
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'128\' height=\'128\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'128\' height=\'128\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")';

defineEmits<{
    scrollToYears: [];
    scrollToOrgChart: [];
}>();
</script>

<template>
    <section
        aria-labelledby="hero-heading"
        class="min-h-screen min-h-screen-safe pt-safe relative isolate flex flex-col justify-center overflow-hidden px-0 pb-56 text-center sm:pb-64 md:pt-28 md:pb-72 lg:pb-80"
    >
        <div
            v-if="reportManagementHref"
            class="absolute top-[max(1rem,env(safe-area-inset-top,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-20 sm:top-[max(1.5rem,env(safe-area-inset-top,0px))] sm:right-[max(1.5rem,env(safe-area-inset-right,0px))]"
        >
            <Link
                :href="reportManagementHref"
                class="inline-flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-700/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition-colors duration-200 hover:bg-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none"
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
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,var(--color-purple-400)/22%,transparent_68%)]" />
            <div
                aria-hidden="true"
                class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size-[40px_40px] opacity-80"
            />
            <div
                aria-hidden="true"
                class="absolute inset-0 mix-blend-soft-light opacity-[0.04]"
                :style="{ backgroundImage: heroNoiseDataUrl }"
            />
            <div
                aria-hidden="true"
                class="absolute top-[20%] -left-[20%] h-[28rem] w-[28rem] rounded-full bg-violet-500/14 blur-3xl sm:-left-[10%]"
            />
            <div
                aria-hidden="true"
                class="absolute top-[35%] -right-[18%] h-[26rem] w-[26rem] rounded-full bg-purple-500/12 blur-3xl sm:-right-[8%]"
            />
            <div
                aria-hidden="true"
                class="absolute bottom-[-5%] left-[25%] h-[22rem] w-[22rem] rounded-full bg-violet-400/10 blur-3xl"
            />
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
                class="inline-block rounded-full border border-purple-300/40 bg-purple-950/35 px-3 py-1 text-sm font-normal tracking-wide text-purple-100/95 shadow-sm sm:px-4 sm:text-base"
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
            <div class="flex flex-col items-center justify-center gap-3 px-4 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">
                <button
                    type="button"
                    @click="$emit('scrollToYears')"
                    aria-label="Scroll to yearly reports section"
                    class="group touch-target tap-highlight-none inline-flex w-full items-center justify-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-950/25 hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none sm:w-auto sm:text-base"
                >
                    Years
                    <span aria-hidden="true">↓</span>
                </button>
                <button
                    type="button"
                    @click="$emit('scrollToOrgChart')"
                    aria-label="Scroll to organizational chart section"
                    class="group touch-target tap-highlight-none inline-flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-950/25 hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none sm:w-auto sm:text-base"
                >
                    Organizational Chart
                    <span aria-hidden="true">↓</span>
                </button>
                <Link
                    v-if="reportManagementHref"
                    :href="reportManagementHref"
                    class="group touch-target tap-highlight-none inline-flex w-full items-center justify-center gap-2 rounded-md border border-purple-400/45 bg-purple-900/55 px-6 py-3 text-sm font-medium text-purple-50 shadow-lg shadow-purple-950/20 hover:bg-purple-800/70 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none sm:w-auto sm:text-base"
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
