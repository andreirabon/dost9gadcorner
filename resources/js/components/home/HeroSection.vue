<script setup lang="ts">
import { ChevronDown, ArrowRight } from 'lucide-vue-next';

defineOptions({
    name: 'HeroSection',
});

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
        class="min-h-dvh min-h-screen-safe relative isolate flex flex-col justify-center overflow-hidden px-0 md:pt-10 bg-[#0e0716]"
    >
        <!-- Noise Overlay -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
            <div
                aria-hidden="true"
                class="absolute inset-0 mix-blend-soft-light opacity-10"
                :style="{ backgroundImage: heroNoiseDataUrl }"
            />
            <div
                aria-hidden="true"
                class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]"
            />
            <div
                aria-hidden="true"
                class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] opacity-70"
            />
        </div>

        <div class="px-page-gutter relative z-10 mx-auto w-full max-w-5xl text-center">
            <div class="flex flex-col items-center gap-10 pb-32 pt-20">
                <img
                    src="/dostlogo.png"
                    alt="Department of Science and Technology"
                    class="h-20 w-auto opacity-95 sm:h-24 md:h-28 drop-shadow-2xl"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                />
                
                <div class="space-y-6 flex flex-col items-center">
                    <p class="text-sm font-semibold tracking-widest text-violet-400 uppercase">
                        Department of Science and Technology Region IX
                    </p>
                    <h1
                        id="hero-heading"
                        class="m-0 text-5xl font-semibold leading-none tracking-tighter text-purple-50 sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        Gender &<br />Development.
                    </h1>
                    <p class="max-w-[55ch] text-lg leading-relaxed text-purple-200/80 sm:text-xl">
                        Discover how our projects drive gender equality, women's empowerment, and inclusive development through science and technology.
                    </p>
                </div>

                <div class="flex flex-col items-center gap-4 sm:flex-row justify-center mt-4">
                    <button
                        type="button"
                        @click="$emit('scrollToYears')"
                        class="group touch-target inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-violet-500/50 bg-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-900/50 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716] focus-visible:outline-none"
                    >
                        Explore Years
                        <ArrowRight class="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" :stroke-width="2.5" />
                    </button>
                    <button
                        type="button"
                        @click="$emit('scrollToOrgChart')"
                        class="group touch-target inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-purple-100 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0716] focus-visible:outline-none"
                    >
                        Organizational Chart
                        <ChevronDown class="size-4 shrink-0 transition-transform group-hover:translate-y-1" aria-hidden="true" :stroke-width="2.5" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
