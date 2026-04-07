<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
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
</script>

<template>
    <Head title="GAD Corner" />

    <div class="inter-font mobile-optimized bg-purple-950 text-white">
        <HeroSection
            :report-management-href="reportManagementHref"
            @scroll-to-years="scrollToYears"
            @scroll-to-news="scrollToNews"
        />
        <YearlySection :years="years" />
    </div>
</template>
