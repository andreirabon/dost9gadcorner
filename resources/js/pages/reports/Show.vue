<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue';
import YearReportContent from '@/components/reports/YearReportContent.vue';
import type { YearItem } from '@/types';
import { Head } from '@inertiajs/vue3';

defineProps<{
    year: YearItem;
}>();

defineOptions({
    name: 'ReportYearShowPage',
});
</script>

<template>
    <Head :title="`${year.year} Sex Disaggregated Data Report`" />
    <div class="report-view-page report-theme-light flex flex-col [color-scheme:light]">
        <section class="report-view-section" :aria-label="`${year.year} annual report`">
            <div class="report-view-main">
                <YearReportContent :year="year" />
            </div>
        </section>
        <AppFooter />
    </div>
</template>
