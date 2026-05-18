<script setup lang="ts">
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import { reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    femaleCount: number;
    maleCount: number;
}

const props = defineProps<Props>();
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const appearance = useReportChartAppearance();

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
            fontFamily: chartFontFamily,
            foreColor: ui.foreColor,
            nonce: document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content') || undefined,
            animations: {
                enabled: true,
                speed: 500,
                easing: 'easeout',
            },
        },
        labels: ['Female', 'Male'],
        colors: ['#F87171', '#60A5FA'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '11px',
            fontFamily: chartFontFamily,
            offsetY: 0,
            labels: {
                colors: ui.legendColor,
            },
            markers: {
                size: 8,
            },
            itemMargin: {
                horizontal: 12,
                vertical: 2,
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
                fontFamily: chartFontFamily,
                fontSize: '13px',
                fontWeight: 700,
                colors: [ui.dataLabelColor],
            },
            dropShadow: {
                enabled: false,
            },
        },
        stroke: {
            width: 2,
            colors: ['#EF4444', '#3B82F6'],
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                },
            },
        },
        noData: {
            text: 'No data available',
            align: 'center',
            verticalAlign: 'middle',
            style: {
                fontFamily: chartFontFamily,
                color: ui.foreColor,
            },
        },
    };
});
</script>

<template>
    <div class="relative h-56 w-full sm:h-64">
        <VueApexCharts type="pie" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
