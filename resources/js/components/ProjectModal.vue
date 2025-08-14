<script setup lang="ts">
// Import only necessary Chart.js components for better performance
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { ProjectItem } from '../types';

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

interface Props {
    project: ProjectItem | null;
    isOpen: boolean;
}

interface Emits {
    (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const chartRef = ref<HTMLCanvasElement | null>(null);
const lineChartRef = ref<HTMLCanvasElement | null>(null);
const pieChartRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);
const lineChartInstance = ref<Chart | null>(null);
const pieChartInstance = ref<Chart | null>(null);
const isChartLoading = ref(false);

// Mock data for male and female owned businesses
const mockData = {
    gia: {
        bar: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Male-Owned Businesses',
                    data: [85, 120, 95, 180, 165],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                },
                {
                    label: 'Female-Owned Businesses',
                    data: [65, 100, 85, 140, 115],
                    backgroundColor: '#ec4899',
                    borderColor: '#db2777',
                    borderWidth: 2,
                },
            ],
        },
        line: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Male Development Progress',
                    data: [12, 19, 25, 32, 28, 35, 42, 38, 45, 52, 48, 55],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Female Development Progress',
                    data: [8, 15, 22, 28, 25, 31, 38, 34, 41, 47, 44, 50],
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        pie: {
            labels: ['Male-Owned Tech', 'Female-Owned Tech', 'Male-Owned Service', 'Female-Owned Service', 'Mixed Ownership'],
            datasets: [
                {
                    data: [245, 185, 156, 128, 95],
                    backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
            ],
        },
    },
    setup: {
        bar: {
            labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
            datasets: [
                {
                    label: 'Male-Owned Businesses',
                    data: [28, 35, 22, 42],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                },
                {
                    label: 'Female-Owned Businesses',
                    data: [17, 27, 16, 29],
                    backgroundColor: '#ec4899',
                    borderColor: '#db2777',
                    borderWidth: 2,
                },
            ],
        },
        line: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [
                {
                    label: 'Male Setup Completion Rate',
                    data: [15, 28, 45, 62, 78, 85, 92, 98],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Female Setup Completion Rate',
                    data: [12, 25, 42, 58, 74, 82, 89, 95],
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        pie: {
            labels: ['Male Early Stage', 'Female Early Stage', 'Male Advanced', 'Female Advanced', 'Completed'],
            datasets: [
                {
                    data: [45, 38, 32, 28, 67],
                    backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
            ],
        },
    },
    cest: {
        bar: {
            labels: ['Community A', 'Community B', 'Community C', 'Community D', 'Community E'],
            datasets: [
                {
                    label: 'Male-Owned Businesses',
                    data: [7, 11, 5, 14, 9],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                },
                {
                    label: 'Female-Owned Businesses',
                    data: [5, 8, 3, 11, 7],
                    backgroundColor: '#ec4899',
                    borderColor: '#db2777',
                    borderWidth: 2,
                },
            ],
        },
        line: {
            labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6'],
            datasets: [
                {
                    label: 'Male Community Engagement',
                    data: [20, 35, 42, 38, 55, 62],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Female Community Engagement',
                    data: [18, 32, 39, 35, 51, 58],
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderColor: '#ec4899',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        pie: {
            labels: ['Male Rural', 'Female Rural', 'Male Urban', 'Female Urban', 'Mixed Communities'],
            datasets: [
                {
                    data: [35, 28, 42, 38, 25],
                    backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                },
            ],
        },
    },
};

// Remove chart type selector since we only use bar charts

const currentData = computed(() => {
    if (!props.project) return mockData.gia;

    const projectKey = props.project.name.toLowerCase().includes('gia')
        ? 'gia'
        : props.project.name.toLowerCase().includes('setup')
          ? 'setup'
          : 'cest';

    return mockData[projectKey];
});

const createChart = async () => {
    if (!chartRef.value || !props.project) return;

    isChartLoading.value = true;

    // Destroy existing charts efficiently
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }
    if (lineChartInstance.value) {
        lineChartInstance.value.destroy();
        lineChartInstance.value = null;
    }
    if (pieChartInstance.value) {
        pieChartInstance.value.destroy();
        pieChartInstance.value = null;
    }

    await nextTick();

    // Create Bar Chart
    const ctx = chartRef.value.getContext('2d');
    if (ctx) {
        const barConfig: ChartConfiguration = {
            type: 'bar',
            data: currentData.value.bar,
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
                        text: `${props.project.name} - Business Ownership by Gender (Bar Chart)`,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        color: '#374151',
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#374151',
                            usePointStyle: true,
                            padding: 10,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        animation: false,
                        callbacks: {
                            afterLabel: function (): string {
                                return 'businesses';
                            },
                        } as any,
                    },
                },
                scales: {
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
                                return value + ' businesses';
                            },
                        } as any,
                        beginAtZero: true,
                    },
                },
            },
        };
        chartInstance.value = new Chart(ctx, barConfig);
    }

    // Create Line Chart
    const lineCtx = lineChartRef.value?.getContext('2d');
    if (lineCtx && lineChartRef.value) {
        const lineConfig: ChartConfiguration = {
            type: 'line',
            data: currentData.value.line,
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
                        text: `${props.project.name} - Development Progress by Gender (Line Chart)`,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        color: '#374151',
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#374151',
                            usePointStyle: true,
                            padding: 10,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        animation: false,
                    },
                },
                scales: {
                    x: {
                        grid: {
                            color: '#e5e7eb',
                            drawOnChartArea: true,
                            drawTicks: true,
                        },
                        ticks: {
                            color: '#6b7280',
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
                            callback: function (value: any): string {
                                return value + '%';
                            },
                        } as any,
                        beginAtZero: true,
                    },
                },
            },
        };
        lineChartInstance.value = new Chart(lineCtx, lineConfig);
    }

    // Create Pie Chart
    const pieCtx = pieChartRef.value?.getContext('2d');
    if (pieCtx && pieChartRef.value) {
        const pieConfig: ChartConfiguration = {
            type: 'pie',
            data: currentData.value.pie,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${props.project.name} - Business Distribution by Type & Gender (Pie Chart)`,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        color: '#374151',
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#374151',
                            usePointStyle: true,
                            padding: 8,
                            font: {
                                size: 11,
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                        animation: false,
                        callbacks: {
                            label: function (context: any): string {
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            },
                        } as any,
                    },
                },
            },
        };
        pieChartInstance.value = new Chart(pieCtx, pieConfig);
    }

    isChartLoading.value = false;
};

// Debounced chart update function for better performance
let updateTimeout: number | null = null;
let animationFrameId: number | null = null;

const updateChart = () => {
    if (updateTimeout) clearTimeout(updateTimeout);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    updateTimeout = setTimeout(() => {
        animationFrameId = requestAnimationFrame(() => {
            if (props.isOpen) {
                // Update existing charts data
                if (chartInstance.value) {
                    chartInstance.value.data = currentData.value.bar;
                    chartInstance.value.update('active');
                }
                if (lineChartInstance.value) {
                    lineChartInstance.value.data = currentData.value.line;
                    lineChartInstance.value.update('active');
                }
                if (pieChartInstance.value) {
                    pieChartInstance.value.data = currentData.value.pie;
                    pieChartInstance.value.update('active');
                }
            }
        });
    }, 100) as any;
};

const closeModal = () => {
    emit('close');
};

const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeModal();
    }
};

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
            nextTick(() => {
                createChart();
            });
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
            if (chartInstance.value) {
                chartInstance.value.destroy();
                chartInstance.value = null;
            }
            if (lineChartInstance.value) {
                lineChartInstance.value.destroy();
                lineChartInstance.value = null;
            }
            if (pieChartInstance.value) {
                pieChartInstance.value.destroy();
                pieChartInstance.value = null;
            }
            // Clear any pending updates and animations
            if (updateTimeout) {
                clearTimeout(updateTimeout);
                updateTimeout = null;
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            isChartLoading.value = false;
        }
    },
);

// Watch for project data changes and update efficiently
watch(
    currentData,
    () => {
        if (props.isOpen && (chartInstance.value || lineChartInstance.value || pieChartInstance.value)) {
            updateChart();
        }
    },
    { deep: true },
);

onMounted(() => {
    if (props.isOpen) {
        createChart();
    }
});
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen && project" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4" @click="handleOverlayClick">
            <div class="modal-content relative max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <!-- Header -->
                <div class="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900">{{ project.name }}</h2>
                            <p class="text-sm text-gray-600">Project Analytics Dashboard</p>
                        </div>
                        <button
                            type="button"
                            @click="closeModal"
                            class="modal-close-btn rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div class="modal-body space-y-6 p-6">
                    <!-- Charts Grid -->
                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <!-- Bar Chart Container -->
                        <div class="chart-container relative h-80 w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <!-- Loading spinner -->
                            <div v-if="isChartLoading" class="chart-loading absolute inset-0 flex items-center justify-center bg-gray-50/80">
                                <div class="flex items-center gap-3">
                                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                                    <span class="text-sm text-gray-600">Loading charts...</span>
                                </div>
                            </div>
                            <canvas ref="chartRef" class="h-full w-full" :class="{ 'opacity-0': isChartLoading }"></canvas>
                        </div>

                        <!-- Line Chart Container -->
                        <div class="chart-container relative h-80 w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <canvas ref="lineChartRef" class="h-full w-full" :class="{ 'opacity-0': isChartLoading }"></canvas>
                        </div>
                    </div>

                    <!-- Pie Chart Container (Full Width) -->
                    <div class="chart-container relative h-80 w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <canvas ref="pieChartRef" class="h-full w-full" :class="{ 'opacity-0': isChartLoading }"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
