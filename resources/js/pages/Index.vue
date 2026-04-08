<script setup lang="ts">
import GadStrategicFrameworkSection from '@/components/GadStrategicFrameworkSection.vue';
import HeroSection from '@/components/HeroSection.vue';
import OrganizationalChartSection from '@/components/OrganizationalChartSection.vue';
import YearlySection from '@/components/YearlySection.vue';
import type { YearItem } from '@/types';
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

interface Props {
    years: YearItem[];
}

defineProps<Props>();

defineOptions({
    name: 'IndexPage',
});

const page = usePage();

const reportManagementHref = computed(() => {
    return page.props.auth?.user ? route('report-years.index') : null;
});

const scrollToYears = (): void => {
    const section = document.getElementById('yearly');
    if (!section) return;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    // 600ms aligns with the CSS scroll-behavior transition duration
    setTimeout(() => {
        const focusable = section.querySelector<HTMLHeadingElement>('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
    }, 600);
};

const scrollToNews = (): void => {
    const section = document.getElementById('news-updates');
    if (!section) return;
    window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    // 600ms aligns with the CSS scroll-behavior transition duration
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
    <Head title="GAD Corner" />

    <div
        class="inter-font mobile-optimized min-w-0 bg-linear-to-b from-purple-950 via-violet-950/40 to-purple-950 pb-safe text-white"
    >
        <HeroSection
            :report-management-href="reportManagementHref"
            @scroll-to-years="scrollToYears"
            @scroll-to-news="scrollToNews"
            @scroll-to-org-chart="scrollToOrgChart"
        />
        <!-- Spacer: extra scroll distance after the hero so GAD ScrollTrigger scrub / parallax can ramp up. -->
        <div
            class="h-[12vh] min-h-14 shrink-0 bg-linear-to-b from-transparent via-purple-950/30 to-purple-950/80 sm:h-[15vh] sm:min-h-16 md:h-[18vh]"
            aria-hidden="true"
        />
        <GadStrategicFrameworkSection />
        <OrganizationalChartSection />
        <YearlySection :years="years" />
    </div>
</template>
