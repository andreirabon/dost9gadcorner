<script setup lang="ts">
import ReportChartFrame from '@/components/charts/ReportChartFrame.vue';
import { niceAxisScale, REPORT_CHART_FONT_FAMILY, reportChartCspNonce, reportDisaggPalette, useReportChartMotion } from '@/lib/reportChartConstants';
import { reportChartDataLabelBackground, reportChartTooltip, reportChartUi } from '@/lib/reportChartUi';
import type { ScholarshipApplicantDataRow } from '@/types/reports';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    rows: ScholarshipApplicantDataRow[];
    title?: string;
    /**
     * Largest stacked total across every chart in the set.
     *
     * These render as small multiples (undergraduate beside graduate), and small
     * multiples only compare honestly on a shared scale — sized independently, a
     * 200-applicant bar in one chart draws the same length as a 250-applicant bar
     * in the other. Omit for a chart that stands alone.
     */
    axisCeiling?: number;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    axisCeiling: undefined,
});

const chartAnimations = useReportChartMotion();

const series = computed(() => [
    { name: 'Female', data: props.rows.map((row) => row.female) },
    { name: 'Male', data: props.rows.map((row) => row.male) },
]);

const palette = computed(() => reportDisaggPalette());

const fullNameByLabel = computed(() => new Map(props.rows.map((row) => [row.label, row.fullName])));

type ChartRoot = { el?: Element | null };

/**
 * Hovering an axis acronym reveals the spelled-out programme.
 *
 * ApexCharts has no option for axis-label tooltips — the ticks are plain SVG
 * <text> nodes — so an SVG <title> child is attached after each render. That is
 * the native mechanism: the browser shows it on hover and assistive tech reads
 * it as the element's name, with nothing to position or tear down. Any previous
 * title is dropped first so the tick's own text is what gets matched.
 */
const annotateAxisLabels = (chartContext?: ChartRoot): void => {
    const root = chartContext?.el;

    if (!root) {
        return;
    }

    root.querySelectorAll('.apexcharts-yaxis-label').forEach((label) => {
        /*
         * The tick's own text, minus any <title> already under it — this runs
         * again on every re-render, and Apex writes a title of its own onto a
         * label it had to truncate.
         */
        const tickText = Array.from(label.childNodes)
            .filter((node) => node.nodeName.toLowerCase() !== 'title')
            .map((node) => node.textContent ?? '')
            .join('')
            .trim();

        const fullName = fullNameByLabel.value.get(tickText);

        if (!fullName) {
            return;
        }

        label.querySelector('title')?.remove();

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = fullName;
        label.appendChild(title);
    });
};

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi();
    const colors = palette.value;

    // Scale to the set-wide ceiling when given one, otherwise to this chart's
    // own largest stacked total, so the axis never clips a bar either way.
    const maxValue = Math.max(5, props.axisCeiling ?? 0, ...props.rows.map((row) => row.female + row.male));
    const { max: axisMax, tickAmount } = niceAxisScale(maxValue);

    return {
        theme: { mode: ui.themeMode },
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
            /* `el` is the chart's root node at runtime; Apex's own types omit it. */
            events: {
                mounted: (chart: ApexCharts) => annotateAxisLabels(chart as unknown as ChartRoot),
                updated: (chart: ApexCharts) => annotateAxisLabels(chart as unknown as ChartRoot),
            },
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
        plotOptions: {
            bar: {
                /*
                 * Horizontal: programme names run to twenty-plus characters, and
                 * rotating them under a column chart makes them unreadable. Bars
                 * along the x-axis give the labels a full row each.
                 */
                horizontal: true,
                borderRadius: 3,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                barHeight: '62%',
            },
        },
        xaxis: {
            categories: props.rows.map((row) => row.label),
            min: 0,
            max: axisMax,
            tickAmount,
            title: {
                text: 'Number of Applicants',
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
                    colors: ui.labelMuted,
                },
            },
        },
        yaxis: {
            labels: {
                /*
                 * Acronyms, because the spelled-out programme names run past
                 * eighty characters and overlapped each other in the axis
                 * gutter. Hovering a tick still gives the full title — see
                 * `annotateAxisLabels` — so the abbreviation never stands alone.
                 */
                maxWidth: 140,
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
            fontSize: '13px',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            itemMargin: { horizontal: 12, vertical: 0 },
            labels: { colors: ui.legendColor },
            markers: { size: 7, strokeWidth: 0 },
        },
        /*
         * Direct labels are not decoration here: the orange sits at 2.42:1 against
         * the light surface, and the palette check only clears that warning when
         * the value is legible without relying on the fill.
         */
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
            dropShadow: { enabled: false },
        },
        /* 2px surface-coloured gap between stacked segments. */
        stroke: {
            show: true,
            width: 2,
            colors: [ui.chartBackground],
        },
        tooltip: reportChartTooltip({
            y: { formatter: (value: number) => `${value}` },
        }),
        grid: {
            borderColor: ui.gridBorder,
            strokeDashArray: 4,
            yaxis: { lines: { show: false } },
            padding: { top: 0, right: 8, bottom: 0, left: 12 },
        },
    };
});
</script>

<template>
    <ReportChartFrame variant="bar" :row-count="rows.length">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </ReportChartFrame>
</template>
