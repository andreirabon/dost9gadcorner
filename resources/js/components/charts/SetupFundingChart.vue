<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import {
    REPORT_CHART_FONT_FAMILY,
    REPORT_CHART_SEX_COLORS,
    reportChartCspNonce,
    useReportChartMotion,
} from '@/lib/reportChartConstants';
import { reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface SetupFundingData {
    maleProjects: number;
    maleAmount: number;
    femaleProjects: number;
    femaleAmount: number;
}

interface Props {
    data: SetupFundingData;
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});

const appearance = useReportChartAppearance();
const chartAnimations = useReportChartMotion();

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatCompactCurrency = (value: number): string => {
    if (value >= 1000000) {
        return `₱${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
        return `₱${(value / 1000).toFixed(2)}K`;
    }
    return `₱${value.toFixed(2)}`;
};

const series = computed(() => [
    {
        name: 'No. of Projects',
        data: [props.data.maleProjects, props.data.femaleProjects],
    },
    {
        name: 'Amount Funded',
        data: [props.data.maleAmount, props.data.femaleAmount],
    },
]);

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'bar',
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
            categories: ['Male', 'Female'],
            labels: {
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    fontWeight: 600,
                    colors: ui.legendColor,
                },
            },
        },
        yaxis: [
            {
                min: 0,
                title: {
                    text: 'Number of Projects',
                    style: {
                        fontFamily: REPORT_CHART_FONT_FAMILY,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: REPORT_CHART_SEX_COLORS.female,
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
            {
                opposite: true,
                min: 0,
                title: {
                    text: 'Amount (PHP)',
                    style: {
                        fontFamily: REPORT_CHART_FONT_FAMILY,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: REPORT_CHART_SEX_COLORS.male,
                    },
                },
                labels: {
                    formatter: (value: number) => formatCompactCurrency(value),
                    style: {
                        fontFamily: REPORT_CHART_FONT_FAMILY,
                        fontSize: '11px',
                        colors: [ui.labelMuted],
                    },
                },
            },
        ],
        dataLabels: {
            enabled: true,
            formatter: (value: number, options?: { seriesIndex?: number }) => {
                if (options?.seriesIndex === 1) {
                    return formatCompactCurrency(value);
                }

                return `${value}`;
            },
            offsetY: -4,
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '12px',
                fontWeight: 600,
                colors: [ui.dataLabelColor],
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
        tooltip: {
            shared: true,
            intersect: false,
            theme: ui.tooltipTheme,
            y: {
                formatter: (value: number, options?: { seriesIndex?: number }) => {
                    if (options?.seriesIndex === 1) {
                        return formatCurrency(value);
                    }

                    return `${value}`;
                },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '52%',
            },
        },
        stroke: {
            width: 1,
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
    };
});
</script>

<template>
    <ReportChartFrame variant="tall">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </ReportChartFrame>
</template>
