<script setup lang="ts">
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import YearReportContent from '@/components/reports/YearReportContent.vue';
import { provideReportPageTheme } from '@/composables/useReportPageTheme';
import type { YearItem } from '@/types';
import { Head } from '@inertiajs/vue3';

defineProps<{
    year: YearItem;
}>();

defineOptions({
    name: 'ReportYearShowPage',
});

const { mode } = provideReportPageTheme();
</script>

<template>
    <Head :title="`${year.year} Sex Disaggregated Data Report`" />
    <div
        class="report-view-page flex flex-col"
        :class="mode === 'light' ? 'report-theme-light [color-scheme:light]' : '[color-scheme:dark]'"
    >
        <section class="report-view-section" :aria-label="`${year.year} annual report`">
            <IndexSectionDecor variant="yearly" />
            <div class="report-view-main">
                <YearReportContent :year="year" />
            </div>
        </section>
        <AppFooter />
    </div>
</template>
