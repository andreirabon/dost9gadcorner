<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import NewsUpdates from '../components/NewsUpdates.vue';
import ProjectCard from '../components/ProjectCard.vue';
import ProjectModal from '../components/ProjectModal.vue';
import { projects } from '../data/projects';
import type { ProjectItem } from '../types';

const projectsSectionRef = ref<HTMLElement | null>(null);
const selectedProject = ref<ProjectItem | null>(null);
const isModalOpen = ref(false);

const scrollToProjects = (): void => {
    if (!projectsSectionRef.value) return;

    // Position projects section to fill the entire viewport
    const sectionTop = projectsSectionRef.value.offsetTop;

    // Scroll so the projects section starts exactly at the top of the viewport
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth',
    });

    setTimeout(() => {
        const focusable = projectsSectionRef.value?.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};

const scrollToNews = (): void => {
    const newsElement = document.getElementById('news-updates');
    if (!newsElement) return;

    const sectionTop = newsElement.offsetTop;
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth',
    });
};

const openProjectModal = (project: ProjectItem): void => {
    selectedProject.value = project;
    isModalOpen.value = true;
};

const closeProjectModal = (): void => {
    isModalOpen.value = false;
    selectedProject.value = null;
};
</script>

<template>
    <Head title="GAD Corner" />

    <div class="inter-font mobile-optimized bg-purple-950 text-white">
        <!-- Hero Section -->
        <HeroSection @scroll-to-projects="scrollToProjects" @scroll-to-news="scrollToNews" />

        <!-- News & Updates Section -->
        <NewsUpdates />

        <!-- Projects Section -->
        <section
            ref="projectsSectionRef"
            id="projects"
            class="px-safe relative scroll-smooth border-t border-purple-700/60 bg-purple-900/60 pt-28 pb-8 md:pt-32 md:pb-10"
            aria-labelledby="projects-heading"
        >
            <div class="mx-auto w-full max-w-6xl">
                <div class="mb-6 flex flex-col items-center gap-2 text-center md:mb-8">
                    <!-- Reports SVG Icon -->
                    <div class="mb-3 flex justify-center">
                        <img
                            src="/svg/reports.svg"
                            alt="Reports"
                            class="h-28 w-auto opacity-90 sm:h-32 md:h-36 lg:h-40"
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
                        Projects
                    </h2>
                    <p class="text-responsive px-safe max-w-2xl text-pretty text-purple-100">
                        Our flagship projects advance gender equality and inclusive development by applying science and technology to real community
                        needs. Explore each initiative to see how we promote equal opportunities, empower women, and drive sustainable progress.
                    </p>
                </div>

                <div class="px-safe grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <ProjectCard v-for="project in projects" :key="project.id" v-memo="[project.id]" :project="project" @click="openProjectModal" />
                </div>
            </div>
        </section>
    </div>

    <!-- Project Modal -->
    <ProjectModal :project="selectedProject" :is-open="isModalOpen" @close="closeProjectModal" />
</template>
