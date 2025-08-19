<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ProjectItem } from '../types';
import NavigationTabs from './analytics/NavigationTabs.vue';
import ChartsGrid from './charts/ChartsGrid.vue';
import ModalHeader from './modal/ModalHeader.vue';

interface Props {
    project: ProjectItem | null;
    isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

const isChartLoading = ref(false);
const activeTab = ref<'Zamboanga City & Isabela City' | 'Zamboanga Sibugay Province' | 'Zamboanga Del Sur' | 'Zamboanga Del Norte'>(
    'Zamboanga City & Isabela City',
);
const activeQuarter = ref<'1st Quarter' | '2nd Quarter' | '3rd Quarter' | '4th Quarter'>('1st Quarter');

// Simplified tabs arrays
const tabs = ['Zamboanga City & Isabela City', 'Zamboanga Sibugay Province', 'Zamboanga Del Sur', 'Zamboanga Del Norte'] as const;
const quarters = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'] as const;

const selectTab = (tab: string) => {
    activeTab.value = tab as typeof activeTab.value;
    activeQuarter.value = '1st Quarter'; // Reset quarter on tab change
};

const selectQuarter = (quarter: string) => {
    activeQuarter.value = quarter as typeof activeQuarter.value;
};

// Simplified mock data
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

const currentData = computed(() => {
    if (!props.project) return mockData.gia;

    const name = props.project.name.toLowerCase();
    return name.includes('gia') ? mockData.gia : name.includes('setup') ? mockData.setup : mockData.cest;
});

const closeModal = () => emit('close');

const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeModal();
};

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeModal();
};

// Touch handling for mobile
const touchStart = ref<{ x: number; y: number; time: number } | null>(null);

const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (touch) {
        touchStart.value = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
        };
    }
};

const onTouchEnd = (event: TouchEvent) => {
    if (!touchStart.value) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaY = touch.clientY - touchStart.value.y;
    const deltaX = touch.clientX - touchStart.value.x;
    const deltaTime = Date.now() - touchStart.value.time;

    // Swipe down to close
    if (deltaY > 100 && Math.abs(deltaX) < 100 && deltaTime < 500) {
        closeModal();
    }
    touchStart.value = null;
};

// Event listeners management
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
            if ('ontouchstart' in window) {
                document.addEventListener('touchstart', onTouchStart, { passive: true });
                document.addEventListener('touchend', onTouchEnd, { passive: true });
            }
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
            if ('ontouchstart' in window) {
                document.removeEventListener('touchstart', onTouchStart);
                document.removeEventListener('touchend', onTouchEnd);
            }
            isChartLoading.value = false;
            touchStart.value = null;
        }
    },
);

// Chart loading simulation
watch([activeTab, activeQuarter], () => {
    isChartLoading.value = true;
    setTimeout(() => {
        isChartLoading.value = false;
    }, 300);
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isOpen && project"
            class="modal-overlay inset-safe mobile-perf fixed z-50 flex items-center justify-center p-4"
            @click="handleOverlayClick"
        >
            <div
                :class="[
                    'modal-content mobile-perf relative max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl',
                    'md:max-h-[95vh] md:max-w-6xl',
                    'modal-mobile modal-content-mobile',
                ]"
                @touchstart="onTouchStart"
                @touchend="onTouchEnd"
            >
                <!-- Header Component -->
                <ModalHeader :title="project.name" @close="closeModal" />

                <!-- Content -->
                <div class="modal-body pb-safe space-y-6 p-4 md:p-6">
                    <!-- Navigation Controls -->
                    <NavigationTabs
                        :active-tab="activeTab"
                        :active-quarter="activeQuarter"
                        :tabs="tabs"
                        :quarters="quarters"
                        @select-tab="selectTab"
                        @select-quarter="selectQuarter"
                    />

                    <!-- Charts Grid Component -->
                    <ChartsGrid
                        :bar-data="currentData.bar"
                        :line-data="currentData.line"
                        :pie-data="currentData.pie"
                        :project-name="project.name"
                        :is-loading="isChartLoading"
                    />
                </div>
            </div>
        </div>
    </Teleport>
</template>
