<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, PieController, Tooltip } from 'chart.js';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

ChartJS.register(PieController, ArcElement, Tooltip, Legend);

interface Props {
    femaleCount: number;
    maleCount: number;
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<ChartJS | null>(null);

const total = () => props.femaleCount + props.maleCount;

const femalePercentage = () => {
    const t = total();
    return t === 0 ? 0 : ((props.femaleCount / t) * 100).toFixed(1);
};

const malePercentage = () => {
    const t = total();
    return t === 0 ? 0 : ((props.maleCount / t) * 100).toFixed(1);
};

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
        type: 'pie',
        data: {
            labels: ['Female', 'Male'],
            datasets: [
                {
                    data: [props.femaleCount, props.maleCount],
                    backgroundColor: ['#2563EB', '#F97316'], // Blue for female, Orange for male
                    borderColor: ['#1D4ED8', '#EA580C'],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500,
                easing: 'easeOutQuart',
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14,
                        },
                        padding: 20,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed as number;
                            const label = context.label || '';
                            return ` ${label}: ${value}`;
                        },
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1F2937',
                    bodyColor: '#1F2937',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    bodyFont: {
                        size: 16,
                        weight: 'bold',
                    },
                    titleFont: {
                        size: 14,
                    },
                },
            },
        },
        plugins: [
            {
                id: 'percentageLabels',
                afterDraw: (chart) => {
                    const { ctx, chartArea } = chart;
                    if (!ctx || !chartArea) return;

                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                    const radius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2 * 0.65;

                    const t = total();
                    if (t === 0) return;

                    // Calculate angles for each slice
                    // Female is first slice (index 0), starting from top (-PI/2)
                    const femaleSliceAngle = (props.femaleCount / t) * 2 * Math.PI;
                    const maleSliceAngle = (props.maleCount / t) * 2 * Math.PI;

                    // Female label position - middle of female slice
                    const femaleMidAngle = -0.5 * Math.PI + femaleSliceAngle / 2;
                    const femaleX = centerX + Math.cos(femaleMidAngle) * radius;
                    const femaleY = centerY + Math.sin(femaleMidAngle) * radius;

                    // Male label position - middle of male slice
                    const maleMidAngle = femaleMidAngle + femaleSliceAngle / 2 + maleSliceAngle / 2;
                    const maleX = centerX + Math.cos(maleMidAngle) * radius;
                    const maleY = centerY + Math.sin(maleMidAngle) * radius;

                    ctx.save();

                    // Female percentage label
                    ctx.fillStyle = '#1F2937';
                    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${femalePercentage()}%`, femaleX, femaleY);

                    // Male percentage label
                    ctx.fillStyle = '#1F2937';
                    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${malePercentage()}%`, maleX, maleY);

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

watch(() => [props.femaleCount, props.maleCount], () => {
    createChart();
});
</script>

<template>
    <div class="relative h-72 w-full sm:h-80">
        <canvas ref="canvasRef" class="h-full w-full"></canvas>
    </div>
</template>
