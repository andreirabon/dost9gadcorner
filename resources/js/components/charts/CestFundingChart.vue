<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface CestFundingData {
    maleProjects: number;
    maleAmount: number;
    femaleProjects: number;
    femaleAmount: number;
}

interface Props {
    data: CestFundingData;
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'CEST: Number and Amount of Projects Funded',
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);

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
            labels: ['Male', 'Female'],
            datasets: [
                {
                    label: 'No. of Projects',
                    data: [props.data.maleProjects, props.data.femaleProjects],
                    backgroundColor: ['#5B9BD5', '#5B9BD5'],
                    borderColor: ['#4A8BC8', '#4A8BC8'],
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y',
                },
                {
                    label: 'Amount Funded',
                    data: [props.data.maleAmount, props.data.femaleAmount],
                    backgroundColor: ['#ED7D31', '#ED7D31'],
                    borderColor: ['#E06E22', '#E06E22'],
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y1',
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
                            size: 14,
                            weight: 'bold',
                        },
                    },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Projects',
                        font: {
                            size: 13,
                            weight: 'bold',
                        },
                        color: '#5B9BD5',
                    },
                    ticks: {
                        stepSize: 2,
                        font: {
                            size: 12,
                        },
                        color: '#5B9BD5',
                    },
                    grid: {
                        display: true,
                        color: 'rgba(91, 155, 213, 0.1)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (PHP)',
                        font: {
                            size: 13,
                            weight: 'bold',
                        },
                        color: '#ED7D31',
                    },
                    ticks: {
                        callback: (value) => formatCompactCurrency(value as number),
                        font: {
                            size: 11,
                        },
                        color: '#ED7D31',
                    },
                    grid: {
                        display: false,
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
                    color: '#111827',
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        padding: 20,
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
                    padding: 12,
                    callbacks: {
                        label: (context) => {
                            const datasetLabel = context.dataset.label || '';
                            const value = context.parsed.y as number;
                            if (datasetLabel === 'Amount Funded') {
                                return ` ${datasetLabel}: ${formatCurrency(value)}`;
                            }
                            return ` ${datasetLabel}: ${value}`;
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

                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        const yAxisID = dataset.yAxisID as string;
                        const isAmount = yAxisID === 'y1';

                        meta.data.forEach((bar, index) => {
                            const value = dataset.data[index] as number;

                            if (!value || value === 0) {
                                return;
                            }

                            const barElement = bar as BarElement;
                            const x = barElement.x;
                            const yTop = barElement.y;

                            ctx.save();
                            ctx.fillStyle = isAmount ? '#ED7D31' : '#5B9BD5';
                            ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';

                            const label = isAmount ? formatCompactCurrency(value) : String(value);
                            ctx.fillText(label, x, yTop - 4);
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
    <div class="relative h-96 w-full">
        <canvas ref="canvasRef" class="h-full w-full"></canvas>
    </div>
</template>
