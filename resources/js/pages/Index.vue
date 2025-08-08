<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';

interface ProjectItem {
    id: number;
    name: string;
    href: string;
}

// Placeholder project items
const projects: ProjectItem[] = Array.from({ length: 4 }, (_, i) => {
    const id = i + 1;
    return {
        id,
        name: `Project ${id}`,
        href: '#', // Replace with real routes when available
    };
});

// Number of times to repeat the hero illustration row (Do not remove)
// const heroRepeat = 8;

const projectsSectionRef = ref<HTMLElement | null>(null);
const scrollToProjects = (): void => {
    if (!projectsSectionRef.value) return;
    projectsSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
        const focusable = projectsSectionRef.value?.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};
</script>

<template>
    <Head title="GAD Corner" />

    <div class="inter-font bg-purple-950 text-white">
        <!-- Hero Section with full illustration visible (reserved bottom space) -->
        <section
            class="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-0 pt-20 pb-56 text-center sm:pb-64 md:pt-28 md:pb-72 lg:pb-80"
        >
            <!-- Left side decorative illustrations -->
            <div
                aria-hidden="true"
                class="pointer-events-none absolute top-[18%] left-[1%] hidden w-1/4 max-w-xs items-center justify-center pl-2 sm:flex sm:pl-4 md:pl-6 lg:pl-8"
            >
                <img
                    src="/svg/gendericon.svg"
                    alt=""
                    class="block h-auto w-full opacity-90 mix-blend-screen drop-shadow-lg"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <!-- Right side decorative illustration -->
            <div
                aria-hidden="true"
                class="pointer-events-none absolute top-[42%] right-[1%] hidden w-1/4 max-w-xs items-center justify-center pr-2 sm:flex sm:pr-4 md:pr-6 lg:pr-8"
            >
                <img
                    src="/svg/development1.svg"
                    alt=""
                    class="block h-auto w-full opacity-90 mix-blend-screen drop-shadow-lg"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div class="absolute inset-0 -z-10 overflow-hidden">
                <!-- Subtle single-hue atmospheric background (purple) -->
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,theme(colors.purple.400)/25%,transparent_70%)]" />
            </div>

            <!-- Hero textual content -->
            <div class="relative z-10 mx-auto w-full max-w-6xl space-y-6 px-6">
                <!-- DOST Logo -->
                <div class="flex justify-center">
                    <img
                        src="/svg/dost.svg"
                        alt="Department of Science and Technology"
                        class="h-16 w-auto opacity-95 drop-shadow-lg sm:h-20 md:h-24"
                        loading="eager"
                        decoding="async"
                    />
                </div>
                <p
                    class="backdrop-blury inline-block rounded-full border border-cyan-300/50 bg-cyan-800/40 bg-gradient-to-r from-[#47BACD] to-[#44B4C8] bg-clip-text px-4 py-1 text-base font-normal tracking-wide text-transparent shadow-sm"
                >
                    Department of Science and Technology Region 9
                </p>
                <h1
                    class="bg-gradient-to-r from-purple-100 via-fuchsia-300 to-pink-200 bg-clip-text text-4xl leading-tight font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                >
                    Gender and Development
                </h1>
                <p class="mx-auto max-w-2xl text-base leading-relaxed text-pretty text-purple-100 md:text-lg">
                    Discover projects, find resources, and learn how we are advancing equality & empowerment through science and technology.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                        type="button"
                        @click="scrollToProjects"
                        class="group inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        View Projects
                        <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                    </button>
                    <a
                        href="#"
                        class="inline-flex items-center rounded-md border border-purple-300 bg-purple-800/40 px-6 py-3 text-sm font-medium text-white shadow-sm backdrop-blur transition-colors hover:border-purple-200 hover:bg-purple-700/60 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            <!-- Center bottom layered illustration -->
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex w-full justify-center select-none">
                <img
                    src="/svg/huddletogether_layered.svg"
                    alt=""
                    class="h-32 w-auto opacity-95 drop-shadow-2xl sm:h-44 md:h-52 lg:h-60 xl:h-72"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <!-- Full-bleed hero illustration row (positioned higher for better visibility) -->
            <!-- <figure class="pointer-events-none absolute inset-x-0 bottom-16 select-none sm:bottom-20 md:bottom-24 lg:bottom-32">
                <div class="relative w-screen overflow-hidden">
                    <div class="flex w-max -space-x-1">
                        <template v-for="n in heroRepeat" :key="n"
                            ><img
                                src="/svg/huddletogether_flat.svg"
                                alt=""
                                aria-hidden="true"
                                class="h-40 w-auto max-w-none flex-none object-contain sm:h-48 md:h-56 lg:h-64"
                                loading="lazy"
                                decoding="async"
                        /></template>
                    </div>
                </div>
            </figure> -->
        </section>

        <!-- Projects Section -->
        <section
            ref="projectsSectionRef"
            id="projects"
            class="relative flex min-h-screen flex-col justify-center border-t border-purple-700/60 bg-purple-900/60 px-6 py-20 md:py-28"
            aria-labelledby="projects-heading"
        >
            <div class="mx-auto w-full max-w-6xl">
                <div class="mb-10 flex flex-col items-center gap-4 text-center md:mb-14">
                    <!-- Reports SVG Icon -->
                    <div class="mb-4 flex justify-center">
                        <img
                            src="/svg/reports.svg"
                            alt="Reports"
                            class="h-32 w-auto opacity-90 sm:h-40 md:h-44 lg:h-48 xl:h-52"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <h2
                        id="projects-heading"
                        data-focus-anchor="true"
                        tabindex="-1"
                        class="text-3xl font-semibold tracking-tight text-white md:text-4xl"
                    >
                        Featured Projects
                    </h2>
                    <p class="max-w-2xl text-sm text-balance text-purple-100 md:text-base">
                        A quick overview of our active and upcoming initiatives. Select a project to explore more details soon.
                    </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button
                        v-for="project in projects"
                        :key="project.id"
                        type="button"
                        @click="() => {}"
                        class="group relative flex h-28 flex-col items-start justify-between overflow-hidden rounded-xl border border-purple-600/50 bg-purple-800/60 p-4 text-left shadow-sm backdrop-blur transition hover:border-purple-400 hover:bg-purple-700/70 hover:shadow-md focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        <span class="text-sm font-medium text-white">{{ project.name }}</span>
                        <span class="text-[11px] font-medium tracking-wide text-purple-200 uppercase">Coming Soon</span>
                        <span
                            class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            aria-hidden="true"
                        >
                            <span class="absolute inset-0 bg-purple-400/20" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.inter-font {
    font-family: 'Inter', sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
}
</style>
