<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import ProjectModal from '../components/ProjectModal.vue';
import type { ProjectItem } from '../types';

// Placeholder project items
const projects: ProjectItem[] = [
    {
        id: 1,
        name: 'Grants-In-Aid (GIA)',
        href: '#', // Replace with real route when available
        colorTheme: 'emerald',
    },
    {
        id: 2,
        name: 'Small Enterprises Technology Upgrading (SETUP)',
        href: '#', // Replace with real route when available
        colorTheme: 'blue',
    },
    {
        id: 3,
        name: 'Community Enhancement through Science and Technology (CEST)',
        href: '#', // Replace with real route when available
        colorTheme: 'orange',
    },
    {
        id: 4,
        name: 'Smart and Sustainable Communities Program (SSCP)',
        href: '#', // Replace with real route when available
        colorTheme: 'rose',
    },
];

const projectsSectionRef = ref<HTMLElement | null>(null);
const selectedProject = ref<ProjectItem | null>(null);
const isModalOpen = ref(false);

const scrollToProjects = (): void => {
    if (!projectsSectionRef.value) return;
    projectsSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
        const focusable = projectsSectionRef.value?.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};

const openProjectModal = (project: ProjectItem): void => {
    selectedProject.value = project;
    isModalOpen.value = true;
};

const closeProjectModal = (): void => {
    isModalOpen.value = false;
    selectedProject.value = null;
};

const getProjectColors = (theme: string = 'purple') => {
    const colorMap = {
        emerald: {
            border: 'border-emerald-400/60',
            bg: 'bg-emerald-500/80',
            hover: 'from-emerald-400/40 to-emerald-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-emerald-400',
        },
        blue: {
            border: 'border-blue-400/60',
            bg: 'bg-blue-500/80',
            hover: 'from-blue-400/40 to-blue-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-blue-400',
        },
        orange: {
            border: 'border-orange-400/60',
            bg: 'bg-orange-400/80',
            hover: 'from-orange-400/40 to-orange-500/30',
            text: 'text-white',
            focus: 'focus-visible:ring-orange-400',
        },
        rose: {
            border: 'border-rose-400/60',
            bg: 'bg-rose-400/80',
            hover: 'from-rose-400/40 to-rose-500/30',
            text: 'text-white',
            focus: 'focus-visible:ring-rose-400',
        },
        purple: {
            border: 'border-purple-400/60',
            bg: 'bg-purple-500/80',
            hover: 'from-purple-400/40 to-purple-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-purple-400',
        },
    };
    return colorMap[theme as keyof typeof colorMap] || colorMap.purple;
};
</script>

<template>
    <Head title="GAD Corner" />

    <!-- Parallax Star Background -->
    <div class="star-bg">
        <div class="star-bg__layer star-bg__layer--1" aria-hidden="true"></div>
        <div class="star-bg__layer star-bg__layer--2" aria-hidden="true"></div>
        <div class="star-bg__layer star-bg__layer--3" aria-hidden="true"></div>
    </div>

    <div class="inter-font bg-purple-950 text-white">
        <!-- Hero Section with full illustration visible (reserved bottom space) -->
        <section
            class="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-0 pt-20 pb-56 text-center sm:pb-64 md:pt-28 md:pb-72 lg:pb-80"
        >
            <!-- Left side decorative illustrations -->
            <div
                aria-hidden="true"
                class="pointer-events-none absolute top-[20%] left-[1%] hidden w-1/4 max-w-xs items-center justify-center pl-2 sm:flex sm:pl-4 md:pl-6 lg:pl-8"
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
                    class="m-0 bg-gradient-to-r from-purple-100 via-fuchsia-300 to-pink-200 bg-clip-text text-4xl leading-tight font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                >
                    Gender and Development
                </h1>
                <p class="mx-auto max-w-2xl text-base leading-relaxed text-pretty text-purple-100 md:text-lg">
                    Discover how our projects drive gender equality, women’s empowerment, and inclusive development through science and technology.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                        type="button"
                        @click="scrollToProjects"
                        class="group inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        View Featured Projects
                        <span aria-hidden="true">↓</span>
                    </button>
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
                        class="bg-gradient-to-r from-purple-200 via-fuchsia-300 to-pink-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl"
                    >
                        Featured Projects
                    </h2>
                    <p class="max-w-2xl text-sm text-balance text-purple-100 md:text-base">
                        Our flagship projects advance gender equality and inclusive development by applying science and technology to real community
                        needs. Explore each initiative to see how we promote equal opportunities, empower women, and drive sustainable progress.
                    </p>
                </div>

                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button
                        v-for="project in projects"
                        :key="project.id"
                        type="button"
                        @click="openProjectModal(project)"
                        :class="[
                            'project-card group relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-xl p-6 text-center shadow-lg backdrop-blur focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                            getProjectColors(project.colorTheme).border,
                            getProjectColors(project.colorTheme).bg,
                            getProjectColors(project.colorTheme).focus,
                        ]"
                    >
                        <!-- Project Title -->
                        <h3 :class="['mb-2 text-sm leading-tight font-semibold', getProjectColors(project.colorTheme).text]">
                            {{ project.name }}
                        </h3>

                        <!-- Hover Effect Background -->
                        <span class="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100" aria-hidden="true">
                            <span :class="['absolute inset-0 bg-gradient-to-br', getProjectColors(project.colorTheme).hover]" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    </div>

    <!-- Project Modal -->
    <ProjectModal :project="selectedProject" :is-open="isModalOpen" @close="closeProjectModal" />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.inter-font {
    font-family: 'Inter', sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
}
/* All dynamic backgrounds/styles must be in app.css. */
</style>
