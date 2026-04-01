<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);

const createChart = () => {
    if (!canvasRef.value) return;

    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;

    // Stop any existing chart animation before creating new one
    if (chartInstance.value) {
        chartInstance.value.stop();
        chartInstance.value.destroy();
    }

    chartInstance.value = new ChartJS(ctx, {
        type: 'bar',
        data: {
            labels: props.data.map((d) => d.label),
            datasets: [
                {
                    label: 'Female',
                    data: props.data.map((d) => d.female),
                    backgroundColor: '#2563EB', // Blue
                    borderColor: '#1D4ED8',
                    borderWidth: 1,
                    borderRadius: 2,
                },
                {
                    label: 'Male',
                    data: props.data.map((d) => d.male),
                    backgroundColor: '#F97316', // Orange
                    borderColor: '#EA580C',
                    borderWidth: 1,
                    borderRadius: 2,
                },
            ],
        },
        options: {
            responsive: true,
            animation: {
                duration: 500,
                easing: 'easeOutQuart',
            },
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
                        maxRotation: 25,
                        minRotation: 25,
                    },
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 25,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 12,
                        },
                    },
                    title: {
                        display: true,
                        text: 'Number of Participants',
                        font: {
                            size: 13,
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: props.title,
                    font: {
                        size: 16,
                        weight: 'normal',
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                    color: '#1F2937',
                },
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        padding: 15,
                        font: {
                            size: 12,
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
                        label: (context) => {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y as number;
                            return ` ${label}: ${value}`;
                        },
                    },
                },
            },
        },
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

watch(() => props.data, () => {
    createChart();
}, { deep: true });
</script>

<template>
    <div class="relative h-80 w-full sm:h-96">
        <canvas ref="canvasRef" class="h-full w-full"></canvas>
    </div>
</template>
