<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import NewsUpdates from '@/components/NewsUpdates.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import { Head } from '@inertiajs/vue3';

const scrollToProjects = (): void => {
    const section = document.getElementById('projects');
    if (!section) return;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    setTimeout(() => {
        const focusable = section.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};

const scrollToNews = (): void => {
    const section = document.getElementById('news-updates');
    if (!section) return;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
};
</script>

<template>
    <Head title="GAD Corner" />

    <div class="inter-font mobile-optimized bg-purple-950 text-white">
        <HeroSection @scroll-to-projects="scrollToProjects" @scroll-to-news="scrollToNews" />
        <NewsUpdates />
        <ProjectsSection />
    </div>
</template>
