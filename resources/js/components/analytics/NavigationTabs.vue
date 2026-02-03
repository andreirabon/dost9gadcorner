<script setup lang="ts">
interface TabItem {
    value: string;
    label: string;
}

interface Props {
    tabs: readonly string[] | TabItem[];
    activeTab: string;
    activeQuarter: string;
    quarters: readonly string[];
}

interface Emits {
    (e: 'select-tab', tab: string): void;
    (e: 'select-quarter', quarter: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const selectTab = (tab: string) => {
    emit('select-tab', tab);
};

const selectQuarter = (quarter: string) => {
    emit('select-quarter', quarter);
};

const getTabLabel = (tab: string | TabItem): string => {
    return typeof tab === 'string' ? tab : tab.label;
};

const getTabValue = (tab: string | TabItem): string => {
    return typeof tab === 'string' ? tab : tab.value;
};
</script>

<template>
    <!-- Navigation Controls -->
    <div class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-6">
        <!-- Header Section -->
        <div class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2 sm:gap-3">
                <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md sm:h-10 sm:w-10">
                    <svg class="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                </div>
                <div>
                    <h3 class="text-base font-semibold text-gray-900 sm:text-lg">Data Analytics</h3>
                    <p class="text-xs text-gray-500 sm:text-sm">Select region and reporting period</p>
                </div>
            </div>
            <!-- Live Status Indicator -->
            <div class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 sm:px-3 sm:py-1.5">
                <div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                <span class="text-xs font-medium text-emerald-700">Live Data</span>
            </div>
        </div>

        <!-- Navigation Tabs Container -->
        <div class="space-y-4 sm:space-y-5">
            <!-- Primary Navigation: Regions -->
            <div class="space-y-2 sm:space-y-3">
                <label class="block text-xs font-medium text-gray-700 sm:text-sm">
                    <span class="flex items-center gap-1.5 sm:gap-2">
                        <svg class="h-3.5 w-3.5 text-indigo-500 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Region Selection
                    </span>
                </label>
                <div class="grid grid-cols-1 gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-1.5 sm:grid-cols-2 sm:p-2 md:grid-cols-4">
                    <button
                        v-for="tab in tabs"
                        :key="getTabValue(tab)"
                        type="button"
                        @click="selectTab(getTabValue(tab))"
                        :class="[
                            'touch-target flex items-center justify-center rounded-md border-2 px-3 py-2.5 text-xs font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4 sm:py-3 sm:text-sm',
                            activeTab === getTabValue(tab)
                                ? 'border-indigo-700 bg-indigo-600 text-white shadow-md'
                                : 'border-indigo-300 text-indigo-700 hover:border-indigo-400 hover:bg-white hover:text-indigo-900 hover:shadow-sm',
                        ]"
                        :aria-pressed="activeTab === getTabValue(tab)"
                    >
                        <span class="font-semibold">{{ getTabLabel(tab) }}</span>
                    </button>
                </div>
            </div>

            <!-- Secondary Navigation: Quarters -->
            <div class="space-y-2 sm:space-y-3">
                <label class="block text-xs font-medium text-gray-700 sm:text-sm">
                    <span class="flex items-center gap-1.5 sm:gap-2">
                        <svg class="h-3.5 w-3.5 text-orange-500 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Reporting Period
                    </span>
                </label>
                <div class="flex flex-wrap gap-1 rounded-lg border border-orange-200 bg-orange-50 p-1 sm:flex-nowrap">
                    <button
                        v-for="quarter in quarters"
                        :key="quarter"
                        type="button"
                        @click="selectQuarter(quarter)"
                        :class="[
                            'touch-target flex-1 rounded-md border-2 px-2 py-2 text-xs font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:outline-none sm:px-3',
                            activeQuarter === quarter
                                ? 'border-orange-600 bg-orange-500 text-white shadow-sm'
                                : 'border-orange-300 text-orange-700 hover:border-orange-400 hover:bg-white/70 hover:text-orange-900',
                        ]"
                        :aria-pressed="activeQuarter === quarter"
                    >
                        {{ quarter }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Active Selection Summary -->
        <div class="mt-4 rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-3 sm:mt-6 sm:p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 sm:h-8 sm:w-8">
                        <svg class="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-900 sm:text-sm">Current Selection</p>
                        <p class="hidden text-xs text-gray-500 sm:block">Displaying filtered data below</p>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 sm:px-3 sm:py-1">
                        {{ activeTab }}
                    </span>
                    <svg class="hidden h-3 w-3 text-gray-400 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800 sm:px-3 sm:py-1">
                        {{ activeQuarter }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
