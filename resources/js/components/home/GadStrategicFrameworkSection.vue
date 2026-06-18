<script setup lang="ts">
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';

defineOptions({
    name: 'GadStrategicFrameworkSection',
});

const MANDATE_TEXT =
    'The Department of Science and Technology - Region IX is mandated to mainstream Gender and Development (GAD) in all regional policies, programs, and activities in accordance with the Constitution, the Magna Carta of Women (RA 9710), and PCW guidelines, ensuring that science, technology, and innovation initiatives are gender-responsive, inclusive, and equitable. ' +
    'DOST IX shall promote equal access and participation of women and men in science, research, innovation, and technology transfer; address region-specific gender issues, particularly among marginalized sectors; ensure a safe and respectful workplace; and institutionalize GAD mechanisms.';

const bentoCardClass =
    'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none lg:p-5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-purple-400/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-purple-900/65';

const headerIntroCardClass =
    'relative overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-5';
</script>

<template>
    <section
        id="gad-strategic-framework"
        class="home-index-section bg-linear-to-b from-purple-950/98 via-fuchsia-950/28 to-purple-950 px-page-gutter"
        aria-labelledby="gad-strategic-framework-heading"
    >
        <IndexSectionDecor variant="framework" />

        <div class="home-index-section__inner max-w-7xl">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                <article :class="[headerIntroCardClass, 'md:col-span-2']">
                    <div
                        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/35 to-transparent"
                        aria-hidden="true"
                    />
                    <div class="relative z-10 flex flex-col gap-2 sm:gap-3 text-center lg:items-start lg:text-left">
                        <p
                            class="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/50 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-fuchsia-100/90 uppercase ring-1 ring-white/10 lg:mx-0"
                        >
                            <span class="size-1.5 shrink-0 rounded-full bg-fuchsia-300/85" aria-hidden="true" />
                            Institutional foundation
                        </p>
                        <div class="space-y-4">
                            <h2
                                id="gad-strategic-framework-heading"
                                data-focus-anchor="true"
                                tabindex="-1"
                                class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"
                            >
                                Strategic <span class="text-fuchsia-300/90">Framework</span>
                            </h2>
                            <p class="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/85 sm:text-lg lg:mx-0">
                                The foundation of our commitment to gender-responsive science, technology, and innovation.
                            </p>
                        </div>
                    </div>
                </article>
                <article :class="[bentoCardClass, 'md:col-span-2']">
                    <div class="relative z-10 mb-3 md:mb-4">
                        <h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl lg:text-6xl">
                            Mandate.
                        </h3>
                    </div>
                    <div class="relative z-10 lg:max-w-[85%]">
                        <p class="text-base font-light leading-relaxed tracking-tight text-purple-100/90 sm:text-lg">
                            {{ MANDATE_TEXT }}
                        </p>
                    </div>
                </article>

                <article :class="bentoCardClass">
                    <div class="relative z-10 mb-3 flex flex-col items-start gap-4 md:mb-4">
                        <h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl">Vision.</h3>
                    </div>
                    <div class="relative z-10">
                        <p class="text-base font-light leading-relaxed tracking-tight text-purple-100/90 sm:text-lg">
                            Gender-responsive science, technology, and Innovation (STI) for inclusive development.
                        </p>
                    </div>
                </article>

                <article :class="bentoCardClass">
                    <div class="relative z-10 mb-3 flex flex-col items-start gap-4 md:mb-4">
                        <h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl">Mission.</h3>
                    </div>
                    <div class="relative z-10">
                        <p class="text-base font-light leading-relaxed tracking-tight text-purple-100/90 sm:text-lg">
                           Advances gender-responsive science, technology and innovation that empowers people and drives inclusive, sustainable development.
                        </p>
                    </div>
                </article>

                <article :class="[bentoCardClass, 'md:col-span-2']">
                    <div class="relative z-10 mb-3 md:mb-4">
                        <h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl lg:text-6xl">Goals.</h3>
                    </div>
                    <div class="relative z-10">
                        <ol
                            class="list-decimal space-y-3 pl-4 text-base font-light leading-relaxed text-purple-100/90 marker:text-fuchsia-300/70 sm:text-lg"
                        >
                            <li>To build robust gender-responsive institutional policies.</li>
                            <li>To capacitate all DOST-IX employees on Gender and Development through continuous training and learning initiatives.</li>
                            <li>Establish and maintain strategic partnerships with LGUs, academe, private sector, and civil society.</li>
                            <li>To mainstream gender and development in all programs, activities, and projects, ensuring equitable outcomes.</li>
                        </ol>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
