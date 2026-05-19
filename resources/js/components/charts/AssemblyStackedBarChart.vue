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

interface AssemblyData {
    label: string;
    female: number;
    male: number;
}

interface Props {
    data: AssemblyData[];
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});

const appearance = useReportChartAppearance();
const chartAnimations = useReportChartMotion();

const series = computed(() => [
    {
        name: 'Female',
        data: props.data.map((entry) => entry.female),
    },
    {
        name: 'Male',
        data: props.data.map((entry) => entry.male),
    },
]);

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);
    const maxValue = Math.max(
        5,
        ...props.data.flatMap((entry) => [entry.female + entry.male]),
    );
    const yMax = Math.ceil(maxValue / 5) * 5;

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'bar',
            stacked: true,
            fontFamily: REPORT_CHART_FONT_FAMILY,
            foreColor: ui.foreColor,
            nonce: reportChartCspNonce(),
            toolbar: { show: false },
            offsetY: 0,
            parentHeightOffset: 0,
            animations: chartAnimations.value,
        },
        ...(props.title
            ? {
                  title: {
                      text: props.title,
                      style: {
                          fontFamily: REPORT_CHART_FONT_FAMILY,
                          fontSize: '14px',
                          fontWeight: '600',
                          color: ui.titleColor,
                      },
                  },
              }
            : {}),
        colors: [REPORT_CHART_SEX_COLORS.female, REPORT_CHART_SEX_COLORS.male],
        xaxis: {
            categories: props.data.map((entry) => entry.label),
            labels: {
                rotate: props.data.length > 4 ? -35 : 0,
                rotateAlways: props.data.length > 4,
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '12px',
                    colors: ui.labelMuted,
                },
            },
        },
        yaxis: {
            min: 0,
            max: yMax,
            tickAmount: Math.min(6, yMax),
            title: {
                text: 'Number of Participants',
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '12px',
                    color: ui.labelMuted,
                },
            },
            labels: {
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '12px',
                    colors: [ui.labelMuted],
                },
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: 0,
            fontSize: '12px',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            itemMargin: {
                horizontal: 12,
                vertical: 0,
            },
            labels: {
                colors: ui.legendColor,
            },
            markers: {
                size: 7,
                strokeWidth: 0,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 1,
            colors: [...REPORT_CHART_STROKE_COLORS],
        },
        tooltip: {
            theme: ui.tooltipTheme,
            y: {
                formatter: (value: number) => `${value}`,
            },
        },
        grid: {
            borderColor: ui.gridBorder,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            padding: {
                top: 0,
                right: 8,
                bottom: 0,
                left: 8,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 3,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                columnWidth: '62%',
            },
        },
    };
});
</script>

<template>
    <ReportChartFrame variant="bar" :row-count="data.length">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </ReportChartFrame>
</template>
