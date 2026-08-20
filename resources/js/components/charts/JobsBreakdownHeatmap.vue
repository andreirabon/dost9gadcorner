<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { JOBS_BREAKDOWN_LABELS, wrapAxisLabel } from '@/constants/reportLabels';
import { REPORT_CHART_FONT_FAMILY, reportChartCspNonce, useReportChartMotion } from '@/lib/reportChartConstants';
import { reportChartTooltip, reportChartUi } from '@/lib/reportChartUi';
import type { FundingCategorySummaryData } from '@/types/reports';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    categories: FundingCategorySummaryData[];
}

const props = defineProps<Props>();

const chartAnimations = useReportChartMotion();

/**
 * These four groups are overlapping subsets of the jobs total — one worker can
 * be a youth and a 4Ps beneficiary at once — so they must never be stacked or
 * summed. A grid of magnitudes is the honest form: each cell is read against the
 * shade scale, never against its neighbours' sum.
 */
const BREAKDOWN_ROWS = [
    { name: JOBS_BREAKDOWN_LABELS.pwd, pick: (row: FundingCategorySummaryData) => row.jobsPwd ?? 0 },
    { name: JOBS_BREAKDOWN_LABELS.seniorCitizen, pick: (row: FundingCategorySummaryData) => row.jobsSeniorCitizen ?? 0 },
    { name: JOBS_BREAKDOWN_LABELS.ip, pick: (row: FundingCategorySummaryData) => row.jobsIp ?? 0 },
    { name: JOBS_BREAKDOWN_LABELS.fourPs, pick: (row: FundingCategorySummaryData) => row.jobs4ps ?? 0 },
] as const;

/**
 * Sequential purple, light → medium, stepping monotonically in lightness. Kept
 * out of the dark end on purpose so the printed value stays readable in ink.
 */
const SEQUENTIAL_RAMP = ['#efeaf5', '#d9cee8', '#bfaed6', '#a48ec4', '#8a6fb0'] as const;

/**
 * Five equal bands across the observed range, so the ramp always spans the data
 * rather than bunching every cell into one shade on a low-count year.
 */
const colorRanges = computed(() => {
    const values = props.categories.flatMap((category) => BREAKDOWN_ROWS.map((definition) => definition.pick(category)));
    const highest = Math.max(1, ...values);
    const band = highest / SEQUENTIAL_RAMP.length;

    return SEQUENTIAL_RAMP.map((color, index) => ({
        from: index === 0 ? 0 : Number((band * index).toFixed(4)),
        to: index === SEQUENTIAL_RAMP.length - 1 ? highest : Number((band * (index + 1)).toFixed(4)),
        color,
    }));
});

/** Apex draws the first series at the bottom; reverse so PWD reads top-down. */
const series = computed(() =>
    [...BREAKDOWN_ROWS].reverse().map((definition) => ({
        name: definition.name,
        data: props.categories.map((category) => ({
            x: category.label,
            y: definition.pick(category),
        })),
    })),
);

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi();

    return {
        theme: { mode: ui.themeMode },
        chart: {
            type: 'heatmap',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            foreColor: ui.foreColor,
            background: ui.chartBackground,
            nonce: reportChartCspNonce(),
            toolbar: { show: false },
            parentHeightOffset: 0,
            animations: chartAnimations.value,
        },
        /*
         * Magnitude, not identity, so this is a sequential single-hue ramp built
         * from the report's purple — never the categorical purple/orange pair,
         * which would imply the rows are different kinds of thing rather than
         * more or less of the same thing.
         *
         * The steps are declared rather than left to Apex's auto-shading so the
         * ramp stays inside the light half: the cell values are printed on top,
         * and dark ink on a light-to-medium ramp is legible on every step, where
         * auto-shading ran dark enough to swallow the label on the busiest cells
         * and pale enough to swallow it on the emptiest.
         */
        colors: [SEQUENTIAL_RAMP[0]],
        plotOptions: {
            heatmap: {
                radius: 3,
                enableShades: false,
                useFillColorAsStroke: false,
                colorScale: { ranges: colorRanges.value },
            },
        },
        /*
         * The value is printed in every cell: a shade cannot be read precisely,
         * and the number is what discharges the contrast obligation on the pale
         * steps. Dark ink works across the whole ramp because the ramp is capped
         * at its medium step.
         */
        dataLabels: {
            enabled: true,
            formatter: (value: number) => `${value}`,
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#241a33'],
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: [ui.chartBackground],
        },
        xaxis: {
            type: 'category',
            labels: {
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    colors: ui.labelMuted,
                },
            },
        },
        yaxis: {
            labels: {
                /*
                 * Apex clips axis labels at ~160px by default, which turned
                 * "Pantawid Pamilyang Pilipino Program" into an ellipsis — the
                 * abbreviation this chart exists to avoid. Widened to fit the
                 * longest group name outright.
                 */
                maxWidth: 200,
                formatter: (value: string) => wrapAxisLabel(String(value), 22) as unknown as string,
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    colors: [ui.labelMuted],
                },
            },
        },
        /* One hue with printed values needs no legend — the title names the measure. */
        legend: { show: false },
        tooltip: reportChartTooltip({
            y: { formatter: (value: number) => `${value} jobs` },
        }),
        grid: {
            padding: { top: 0, right: 8, bottom: 0, left: 8 },
        },
    };
});
</script>

<template>
    <ReportChartFrame variant="bar" :row-count="BREAKDOWN_ROWS.length">
        <VueApexCharts type="heatmap" width="100%" height="100%" :options="chartOptions" :series="series" />
    </ReportChartFrame>
</template>
