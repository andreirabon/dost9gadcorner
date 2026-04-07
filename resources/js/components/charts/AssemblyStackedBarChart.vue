<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface AssemblyData {
    label: string;
    female: number;
    male: number;
}

interface Props {
    data: AssemblyData[];
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'SDD: GFPS Assembly Participation',
});
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

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
    colors: ['#2563EB', '#F97316'],
    xaxis: {
        categories: props.data.map((entry) => entry.label),
        labels: {
            rotate: -25,
            style: {
                fontFamily: chartFontFamily,
                fontSize: '12px',
                colors: '#64748B',
            },
        },
    },
    yaxis: {
        min: 0,
        max: 25,
        tickAmount: 5,
        title: {
            text: 'Number of Participants',
            style: {
                fontFamily: chartFontFamily,
                fontSize: '12px',
                color: '#64748B',
            },
        },
        labels: {
            style: {
                fontFamily: chartFontFamily,
                fontSize: '12px',
                colors: ['#64748B'],
            },
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
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
        enabled: false,
    },
    stroke: {
        width: 1,
        colors: ['#1D4ED8', '#EA580C'],
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: (value: number) => `${value}`,
        },
    },
    grid: {
        borderColor: '#E2E8F0',
        xaxis: { lines: { show: false } },
    },
    plotOptions: {
        bar: {
            borderRadius: 2,
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last',
        },
    },
}));
</script>

<template>
    <div class="relative h-80 w-full sm:h-96">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
