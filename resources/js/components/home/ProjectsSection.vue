<script setup lang="ts">
import ProjectCard from '@/components/home/ProjectCard.vue';
import ProjectModal from '@/components/home/ProjectModal.vue';
import { projects } from '@/data/projects';
import type { ProjectItem } from '@/types';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

defineOptions({
    name: 'ProjectsSection',
});

const selectedProject = shallowRef<ProjectItem | null>(null);
const isModalOpen = ref(false);

const openProjectModal = (project: ProjectItem): void => {
    selectedProject.value = project;
    isModalOpen.value = true;
};

const closeProjectModal = (): void => {
    isModalOpen.value = false;
    // Delay clearing data to allow modal exit animation
    setTimeout(() => {
        selectedProject.value = null;
    }, 300);
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isModalOpen.value) {
        closeProjectModal();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <section
        id="projects"
        class="relative border-t border-purple-700/60 bg-purple-900/60 px-4 pt-20 pb-8 sm:pt-24 md:pt-28 md:pb-10 lg:pt-32"
        aria-labelledby="projects-heading"
    >
        <div class="mx-auto w-full max-w-6xl">
            <div class="mb-5 flex flex-col items-center gap-2 text-center sm:mb-6 md:mb-8">
                <div class="mb-2 flex justify-center sm:mb-3">
                    <img
                        src="/svg/reports.svg"
                        alt="Reports"
                        class="h-24 w-auto opacity-90 sm:h-28 md:h-32 lg:h-36"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                    />
                </div>
                <h2
                    id="projects-heading"
                    data-focus-anchor="true"
                    tabindex="-1"
                    class="bg-gradient-to-r from-purple-200 via-fuchsia-300 to-pink-200 bg-clip-text px-4 text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-4xl"
                >
                    Projects
                </h2>
                <p class="text-responsive mx-auto max-w-2xl px-4 text-pretty text-purple-100 sm:px-6">
                    Our flagship projects advance gender equality and inclusive development by applying science and technology to real community
                    needs. Explore each initiative to see how we promote equal opportunities, empower women, and drive sustainable progress.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-2.5 px-3 sm:grid-cols-2 sm:gap-3 sm:px-4 lg:grid-cols-3 lg:gap-4">
                <ProjectCard v-for="project in projects" :key="project.id" v-memo="[project.id]" :project="project" @click="openProjectModal" />
            </div>
        </div>
    </section>

    <ProjectModal :project="selectedProject" :is-open="isModalOpen" @close="closeProjectModal" />
</template>
