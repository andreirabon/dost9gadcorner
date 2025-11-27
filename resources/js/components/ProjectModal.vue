<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { mockChartData } from '../data/chartData';
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
};

const selectQuarter = (quarter: string) => {
    activeQuarter.value = quarter as typeof activeQuarter.value;
};

const currentData = computed(() => {
    if (!props.project) return mockChartData.gia;

    const name = props.project.name.toLowerCase();
    return name.includes('gia') ? mockChartData.gia : name.includes('setup') ? mockChartData.setup : mockChartData.cest;
});

const closeModal = () => emit('close');

const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeModal();
};

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeModal();
};

// Event listeners management
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
            isChartLoading.value = false;
        }
    },
);

// Chart loading simulation - use requestAnimationFrame for better performance
watch([activeTab, activeQuarter], () => {
    isChartLoading.value = true;
    requestAnimationFrame(() => {
        setTimeout(() => {
            isChartLoading.value = false;
        }, 100);
    });
});
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen && project"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                @click="handleOverlayClick"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="`modal-title-${project.id}`"
            >
                <div class="relative max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all" @click.stop>
                    <!-- Header Component -->
                    <ModalHeader :id="`modal-title-${project.id}`" :title="project.name" @close="closeModal" />

                    <!-- Scrollable Content -->
                    <div class="max-h-[calc(95vh-80px)] overflow-y-auto overscroll-contain">
                        <div class="space-y-6 p-4 md:p-6">
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
            </div>
        </Transition>
    </Teleport>
</template>
