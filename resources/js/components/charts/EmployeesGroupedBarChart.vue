<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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
                    backgroundColor: '#60A5FA', // Light blue
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                    borderRadius: 2,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                },
                {
                    label: 'Male',
                    data: props.data.map((d) => d.male),
                    backgroundColor: '#FB923C', // Light orange
                    borderColor: '#F97316',
                    borderWidth: 1,
                    borderRadius: 2,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
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
                    beginAtZero: true,
                    max: 45,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 12,
                        },
                    },
                    grid: {
                        color: '#E5E7EB',
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
                    position: 'bottom',
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
        plugins: [
            {
                id: 'valueLabels',
                afterDatasetsDraw: (chart) => {
                    const { ctx } = chart;
                    if (!ctx) return;
                    ctx.save();

                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        if (!meta.hidden) {
                            meta.data.forEach((bar, index) => {
                                const value = dataset.data[index] as number;
                                if (value === 0) return;

                                ctx.fillStyle = '#1F2937';
                                ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(`${value}`, bar.x, bar.y - 4);
                            });
                        }
                    });

                    ctx.restore();
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

watch(() => props.data, () => {
    createChart();
}, { deep: true });
</script>

<template>
    <div class="relative h-80 w-full sm:h-96">
        <canvas ref="canvasRef" class="h-full w-full"></canvas>
    </div>
</template>
