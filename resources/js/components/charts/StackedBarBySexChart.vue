<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import {
    niceAxisScale,
    REPORT_CHART_FONT_FAMILY,
    reportChartCspNonce,
    reportDisaggPalette,
    useReportChartMotion,
} from '@/lib/reportChartConstants';
import { reportChartDataLabelBackground, reportChartTooltip, reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

/**
 * A vertical stacked bar of female/male counts over labelled categories.
 *
 * Generic on purpose: assembly attendance and jobs generated are the same chart
 * with different words on the axis, so they share this rather than duplicating
 * a hundred and fifty lines of Apex configuration.
 */
interface StackedBarBySexData {
    label: string;
    female: number;
    male: number;
}

interface Props {
    data: StackedBarBySexData[];
    title?: string;
    /** Y-axis caption; names whatever the counts are counting. */
    axisTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    axisTitle: 'Number of Participants',
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

const palette = computed(() => reportDisaggPalette(appearance.value));

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);
    const colors = palette.value;
    const maxValue = Math.max(
        5,
        ...props.data.flatMap((entry) => [entry.female + entry.male]),
    );
    const { max: yMax, tickAmount } = niceAxisScale(maxValue);

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'bar',
            stacked: true,
            fontFamily: REPORT_CHART_FONT_FAMILY,
            foreColor: ui.foreColor,
            background: ui.chartBackground,
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
        colors: [colors.female, colors.male],
        xaxis: {
            categories: props.data.map((entry) => entry.label),
            labels: {
                rotate: props.data.length > 4 ? -35 : 0,
                rotateAlways: props.data.length > 4,
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    colors: ui.labelMuted,
                },
            },
        },
        yaxis: {
            min: 0,
            max: yMax,
            tickAmount,
            title: {
                text: props.axisTitle,
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: ui.titleColor,
                },
            },
            labels: {
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    colors: [ui.labelMuted],
                },
            },
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            offsetY: 4,
            fontSize: '13px',
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
            enabled: true,
            formatter: (value: number) => (value === 0 ? '' : `${value}`),
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#ffffff'],
            },
            background: reportChartDataLabelBackground(),
            dropShadow: {
                enabled: false,
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: [ui.chartBackground],
        },
        tooltip: reportChartTooltip({
            y: {
                formatter: (value: number) => `${value}`,
            },
        }),
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
