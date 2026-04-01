<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);

const createChart = () => {
    if (!canvasRef.value) {
        return;
    }

    const context = canvasRef.value.getContext('2d');

    if (!context) {
        return;
    }

    // Stop any existing chart animation before creating new one
    if (chartInstance.value) {
        chartInstance.value.stop();
        chartInstance.value.destroy();
    }

    chartInstance.value = new ChartJS(context, {
        type: 'bar',
        data: {
            labels: props.data.map((entry) => entry.label),
            datasets: [
                {
                    label: 'Female',
                    data: props.data.map((entry) => entry.female),
                    backgroundColor: '#5B9BD5',
                    borderColor: '#4A8BC8',
                    borderWidth: 1,
                },
                {
                    label: 'Female-led',
                    data: props.data.map((entry) => entry.femaleLed),
                    backgroundColor: '#ED7D31',
                    borderColor: '#E06E22',
                    borderWidth: 1,
                },
                {
                    label: 'Male',
                    data: props.data.map((entry) => entry.male),
                    backgroundColor: '#A5A5A5',
                    borderColor: '#949494',
                    borderWidth: 1,
                },
                {
                    label: 'Male-led',
                    data: props.data.map((entry) => entry.maleLed),
                    backgroundColor: '#FFC000',
                    borderColor: '#E6AC00',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 45,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 12,
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: props.title,
                    font: {
                        size: 18,
                        weight: 'normal',
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                    color: '#111827',
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 18,
                        font: {
                            size: 13,
                        },
                    },
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1F2937',
                    bodyColor: '#1F2937',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: (chartContext) => {
                            const datasetLabel = chartContext.dataset.label || '';
                            const value = chartContext.parsed.y as number;
                            return ` ${datasetLabel}: ${value}`;
                        },
                    },
                },
            },
        },
        plugins: [
            {
                id: 'segmentValueLabels',
                afterDatasetsDraw: (chart) => {
                    const { ctx, scales } = chart;
                    if (!ctx) return;
                    const xScale = scales.x;
                    const yScale = scales.y;

                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);

                        meta.data.forEach((bar, index) => {
                            const value = dataset.data[index] as number;

                            if (!value || value === 0) {
                                return;
                            }

                            const barElement = bar as BarElement;
                            const x = barElement.x;

                            // Calculate the center Y position of this stacked segment
                            // For stacked bars, we need to find the visual center of the segment
                            const barHeight = barElement.height;
                            const yTop = barElement.y;
                            const yCenter = yTop + barHeight / 2;

                            ctx.save();
                            ctx.fillStyle = '#1F2937';
                            ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(String(value), x, yCenter);
                            ctx.restore();
                        });
                    });
                },
            },
        ],
    });
};

onMounted(() => {
    nextTick(() => {
        // Small delay to ensure canvas has proper dimensions after tab transition
        setTimeout(() => {
            createChart();
        }, 50);
    });
});

onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.stop();
        chartInstance.value.destroy();
        chartInstance.value = null;
    }
});

watch(
    () => props.data,
    () => {
        createChart();
    },
    { deep: true },
);
</script>

<template>
    <div class="relative h-128 w-full">
        <canvas ref="canvasRef" class="h-full w-full"></canvas>
    </div>
</template>
