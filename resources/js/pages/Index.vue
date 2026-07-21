<script setup lang="ts">
import GadStrategicFrameworkSection from '@/components/home/GadStrategicFrameworkSection.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import HomeTopNav from '@/components/home/HomeTopNav.vue';
import OrganizationalChartSection from '@/components/home/OrganizationalChartSection.vue';
import YearlySection from '@/components/home/YearlySection.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import type { YearItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { onUnmounted } from 'vue';

interface Props {
    years: YearItem[];
}

defineProps<Props>();

defineOptions({
    name: 'IndexPage',
});

const SCROLL_FOCUS_DELAY_MS = 600;

let focusTimeoutId: ReturnType<typeof setTimeout> | undefined;

const scrollToSection = (sectionId: string): void => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: section.offsetTop, behavior });

    clearTimeout(focusTimeoutId);
    focusTimeoutId = setTimeout(() => {
        const focusable = section.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, SCROLL_FOCUS_DELAY_MS);
};

const scrollToYears = (): void => scrollToSection('yearly');
const scrollToOrgChart = (): void => scrollToSection('org-chart');

onUnmounted(() => {
    clearTimeout(focusTimeoutId);
});
</script>

<template>
    <Head title="Home" />
    <div class="flex min-h-dvh min-w-0 flex-col">
        <div class="pb-safe min-w-0 flex-1 bg-purple-950 text-purple-50 [color-scheme:dark]">
            <HomeTopNav />
            <HeroSection @scroll-to-years="scrollToYears" @scroll-to-org-chart="scrollToOrgChart" />
            <GadStrategicFrameworkSection />
            <OrganizationalChartSection />
            <YearlySection :years="years" />
        </div>
        <AppFooter />
    </div>
</template>
