<script setup lang="ts">
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
    title: 'DOST IX Employees',
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
    colors: ['#2563EB', '#F59E0B'],
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
        offsetY: -4,
        style: {
            colors: ['#1F2937'],
            fontFamily: chartFontFamily,
            fontSize: '12px',
            fontWeight: 700,
        },
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: (value: number) => `${value}`,
        },
    },
    grid: {
        xaxis: { lines: { show: false } },
        borderColor: '#E2E8F0',
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
}));
</script>

<template>
    <div class="relative h-80 w-full sm:h-96">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
