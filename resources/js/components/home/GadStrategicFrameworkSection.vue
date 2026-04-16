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
const mandateWrap = ref<HTMLElement | null>(null);
const mandateLayer = ref<HTMLElement | null>(null);
const visionWrap = ref<HTMLElement | null>(null);
const visionLayer = ref<HTMLElement | null>(null);
const missionWrap = ref<HTMLElement | null>(null);
const missionLayer = ref<HTMLElement | null>(null);
const goalsWrap = ref<HTMLElement | null>(null);
const goalsLayer = ref<HTMLElement | null>(null);

const editorialRoot = ref<HTMLElement | null>(null);

/** Parallax travel (px) per chapter — taller scroll zones allow slightly stronger scrub. */
const PARALLAX_TRAVELS = [52, 62, 72, 82];

let ctx: gsap.Context | null = null;

onMounted(async () => {
    await nextTick();

    const scopeRoot = sectionRef.value;
    if (!scopeRoot) {
        return;
    }

    ctx = gsap.context(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const parallaxBlocks: Array<{ wrap: HTMLElement | null; layer: HTMLElement | null; travel: number }> = [
            { wrap: mandateWrap.value, layer: mandateLayer.value, travel: PARALLAX_TRAVELS[0]! },
            { wrap: visionWrap.value, layer: visionLayer.value, travel: PARALLAX_TRAVELS[1]! },
            { wrap: missionWrap.value, layer: missionLayer.value, travel: PARALLAX_TRAVELS[2]! },
            { wrap: goalsWrap.value, layer: goalsLayer.value, travel: PARALLAX_TRAVELS[3]! },
        ];

        for (const { wrap, layer, travel } of parallaxBlocks) {
            if (!wrap || !layer) {
                continue;
            }

            gsap.fromTo(
                layer,
                { y: -travel },
                {
                    y: travel,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrap,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                },
            );
        }

        const revealChapters: Array<{ wrap: HTMLElement | null; el: HTMLElement | null }> = [
            { wrap: mandateWrap.value, el: editorialRoot.value },
            { wrap: visionWrap.value, el: visionLayer.value?.querySelector('article') ?? null },
            { wrap: missionWrap.value, el: missionLayer.value?.querySelector('article') ?? null },
            { wrap: goalsWrap.value, el: goalsLayer.value?.querySelector('article') ?? null },
        ];

        for (const { wrap, el } of revealChapters) {
            if (!wrap || !el) {
                continue;
            }

            // Scrub (not `once`) so fades/slides reverse when scrolling up; parallax tweens above already scrub both ways.
            gsap.fromTo(
                el,
                { autoAlpha: 0, y: 36 },
                {
                    autoAlpha: 1,
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrap,
                        start: 'top 88%',
                        end: 'top 58%',
                        scrub: 0.65,
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
        class="relative isolate scroll-mt-24 overflow-x-clip border-t border-purple-500/40 bg-linear-to-b from-purple-950 via-violet-950/72 to-purple-950 sm:scroll-mt-28"
        aria-label="GAD Strategic Framework"
        data-focus-anchor="true"
        tabindex="-1"
    >
        <IndexSectionDecor variant="framework" />
        <div
            class="relative z-10 mx-auto w-full max-w-6xl px-page-gutter pb-20 pt-8 sm:pb-28 sm:pt-10 md:pb-32"
        >
            <!-- Spaced chapters so ScrollTrigger scrub + reveals have scroll distance (parallax needs element travel through viewport). -->
            <div class="flex flex-col gap-12 sm:gap-16 md:gap-24">
                <!-- 1. Mandate — justify-start so the card sits under the header (avoid a tall empty band from justify-center + min-h). -->
                <div
                    ref="mandateWrap"
                    class="flex min-h-[min(78vh,48rem)] scroll-mt-24 flex-col justify-start pt-1 pb-8 sm:min-h-[82vh] sm:scroll-mt-28 sm:pt-2 sm:pb-12"
                >
                    <div ref="mandateLayer" class="w-full min-w-0 will-change-transform">
                        <div
                            ref="editorialRoot"
                            class="relative rounded-2xl border border-purple-400/38 bg-purple-900/50 px-4 pb-8 pt-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:px-7 sm:pb-10 sm:pt-9 md:px-9"
                        >
                            <p id="gad-framework-agency-label" class="sr-only">Agency</p>


                            <div class="relative z-0 min-h-48 text-left">
                                <div
                                    class="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-6 xl:gap-8"
                                >
                                    <!-- Column width matches the tile only; a fixed 13–15rem track left a blank band beside the icon. -->
                                    <div class="shrink-0 self-center lg:self-auto">
                                        <div
                                            class="relative flex items-center justify-center rounded-[1.75rem] bg-linear-to-br from-fuchsia-500/15 via-purple-400/10 to-indigo-500/10 p-4 shadow-[inset_0_1px_0_rgba(250,250,250,0.12)] ring-1 ring-fuchsia-400/25 sm:p-5"
                                        >
                                            <div
                                                class="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-radial-[at_30%_20%] from-white/10 to-transparent opacity-80"
                                                aria-hidden="true"
                                            />
                                            <img
                                                src="/svg/Mandate.png"
                                                alt=""
                                                width="180"
                                                height="180"
                                                loading="lazy"
                                                decoding="async"
                                                class="relative z-10 block size-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:size-32 md:size-36"
                                            />
                                        </div>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h3
                                            id="gad-framework-mandate"
                                            class="mb-4 font-sans text-sm font-semibold tracking-[0.14em] text-fuchsia-200 uppercase sm:mb-5 sm:text-base"
                                        >
                                            Mandate
                                        </h3>

                                        <div class="w-full max-w-full text-pretty text-left sm:text-justify lg:max-w-208">
                                            <p
                                                class="text-responsive font-sans text-base leading-[1.72] text-purple-100 sm:text-lg md:text-xl"
                                            >
                                                {{ MANDATE_TEXT }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. GAD Vision -->
                <div
                    ref="visionWrap"
                    class="flex min-h-[min(78vh,48rem)] scroll-mt-24 flex-col justify-center py-8 sm:min-h-[82vh] sm:scroll-mt-28 sm:py-12"
                >
                    <div ref="visionLayer" class="w-full min-w-0 will-change-transform">
                        <article
                            class="rounded-2xl border border-purple-400/38 bg-purple-900/55 px-5 py-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:px-8 sm:py-10 md:px-10 md:py-11"
                            aria-labelledby="gad-framework-vision"
                        >
                            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
                                <div
                                    class="shrink-0 self-center lg:self-start w-[min(100%,11.5rem)] md:w-[min(100%,13rem)]"
                                >
                                    <div
                                        class="relative flex items-center justify-center rounded-[1.65rem] bg-linear-to-br from-sky-400/15 via-amber-300/12 to-fuchsia-500/10 p-4 ring-1 ring-sky-300/25 sm:p-4"
                                    >
                                        <div
                                            class="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-radial-[at_40%_15%] from-white/12 to-transparent opacity-90"
                                            aria-hidden="true"
                                        />
                                        <img
                                            src="/svg/Vision.png"
                                            alt=""
                                            width="176"
                                            height="176"
                                            loading="lazy"
                                            decoding="async"
                                            class="relative z-10 block size-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:size-32"
                                        />
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h3
                                        id="gad-framework-vision"
                                        class="text-left font-sans text-sm font-semibold tracking-[0.14em] text-fuchsia-200 uppercase sm:text-base"
                                    >
                                        GAD Vision
                                    </h3>
                                    <p
                                        class="text-responsive mt-4 max-w-full text-pretty text-left font-sans text-base leading-[1.72] text-purple-100 sm:mt-5 sm:text-lg md:max-w-208 md:text-xl"
                                    >
                                        Gender-responsive science, technology, and innovation that empowers people and drives inclusive,
                                        sustainable development.
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

                <!-- 3. GAD Mission -->
                <div
                    ref="missionWrap"
                    class="flex min-h-[min(78vh,48rem)] scroll-mt-24 flex-col justify-center py-8 sm:min-h-[82vh] sm:scroll-mt-28 sm:py-12"
                >
                    <div ref="missionLayer" class="w-full min-w-0 will-change-transform">
                        <article
                            class="rounded-2xl border border-purple-400/38 bg-purple-900/55 px-5 py-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:px-8 sm:py-10 md:px-10 md:py-11"
                            aria-labelledby="gad-framework-mission"
                        >
                            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
                                <div
                                    class="shrink-0 self-center lg:self-start lg:order-2 w-[min(100%,11.5rem)] md:w-[min(100%,13rem)]"
                                >
                                    <div
                                        class="relative flex items-center justify-center rounded-[1.65rem] bg-linear-to-br from-violet-400/18 via-amber-200/10 to-rose-400/12 p-4 ring-1 ring-violet-300/30 sm:p-4"
                                    >
                                        <div
                                            class="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-radial-[at_70%_25%] from-white/10 to-transparent opacity-90"
                                            aria-hidden="true"
                                        />
                                        <img
                                            src="/svg/Mission.png"
                                            alt=""
                                            width="176"
                                            height="176"
                                            loading="lazy"
                                            decoding="async"
                                            class="relative z-10 block size-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:size-32"
                                        />
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1 lg:order-1">
                                    <h3
                                        id="gad-framework-mission"
                                        class="text-left font-sans text-sm font-semibold tracking-[0.14em] text-fuchsia-200 uppercase sm:text-base"
                                    >
                                        GAD Mission
                                    </h3>
                                    <p
                                        class="text-responsive mt-4 max-w-full text-pretty text-left font-sans text-base leading-[1.72] text-purple-100 sm:mt-5 sm:text-lg md:max-w-208 md:text-xl"
                                    >
                                        Advances gender-responsive science, technology and innovation that empowers people and drives
                                        inclusive, sustainable development.
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

                <!-- 4. GAD Goals -->
                <div
                    ref="goalsWrap"
                    class="flex min-h-[min(78vh,48rem)] scroll-mt-24 flex-col justify-center py-8 sm:min-h-[82vh] sm:scroll-mt-28 sm:py-12"
                >
                    <div ref="goalsLayer" class="w-full min-w-0 will-change-transform">
                        <article
                            class="rounded-2xl border border-purple-400/38 bg-purple-900/55 px-5 py-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:px-8 sm:py-10 md:px-10 md:py-11"
                            aria-labelledby="gad-framework-goals"
                        >
                            <!-- Two rows share the same grid template so icon columns and copy columns line up. -->
                            <div class="flex flex-col gap-8 text-left lg:gap-9 xl:gap-10">
                                <div
                                    class="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] xl:gap-10"
                                >
                                    <div
                                        class="order-2 w-fit min-w-0 justify-self-center lg:order-1 lg:justify-self-start"
                                    >
                                        <div
                                            class="relative flex items-center justify-center rounded-[1.65rem] bg-linear-to-br from-amber-400/18 via-rose-400/10 to-fuchsia-500/12 p-4 ring-1 ring-amber-300/28 sm:p-4"
                                        >
                                            <div
                                                class="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-radial-[at_40%_20%] from-white/12 to-transparent opacity-90"
                                                aria-hidden="true"
                                            />
                                            <img
                                                src="/svg/Goal.png"
                                                alt=""
                                                width="176"
                                                height="176"
                                                loading="lazy"
                                                decoding="async"
                                                class="relative z-10 block size-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:size-32"
                                            />
                                        </div>
                                    </div>
                                    <div class="order-1 min-w-0 lg:order-2">
                                        <h3
                                            id="gad-framework-goals"
                                            class="font-sans text-sm font-semibold tracking-[0.14em] text-fuchsia-200 uppercase sm:text-base"
                                        >
                                            GAD Goals
                                        </h3>
                                        <div class="mt-6 sm:mt-8">
                                            <h4 class="font-sans text-base font-semibold tracking-wide text-purple-50">
                                                Organization-Focused
                                            </h4>
                                            <ol
                                                class="text-responsive mt-3 list-decimal space-y-3 pl-5 text-pretty font-sans text-base leading-[1.72] text-purple-100 marker:font-medium marker:text-fuchsia-300 sm:text-lg md:text-xl"
                                            >
                                                <li>To build robust gender-responsive institutional policies.</li>
                                                <li>
                                                    To capacitate all DOST-IX employees on Gender and Development through continuous
                                                    training and learning initiatives.
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] xl:gap-10"
                                >
                                    <div
                                        class="order-2 w-fit min-w-0 justify-self-center lg:order-1 lg:justify-self-start"
                                    >
                                        <div
                                            class="relative flex items-center justify-center rounded-[1.65rem] bg-linear-to-br from-fuchsia-500/15 via-rose-400/12 to-sky-400/10 p-4 ring-1 ring-rose-300/25 sm:p-4"
                                        >
                                            <div
                                                class="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-radial-[at_35%_18%] from-white/10 to-transparent opacity-90"
                                                aria-hidden="true"
                                            />
                                            <img
                                                src="/svg/ClientFocused.png"
                                                alt=""
                                                width="176"
                                                height="176"
                                                loading="lazy"
                                                decoding="async"
                                                class="relative z-10 block size-28 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:size-32"
                                            />
                                        </div>
                                    </div>
                                    <div class="order-1 min-w-0 lg:order-2">
                                        <h4 class="font-sans text-base font-semibold tracking-wide text-purple-50">
                                            Client-Focused
                                        </h4>
                                        <ol
                                            class="text-responsive mt-3 list-decimal space-y-3 pl-5 text-pretty font-sans text-base leading-[1.72] text-purple-100 marker:font-medium marker:text-fuchsia-300 sm:text-lg md:text-xl"
                                            start="3"
                                        >
                                            <li>
                                                Establish and maintain strategic partnerships with LGUs, academe, private sector,
                                                and civil society to support inclusive science, technology, and innovation (STI)
                                                development.
                                            </li>
                                            <li>
                                                To mainstream gender and development in all programs, activities, and projects,
                                                ensuring systematic, gender-responsive, and equitable outcome.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
