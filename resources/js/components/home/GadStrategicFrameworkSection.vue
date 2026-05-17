<script setup lang="ts">
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

defineOptions({
    name: 'GadStrategicFrameworkSection',
});

const MANDATE_TEXT =
    'The Department of Science and Technology Region IX is mandated to mainstream Gender and Development in all regional policies, programs, and activities in accordance with the Constitution, the Magna Carta of Women (RA 9710), and PCW guidelines, ensuring that science, technology, and innovation initiatives are gender-responsive, inclusive, and equitable. ' +
    'DOST IX shall promote equal access and participation of women and men in science, research, innovation, and technology transfer; address region-specific gender issues, particularly among marginalized sectors; ensure a safe and respectful workplace; and institutionalize GAD mechanisms.';

const sectionRef = ref<HTMLElement | null>(null);
const gridRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

onMounted(async () => {
    await nextTick();

    const scopeRoot = sectionRef.value;
    if (!scopeRoot || !gridRef.value) {
        return;
    }

    ctx = gsap.context(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Bento grid cards stagger reveal
        const cards = gridRef.value?.querySelectorAll('.bento-card');
        if (cards && cards.length > 0) {
            gsap.fromTo(
                cards,
                { autoAlpha: 0, y: 40, scale: 0.98 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: gridRef.value,
                        start: 'top 85%',
                    },
                },
            );
        }
    }, scopeRoot);

    await nextTick();
    ScrollTrigger.refresh();
});

onBeforeUnmount(() => {
    ctx?.revert();
    ctx = null;
});

</script>

<template>
    <section
        id="gad-strategic-framework"
        ref="sectionRef"
        class="relative isolate scroll-mt-24 overflow-x-clip border-t border-white/5 bg-[#0e0716] sm:scroll-mt-28"
        aria-label="GAD Strategic Framework"
        data-focus-anchor="true"
        tabindex="-1"
    >
        <!-- Subtle Background Glows -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute -left-[20%] top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen"></div>
            <div class="absolute -right-[20%] bottom-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen"></div>
        </div>

        <div class="relative z-10 mx-auto w-full max-w-7xl px-page-gutter pb-20 pt-16 sm:pb-28 sm:pt-24 md:pb-32">
            
            <div class="mb-12 md:mb-16 text-center lg:text-left">
                <h2 class="text-4xl font-semibold tracking-tighter text-purple-50 sm:text-5xl md:text-5xl">
                    Strategic <span class="text-violet-400">Framework</span>
                </h2>
                <p class="mt-4 max-w-2xl text-lg text-purple-200/70 mx-auto lg:mx-0">
                    The foundation of our commitment to gender-responsive science, technology, and innovation.
                </p>
            </div>

            <!-- Bento Grid 2.0: 2-Column Balanced Layout -->
            <div ref="gridRef" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                
                <!-- 1. Mandate (Full Width) -->
                <article class="bento-card group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-purple-900/20 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-violet-500/40 hover:bg-purple-900/30 md:col-span-2 lg:p-10">
                    <div class="relative z-10 mb-6 md:mb-8">
                        <h3 class="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-400">Mandate.</h3>
                    </div>
                    <div class="relative z-10 lg:max-w-[85%]">
                        <p class="text-base sm:text-lg font-light leading-relaxed text-purple-100/90 tracking-tight">
                            {{ MANDATE_TEXT }}
                        </p>
                    </div>
                </article>

                <!-- 2. Vision (Half Width) -->
                <article class="bento-card group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-purple-900/20 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-violet-500/40 hover:bg-purple-900/30 lg:p-10">
                    <div class="relative z-10 mb-6 md:mb-8 flex flex-col items-start gap-6">
                        <h3 class="font-sans text-4xl sm:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-400">Vision.</h3>
                    </div>
                    <div class="relative z-10">
                        <p class="text-base sm:text-lg font-light leading-relaxed text-purple-100/90 tracking-tight">
                            Gender-responsive science, technology, and innovation that empowers people and drives inclusive, sustainable development.
                        </p>
                    </div>
                </article>

                <!-- 3. Mission (Half Width) -->
                <article class="bento-card group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-purple-900/20 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-violet-500/40 hover:bg-purple-900/30 lg:p-10">
                    <div class="relative z-10 mb-6 md:mb-8 flex flex-col items-start gap-6">
                        <h3 class="font-sans text-4xl sm:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-400">Mission.</h3>
                    </div>
                    <div class="relative z-10">
                        <p class="text-base sm:text-lg font-light leading-relaxed text-purple-100/90 tracking-tight">
                            Advances gender-responsive science, technology and innovation that empowers people and drives inclusive, sustainable development.
                        </p>
                    </div>
                </article>

                <!-- 4. Goals (Full Width) -->
                <article class="bento-card group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-purple-900/20 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-violet-500/40 hover:bg-purple-900/30 md:col-span-2 lg:p-10">
                    <div class="relative z-10 mb-8 md:mb-10">
                        <h3 class="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-400">Goals.</h3>
                    </div>
                    <div class="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            <h4 class="font-sans text-sm font-semibold tracking-wide text-purple-50">Organization-Focused</h4>
                            <ol class="mt-4 list-decimal space-y-3 pl-4 text-base sm:text-lg font-light leading-relaxed text-purple-100/90 marker:text-violet-400/60">
                                <li>To build robust gender-responsive institutional policies.</li>
                                <li>To capacitate all DOST-IX employees on Gender and Development through continuous training and learning initiatives.</li>
                            </ol>
                        </div>
                        <div>
                            <h4 class="font-sans text-sm font-semibold tracking-wide text-purple-50">Client-Focused</h4>
                            <ol class="mt-4 list-decimal space-y-3 pl-4 text-base sm:text-lg font-light leading-relaxed text-purple-100/90 marker:text-violet-400/60" start="3">
                                <li>Establish and maintain strategic partnerships with LGUs, academe, private sector, and civil society.</li>
                                <li>To mainstream gender and development in all programs, activities, and projects, ensuring equitable outcomes.</li>
                            </ol>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </section>
</template>
