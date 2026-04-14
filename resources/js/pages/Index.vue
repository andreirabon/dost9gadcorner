<script setup lang="ts">
import GadStrategicFrameworkSection from '@/components/home/GadStrategicFrameworkSection.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import OrganizationalChartSection from '@/components/home/OrganizationalChartSection.vue';
import YearlySection from '@/components/home/YearlySection.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
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
    return page.props.auth?.user?.is_admin ? route('report-years.index') : null;
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
    <Head title="GAD Corner" />

    <div class="inter-font mobile-optimized flex min-h-screen min-w-0 flex-col">
        <div
            class="pb-safe min-w-0 flex-1 bg-linear-to-b from-purple-950 via-violet-950/45 to-purple-950 text-white [color-scheme:dark]"
        >
            <HeroSection :report-management-href="reportManagementHref" @scroll-to-years="scrollToYears" @scroll-to-org-chart="scrollToOrgChart" />
            <div
                class="h-[12vh] min-h-14 shrink-0 bg-linear-to-b from-transparent via-violet-950/35 to-purple-950 sm:h-[15vh] sm:min-h-16 md:h-[18vh]"
                aria-hidden="true"
            />
            <GadStrategicFrameworkSection />
            <OrganizationalChartSection />
            <YearlySection :years="years" />
        </div>
        <AppFooter />
    </div>
</template>
