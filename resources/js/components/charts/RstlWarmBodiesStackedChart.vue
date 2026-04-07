<script setup lang="ts">
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
    title: 'Number of Customers on Testing and Calibration Services (Warm Bodies)',
});
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

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

const chartOptions = computed<ApexOptions>(() => ({
    chart: {
        type: 'bar',
        stacked: true,
        fontFamily: chartFontFamily,
        foreColor: '#334155',
        toolbar: { show: false },
        animations: {
            enabled: true,
            speed: 500,
            easing: 'easeout',
        },
    },
    title: {
        text: props.title,
        style: {
            fontFamily: chartFontFamily,
            fontSize: '15px',
            fontWeight: '600',
            color: '#0F172A',
        },
    },
    colors: ['#2563EB', '#60A5FA', '#F59E0B', '#FBBF24'],
    xaxis: {
        categories: props.data.map((entry) => entry.label),
        labels: {
            style: {
                fontFamily: chartFontFamily,
                fontSize: '12px',
                colors: '#64748B',
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
                colors: ['#64748B'],
            },
        },
    },
    legend: {
        position: 'bottom',
        fontSize: '12px',
        fontFamily: chartFontFamily,
        labels: {
            colors: '#334155',
        },
        markers: {
            width: 10,
            height: 10,
            radius: 4,
        },
    },
    dataLabels: {
        enabled: true,
        formatter: (value: number) => (value === 0 ? '' : `${value}`),
        style: {
            colors: ['#1F2937'],
            fontFamily: chartFontFamily,
            fontSize: '13px',
            fontWeight: 700,
        },
    },
    stroke: {
        width: 1,
    },
    tooltip: {
        theme: 'light',
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
        borderColor: '#E2E8F0',
        xaxis: { lines: { show: false } },
    },
}));
</script>

<template>
    <div class="relative h-128 w-full">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
