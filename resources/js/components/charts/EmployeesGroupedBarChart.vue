<script setup lang="ts">
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import { reportChartUi } from '@/lib/reportChartUi';
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
        name: 'Male',
        data: props.data.map((entry) => entry.male),
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
            fontFamily: chartFontFamily,
            foreColor: ui.foreColor,
            nonce: document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content') || undefined,
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
        colors: ['#F87171', '#60A5FA'],
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
                size: 8,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (value: number) => (value === 0 ? '' : `${value}`),
            offsetY: -4,
            style: {
                colors: [ui.dataLabelColor],
                fontFamily: chartFontFamily,
                fontSize: '12px',
                fontWeight: 700,
            },
        },
        tooltip: {
            theme: ui.tooltipTheme,
            y: {
                formatter: (value: number) => `${value}`,
            },
        },
        grid: {
            xaxis: { lines: { show: false } },
            borderColor: ui.gridBorder,
            padding: {
                top: -8,
                right: 4,
                bottom: 0,
                left: 4,
            },
        },
        stroke: {
            width: 1,
        },
        plotOptions: {
            bar: {
                borderRadius: 2,
                columnWidth: '60%',
            },
        },
    };
});
</script>

<template>
    <div class="relative h-64 w-full sm:h-72">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
