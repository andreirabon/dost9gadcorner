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
    male: number;
}

interface Props {
    data: EmployeeData[];
    title?: string;
}

/** On-axis floor for non-zero bars so small counts stay visible and labelable. */
function barDisplayValue(actual: number, minDisplay: number): number {
    if (actual <= 0) {
        return 0;
    }

    return Math.max(actual, minDisplay);
}

function minBarDisplayValue(yMax: number): number {
    return Math.max(3, Math.round(yMax * 0.08));
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});

const appearance = useReportChartAppearance();
const chartAnimations = useReportChartMotion();

const actualSeries = computed(() => [
    {
        name: 'Female',
        data: props.data.map((entry) => entry.female),
    },
    {
        name: 'Male',
        data: props.data.map((entry) => entry.male),
    },
]);

const chartScale = computed(() => {
    const maxValue = Math.max(5, ...props.data.flatMap((entry) => [entry.female, entry.male]));
    const yMax = Math.ceil(maxValue / 5) * 5;

    return {
        yMax,
        minDisplay: minBarDisplayValue(yMax),
    };
});

const series = computed(() => {
    const { minDisplay } = chartScale.value;

    return actualSeries.value.map((entry) => ({
        name: entry.name,
        data: entry.data.map((value) => barDisplayValue(value, minDisplay)),
    }));
});

const palette = computed(() => reportDisaggPalette(appearance.value));

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);
    const colors = palette.value;
    const { yMax } = chartScale.value;
    const femaleActual = actualSeries.value[0]?.data ?? [];
    const maleActual = actualSeries.value[1]?.data ?? [];

    const actualValueAt = (seriesIndex: number, dataPointIndex: number): number => {
        const values = seriesIndex === 0 ? femaleActual : maleActual;

        return values[dataPointIndex] ?? 0;
    };

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
        colors: [colors.female, colors.male],
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
            formatter: (_value: number, opts?: { seriesIndex?: number; dataPointIndex?: number }) => {
                const actual = actualValueAt(opts?.seriesIndex ?? 0, opts?.dataPointIndex ?? 0);

                return actual === 0 ? '' : `${actual}`;
            },
            offsetY: 0,
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '12px',
                fontWeight: 600,
            },
        },
        tooltip: reportChartTooltip({
            y: {
                formatter: (_value: number, opts?: { seriesIndex?: number; dataPointIndex?: number }) => {
                    const actual = actualValueAt(opts?.seriesIndex ?? 0, opts?.dataPointIndex ?? 0);

                    return `${actual}`;
                },
            },
        }),
        grid: {
            xaxis: { lines: { show: false } },
            borderColor: ui.gridBorder,
            strokeDashArray: 4,
            padding: {
                top: 20,
                right: 8,
                bottom: 0,
                left: 8,
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: [ui.chartBackground],
        },
        plotOptions: {
            bar: {
                borderRadius: 3,
                borderRadiusApplication: 'end',
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
