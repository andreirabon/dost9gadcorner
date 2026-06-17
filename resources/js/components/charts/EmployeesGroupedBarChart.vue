<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import {
    REPORT_CHART_FONT_FAMILY,
    reportChartCspNonce,
    reportDisaggPalette,
    useReportChartMotion,
} from '@/lib/reportChartConstants';
import { reportChartTooltip, reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface EmployeeData {
    label: string;
    female: number;
    nonBinary: number;
    genderqueer: number;
    male: number;
}

interface Props {
    data: EmployeeData[];
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
        name: 'Non-binary',
        data: props.data.map((entry) => entry.nonBinary),
    },
    {
        name: 'Genderqueer',
        data: props.data.map((entry) => entry.genderqueer),
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
    const maxValue = Math.max(5, ...props.data.flatMap((entry) => [entry.female, entry.nonBinary, entry.genderqueer, entry.male]));
    const yMax = Math.ceil(maxValue / 5) * 5;

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'bar',
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
        colors: [colors.female, colors.nonBinary, colors.genderqueer, colors.male],
        xaxis: {
            categories: props.data.map((entry) => entry.label),
            labels: {
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
            tickAmount: Math.min(8, Math.max(4, Math.floor(yMax / 5))),
            labels: {
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '12px',
                    colors: [ui.labelMuted],
                },
            },
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            offsetY: 4,
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
            enabled: true,
            formatter: (value: number) => (value === 0 ? '' : `${value}`),
            style: {
                colors: [ui.dataLabelColor],
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '12px',
                fontWeight: 600,
            },
        },
        tooltip: reportChartTooltip({
            y: {
                formatter: (value: number) => `${value}`,
            },
        }),
        grid: {
            xaxis: { lines: { show: false } },
            borderColor: ui.gridBorder,
            strokeDashArray: 4,
            padding: {
                top: 0,
                right: 8,
                bottom: 0,
                left: 8,
            },
        },
        stroke: {
            width: 1,
        },
        plotOptions: {
            bar: {
                borderRadius: 3,
                columnWidth: '58%',
                dataLabels: {
                    position: 'center',
                },
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
