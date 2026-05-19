<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import {
    REPORT_CHART_FONT_FAMILY,
    REPORT_CHART_SEX_COLORS,
    REPORT_CHART_STROKE_COLORS,
    reportChartCspNonce,
    useReportChartMotion,
} from '@/lib/reportChartConstants';
import { reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    femaleCount: number;
    maleCount: number;
}

const props = defineProps<Props>();

const appearance = useReportChartAppearance();
const chartAnimations = useReportChartMotion();

const totalCount = computed(() => props.femaleCount + props.maleCount);

const series = computed(() => [props.femaleCount, props.maleCount]);

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'pie',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            foreColor: ui.foreColor,
            nonce: reportChartCspNonce(),
            animations: chartAnimations.value,
        },
        labels: ['Female', 'Male'],
        colors: [REPORT_CHART_SEX_COLORS.female, REPORT_CHART_SEX_COLORS.male],
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
        tooltip: {
            theme: ui.tooltipTheme,
            y: {
                formatter: (value: number) => `${value}`,
            },
        },
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
            colors: [...REPORT_CHART_STROKE_COLORS],
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
