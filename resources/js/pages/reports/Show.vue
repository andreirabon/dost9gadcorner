<script setup lang="ts">
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
        class="report-view-page"
        :class="mode === 'light' ? 'report-theme-light' : ''"
    >
        <div class="flex min-h-0 w-full min-w-0 flex-1 flex-col">
            <YearReportContent :year="year" />
        </div>
        <AppFooter />
    </div>
</template>
