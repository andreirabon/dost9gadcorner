<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    femaleCount: number;
    maleCount: number;
}

const props = defineProps<Props>();
const chartFontFamily =
    '"Source Sans 3", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const totalCount = computed(() => props.femaleCount + props.maleCount);

const series = computed(() => [props.femaleCount, props.maleCount]);

const chartOptions = computed<ApexOptions>(() => ({
    chart: {
        type: 'pie',
        fontFamily: chartFontFamily,
        foreColor: '#334155',
        animations: {
            enabled: true,
            speed: 500,
            easing: 'easeout',
        },
    },
    labels: ['Female', 'Male'],
    colors: ['#2563EB', '#F59E0B'],
    legend: {
        position: 'right',
        fontSize: '13px',
        fontFamily: chartFontFamily,
        labels: {
            colors: '#334155',
        },
        markers: {
            size: 10,
        },
        itemMargin: {
            vertical: 6,
        },
    },
    responsive: [
        {
            breakpoint: 768,
            options: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],
    tooltip: {
        theme: 'light',
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
            colors: ['#1F2937'],
        },
        dropShadow: {
            enabled: false,
        },
    },
    stroke: {
        width: 2,
        colors: ['#1D4ED8', '#D97706'],
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
            color: '#64748B',
        },
    },
}));
</script>

<template>
    <div class="relative h-72 w-full sm:h-80">
        <VueApexCharts type="pie" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
