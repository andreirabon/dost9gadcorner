<script setup lang="ts">
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface ChartData {
    labels: string[];
    datasets: any[];
}

interface Props {
    chartData: ChartData;
    chartType: 'bar' | 'line' | 'pie';
    title: string;
}

const props = defineProps<Props>();
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const isPieChart = computed(() => props.chartType === 'pie');

const series = computed(() => {
    if (isPieChart.value) {
        return props.chartData.datasets[0]?.data ?? [];
    }

    return props.chartData.datasets.map((dataset) => ({
        name: dataset.name ?? dataset.label ?? 'Series',
        data: dataset.data ?? [],
    }));
});

const chartOptions = computed<ApexOptions>(() => ({
    chart: {
        type: props.chartType,
        fontFamily: chartFontFamily,
        foreColor: '#334155',
        toolbar: { show: false },
        animations: { enabled: false },
    },
    labels: isPieChart.value ? props.chartData.labels : undefined,
    xaxis: !isPieChart.value
        ? {
              categories: props.chartData.labels,
              labels: {
                  style: { colors: '#6b7280' },
              },
          }
        : undefined,
    yaxis: !isPieChart.value
        ? {
              min: 0,
              labels: {
                  style: { colors: ['#6b7280'] },
                  formatter: (value: number) => {
                      if (props.chartType === 'bar') {
                          return `${value} businesses`;
                      }

                      if (props.chartType === 'line') {
                          return `${value}%`;
                      }

                      return `${value}`;
                  },
              },
          }
        : undefined,
    title: {
        text: props.title,
        style: { fontSize: '14px', fontWeight: '700', color: '#374151' },
    },
    legend: {
        position: isPieChart.value ? 'right' : 'top',
        fontSize: isPieChart.value ? '11px' : '12px',
        fontFamily: chartFontFamily,
        labels: { colors: '#334155' },
        markers: { width: 10, height: 10, radius: 4 },
    },
    dataLabels: {
        enabled: isPieChart.value,
        formatter: (value: number) => `${value.toFixed(1)}%`,
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: (value: number) => {
                if (props.chartType === 'bar') {
                    return `${value} businesses`;
                }

                if (props.chartType === 'line') {
                    return `${value}%`;
                }

                return `${value}`;
            },
        },
    },
    stroke: {
        width: 1,
    },
    grid: !isPieChart.value
        ? {
              borderColor: '#e5e7eb',
          }
        : undefined,
}));
</script>

<template>
    <VueApexCharts :type="chartType" width="100%" height="100%" :options="chartOptions" :series="series" class="mobile-perf h-full w-full" />
</template>
