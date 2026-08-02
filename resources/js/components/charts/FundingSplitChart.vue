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

interface FundingSplitData {
    femaleProjects: number;
    femaleAmount: number;
    maleProjects: number;
    maleAmount: number;
}

interface Props {
    data: FundingSplitData;
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

const projectsSeries = computed(() => [{ name: 'No. of Projects', data: [props.data.femaleProjects, props.data.maleProjects] }]);
const amountSeries = computed(() => [{ name: 'Amount Funded', data: [props.data.femaleAmount, props.data.maleAmount] }]);

const projectsScale = computed(() => niceAxisScale(Math.max(5, props.data.femaleProjects, props.data.maleProjects)));
const amountScale = computed(() => niceAxisScale(Math.max(5, props.data.femaleAmount, props.data.maleAmount)));

const palette = computed(() => reportDisaggPalette(appearance.value));

/**
 * Shared base for the two single-axis panels below. Projects (a small integer count) and Amount
 * (currency in the hundreds of thousands) previously shared one dual-axis chart — comparing their
 * bar heights was meaningless since the two series never shared a scale. Splitting into two
 * same-sized, single-axis panels keeps every bar's height an honest read of its own value.
 */
function baseOptions(ui: ReturnType<typeof reportChartUi>, panelTitle: string): ApexOptions {
    return {
        theme: { mode: ui.themeMode },
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
        title: {
            text: panelTitle,
            style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: '14px',
                fontWeight: '600',
                color: ui.titleColor,
            },
        },
        xaxis: {
            categories: ['Female', 'Male'],
            labels: {
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    fontWeight: 600,
                    colors: ui.legendColor,
                },
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: [ui.chartBackground],
        },
        grid: {
            borderColor: ui.gridBorder,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            padding: {
                top: 20,
                right: 8,
                bottom: 0,
                left: 8,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                columnWidth: '46%',
                dataLabels: {
                    position: 'center',
                },
            },
        },
        legend: {
            show: false,
        },
    };
}

const projectsOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);
    const colors = palette.value;

    return {
        ...baseOptions(ui, `${props.title ? `${props.title} — ` : ''}Number of Projects`),
        colors: [colors.female, colors.male],
        yaxis: {
            min: 0,
            max: projectsScale.value.max,
            tickAmount: projectsScale.value.tickAmount,
            title: {
                text: 'Number of Projects',
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
        dataLabels: {
            enabled: true,
            formatter: (value: number) => `${value}`,
            offsetY: 0,
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
        tooltip: reportChartTooltip({
            y: { formatter: (value: number) => `${value}` },
        }),
    };
});

const amountOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);
    const colors = palette.value;

    return {
        ...baseOptions(ui, `${props.title ? `${props.title} — ` : ''}Amount Funded`),
        colors: [colors.femaleSoft, colors.maleSoft],
        yaxis: {
            min: 0,
            max: amountScale.value.max,
            tickAmount: amountScale.value.tickAmount,
            title: {
                text: 'Amount (PHP)',
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: ui.titleColor,
                },
            },
            labels: {
                formatter: (value: number) => formatCompactCurrency(value),
                style: {
                    fontFamily: REPORT_CHART_FONT_FAMILY,
                    fontSize: '13px',
                    colors: [ui.labelMuted],
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (value: number) => formatCompactCurrency(value),
            offsetY: 0,
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
        tooltip: reportChartTooltip({
            y: { formatter: (value: number) => formatCurrency(value) },
        }),
    };
});
</script>

<template>
    <div class="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <ReportChartFrame variant="tall">
            <VueApexCharts type="bar" width="100%" height="100%" :options="projectsOptions" :series="projectsSeries" />
        </ReportChartFrame>
        <ReportChartFrame variant="tall">
            <VueApexCharts type="bar" width="100%" height="100%" :options="amountOptions" :series="amountSeries" />
        </ReportChartFrame>
    </div>
</template>
