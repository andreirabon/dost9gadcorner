<script setup lang="ts">
import GadStrategicFrameworkSection from '@/components/home/GadStrategicFrameworkSection.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import OrganizationalChartSection from '@/components/home/OrganizationalChartSection.vue';
import YearlySection from '@/components/home/YearlySection.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import type { YearItem } from '@/types';
import { Head } from '@inertiajs/vue3';

interface Props {
    years: YearItem[];
}

defineProps<Props>();

defineOptions({
    name: 'IndexPage',
});

const scrollToYears = (): void => {
    const section = document.getElementById('yearly');
    if (!section) return;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    setTimeout(() => {
        const focusable = section.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};

const scrollToOrgChart = (): void => {
    const section = document.getElementById('org-chart');
    if (!section) return;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    setTimeout(() => {
        const focusable = section.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};
</script>

<template>
    <Head title="Home" />
    <div class="flex min-h-dvh min-w-0 flex-col">
        <div class="pb-safe min-w-0 flex-1 bg-purple-950 text-purple-50 [color-scheme:dark]">
            <!-- <HomeTopNav /> -->
            <HeroSection @scroll-to-years="scrollToYears" @scroll-to-org-chart="scrollToOrgChart" />
            <!-- <div
                class="h-[6vh] min-h-10 shrink-0 sm:h-[8vh] sm:min-h-12 md:h-[10vh]"
                aria-hidden="true"
            /> -->
            <GadStrategicFrameworkSection />
            <OrganizationalChartSection />
            <YearlySection :years="years" />
        </div>
        <AppFooter />
    </div>
</template>
