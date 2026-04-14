<script setup lang="ts">
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import { reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface RstlWarmBodiesData {
    label: string;
    female: number;
    femaleLed: number;
    male: number;
    maleLed: number;
}

interface Props {
    data: RstlWarmBodiesData[];
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const appearance = useReportChartAppearance();

const series = computed(() => [
    {
        name: 'Female',
        data: props.data.map((entry) => entry.female),
    },
    {
        name: 'Female-led',
        data: props.data.map((entry) => entry.femaleLed),
    },
    {
        name: 'Male',
        data: props.data.map((entry) => entry.male),
    },
    {
        name: 'Male-led',
        data: props.data.map((entry) => entry.maleLed),
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
            stacked: true,
            fontFamily: chartFontFamily,
            foreColor: ui.foreColor,
            toolbar: { show: false },
            offsetY: 0,
            parentHeightOffset: 0,
            animations: {
                enabled: true,
                speed: 500,
                easing: 'easeout',
            },
        },
        ...(props.title
            ? {
                  title: {
                      text: props.title,
                      style: {
                          fontFamily: chartFontFamily,
                          fontSize: '14px',
                          fontWeight: '600',
                          color: ui.titleColor,
                      },
                  },
              }
            : {}),
        colors: ['#F87171', '#FCA5A5', '#60A5FA', '#93C5FD'],
        xaxis: {
            categories: props.data.map((entry) => entry.label),
            labels: {
                style: {
                    fontFamily: chartFontFamily,
                    fontSize: '12px',
                    colors: ui.labelMuted,
                },
            },
        },
        yaxis: {
            min: 0,
            max: 45,
            tickAmount: 9,
            labels: {
                style: {
                    fontFamily: chartFontFamily,
                    fontSize: '12px',
                    colors: [ui.labelMuted],
                },
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: -4,
            fontSize: '11px',
            fontFamily: chartFontFamily,
            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },
            labels: {
                colors: ui.legendColor,
            },
            markers: {
                width: 8,
                height: 8,
                radius: 2,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (value: number) => (value === 0 ? '' : `${value}`),
            style: {
                colors: [ui.dataLabelColor],
                fontFamily: chartFontFamily,
                fontSize: '13px',
                fontWeight: 700,
            },
        },
        stroke: {
            width: 1,
        },
        tooltip: {
            theme: ui.tooltipTheme,
            y: {
                formatter: (value: number) => `${value}`,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 2,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
            },
        },
        grid: {
            borderColor: ui.gridBorder,
            xaxis: { lines: { show: false } },
            padding: {
                top: -8,
                right: 4,
                bottom: 0,
                left: 4,
            },
        },
    };
});
</script>

<template>
    <div class="relative h-64 w-full md:h-72">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
