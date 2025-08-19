<script setup lang="ts">
import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    ChartConfiguration,
    DoughnutController,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PieController,
    PointElement,
    PolarAreaController,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

// Register only the components we need
Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController,
    PieController,
    DoughnutController,
    PolarAreaController,
    RadarController,
);

interface ChartData {
    labels: string[];
    datasets: any[];
}

interface Props {
    chartData: ChartData;
    chartType: 'bar' | 'line' | 'pie' | 'doughnut';
    title: string;
    isLoading?: boolean;
}

interface Emits {
    (e: 'chart-ready', chart: Chart): void;
    (e: 'chart-destroyed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const chartRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);

const createChart = async () => {
    if (!chartRef.value || props.isLoading) return;

    // Destroy existing chart
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
        emit('chart-destroyed');
    }

    await nextTick();

    const ctx = chartRef.value.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
        type: props.chartType,
        data: props.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            hover: {
                animationDuration: 0,
            } as any,
            plugins: {
                title: {
                    display: true,
                    text: props.title,
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: '#374151',
                },
                legend: {
                    position: props.chartType === 'pie' ? 'right' : 'top',
                    labels: {
                        color: '#374151',
                        usePointStyle: true,
                        padding: props.chartType === 'pie' ? 8 : 10,
                        font: {
                            size: props.chartType === 'pie' ? 11 : 12,
                        },
                    },
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    animation: false,
                    callbacks:
                        props.chartType === 'pie'
                            ? ({
                                  label: function (context: any): string {
                                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                      const percentage = ((context.parsed / total) * 100).toFixed(1);
                                      return `${context.label}: ${context.parsed} (${percentage}%)`;
                                  },
                              } as any)
                            : ({
                                  afterLabel: function (): string {
                                      return props.chartType === 'bar' ? 'businesses' : '';
                                  },
                              } as any),
                },
            },
            scales:
                props.chartType !== 'pie'
                    ? {
                          x: {
                              grid: {
                                  color: '#e5e7eb',
                                  drawOnChartArea: true,
                                  drawTicks: true,
                              },
                              ticks: {
                                  color: '#6b7280',
                                  maxTicksLimit: 10,
                              },
                          },
                          y: {
                              grid: {
                                  color: '#e5e7eb',
                                  drawOnChartArea: true,
                                  drawTicks: true,
                              },
                              ticks: {
                                  color: '#6b7280',
                                  maxTicksLimit: 8,
                                  callback: function (value: any): string {
                                      if (props.chartType === 'bar') {
                                          return value + ' businesses';
                                      } else if (props.chartType === 'line') {
                                          return value + '%';
                                      }
                                      return value;
                                  },
                              } as any,
                              beginAtZero: true,
                          },
                      }
                    : undefined,
        },
    };

    chartInstance.value = new Chart(ctx, config);
    emit('chart-ready', chartInstance.value);
};

const updateChart = () => {
    if (chartInstance.value && !props.isLoading) {
        chartInstance.value.data = props.chartData;
        chartInstance.value.update('active');
    }
};

// Watch for data changes
watch(() => props.chartData, updateChart, { deep: true });

// Watch for loading state changes
watch(
    () => props.isLoading,
    (isLoading) => {
        if (!isLoading) {
            nextTick(() => createChart());
        }
    },
);

onMounted(() => {
    if (!props.isLoading) {
        createChart();
    }
});

onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
        emit('chart-destroyed');
    }
});
</script>

<template>
    <canvas ref="chartRef" class="mobile-perf h-full w-full" :class="{ 'opacity-0': isLoading }" />
</template>
