<script setup lang="ts">
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
    title: 'SETUP: Number and Amount of Projects Funded',
});
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

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
        return `₱${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `₱${(value / 1000).toFixed(0)}K`;
    }
    return `₱${value}`;
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
        categories: ['Male', 'Female'],
        labels: {
            style: {
                    fontFamily: chartFontFamily,
                fontSize: '14px',
                fontWeight: 700,
                    colors: '#334155',
            },
        },
    },
    yaxis: [
        {
            min: 0,
            title: {
                text: 'Number of Projects',
                style: {
                    fontFamily: chartFontFamily,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2563EB',
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
        {
            opposite: true,
            min: 0,
            title: {
                text: 'Amount (PHP)',
                style: {
                    fontFamily: chartFontFamily,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#F59E0B',
                },
            },
            labels: {
                formatter: (value: number) => formatCompactCurrency(value),
                style: {
                    fontFamily: chartFontFamily,
                    fontSize: '11px',
                    colors: ['#64748B'],
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
            fontFamily: chartFontFamily,
            fontSize: '13px',
            fontWeight: 700,
            colors: ['#2563EB', '#D97706'],
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
    tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
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
            columnWidth: '55%',
        },
    },
    stroke: {
        width: 1,
    },
    grid: {
        borderColor: '#E2E8F0',
        xaxis: { lines: { show: false } },
    },
}));
</script>

<template>
    <div class="relative h-96 w-full">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
