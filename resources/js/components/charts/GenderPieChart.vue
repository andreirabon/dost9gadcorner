<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import {
    REPORT_CHART_FONT_FAMILY,
    reportChartCspNonce,
    reportDisaggPalette,
    useReportChartMotion,
} from '@/lib/reportChartConstants';
import { reportChartPieTooltip, reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    femaleCount: number;
    nonBinaryCount: number;
    genderqueerCount: number;
    maleCount: number;
}

const props = defineProps<Props>();

const appearance = useReportChartAppearance();
const chartAnimations = useReportChartMotion();

const totalCount = computed(() => props.femaleCount + props.nonBinaryCount + props.genderqueerCount + props.maleCount);

const series = computed(() => [props.femaleCount, props.nonBinaryCount, props.genderqueerCount, props.maleCount]);

const palette = computed(() => reportDisaggPalette(appearance.value));

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);
    const colors = palette.value;

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'pie',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            foreColor: ui.foreColor,
            background: ui.chartBackground,
            nonce: reportChartCspNonce(),
            animations: chartAnimations.value,
        },
        labels: ['Female', 'Non-binary', 'Genderqueer', 'Male'],
        colors: [colors.female, colors.nonBinary, colors.genderqueer, colors.male],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            offsetY: 4,
            labels: {
                colors: ui.legendColor,
            },
            markers: {
                size: 7,
                strokeWidth: 0,
            },
            itemMargin: {
                horizontal: 14,
                vertical: 4,
            },
        },
        tooltip: reportChartPieTooltip(['Female', 'Non-binary', 'Genderqueer', 'Male']),
        dataLabels: {
            enabled: totalCount.value > 0,
            formatter: (value: number) => `${Math.round(value)}%`,
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '13px',
                fontWeight: 600,
                colors: [ui.dataLabelColor],
            },
            dropShadow: {
                enabled: false,
            },
        },
        stroke: {
            width: 2,
            colors: [...colors.stroke],
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '0%',
                },
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.04,
                },
            },
        },
        noData: {
            text: 'No data available',
            align: 'center',
            verticalAlign: 'middle',
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                color: ui.foreColor,
            },
        },
    };
});
</script>

<template>
    <ReportChartFrame variant="pie">
        <VueApexCharts type="pie" width="100%" height="100%" :options="chartOptions" :series="series" />
    </ReportChartFrame>
</template>
