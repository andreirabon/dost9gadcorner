<script setup lang="ts">
import AssemblyStackedBarChart from '@/components/charts/AssemblyStackedBarChart.vue';
import CestFundingChart from '@/components/charts/CestFundingChart.vue';
import EmployeesGroupedBarChart from '@/components/charts/EmployeesGroupedBarChart.vue';
import GenderPieChart from '@/components/charts/GenderPieChart.vue';
import RstlWarmBodiesStackedChart from '@/components/charts/RstlWarmBodiesStackedChart.vue';
import ScholarsPieChart from '@/components/charts/ScholarsPieChart.vue';
import SetupFundingChart from '@/components/charts/SetupFundingChart.vue';
import type { YearItem } from '@/types';
import { computed, ref, watch } from 'vue';

// GFPS Assembly Participation Data
const assemblyData = [
    { label: '1st Assembly', female: 20, male: 5 },
    { label: '2nd Assembly', female: 20, male: 5 },
    { label: '3rd Quarter', female: 14, male: 3 },
    { label: '4th Quarter', female: 16, male: 4 },
];

// DOST IX Employees by Employment Status
const employeesData = [
    { label: 'Plantilla', female: 16, male: 17 },
    { label: 'COS', female: 40, male: 42 },
    { label: 'Agency', female: 0, male: 11 },
    { label: 'JO', female: 1, male: 1 },
];

const rstlWarmBodiesData = [
    { label: 'Jan', female: 0, femaleLed: 0, male: 0, maleLed: 0 },
    { label: 'Feb', female: 9, femaleLed: 0, male: 9, maleLed: 0 },
    { label: 'Mar', female: 28, femaleLed: 7, male: 6, maleLed: 0 },
    { label: 'Apr', female: 24, femaleLed: 0, male: 9, maleLed: 0 },
    { label: 'May', female: 3, femaleLed: 0, male: 8, maleLed: 0 },
    { label: 'Jun', female: 3, femaleLed: 4, male: 0, maleLed: 0 },
    { label: 'Jul', female: 7, femaleLed: 0, male: 4, maleLed: 0 },
    { label: 'Aug', female: 5, femaleLed: 2, male: 4, maleLed: 0 },
    { label: 'Sep', female: 7, femaleLed: 4, male: 14, maleLed: 0 },
    { label: 'Oct', female: 8, femaleLed: 0, male: 5, maleLed: 0 },
    { label: 'Nov', female: 23, femaleLed: 0, male: 6, maleLed: 0 },
    { label: 'Dec', female: 19, femaleLed: 0, male: 8, maleLed: 0 },
];

// SETUP Funding Data 2025
const setupFundingData = {
    maleProjects: 12,
    maleAmount: 33181684.88,
    femaleProjects: 8,
    femaleAmount: 16959729.04,
};

// CEST Funding Data 2025
const cestFundingData = {
    maleProjects: 9,
    maleAmount: 14749920.98,
    femaleProjects: 5,
    femaleAmount: 14673427.29,
};

// Summary statistics
const gfpsStats = computed(() => ({
    totalMembers: 28,
    femaleCount: 22,
    maleCount: 6,
    femalePercentage: 78.6,
    malePercentage: 21.4,
}));

const employeesStats = computed(() => ({
    totalEmployees: 128,
    femaleCount: 57,
    maleCount: 71,
}));

const scholarsStats = computed(() => ({
    totalScholars: 178,
    femaleCount: 64,
    maleCount: 114,
}));

const rstlStats = computed(() => {
    const totalFemale = rstlWarmBodiesData.reduce((sum, d) => sum + d.female + d.femaleLed, 0);
    const totalMale = rstlWarmBodiesData.reduce((sum, d) => sum + d.male + d.maleLed, 0);
    return {
        totalCustomers: totalFemale + totalMale,
        femaleCount: totalFemale,
        maleCount: totalMale,
    };
});

const setupStats = computed(() => ({
    totalProjects: setupFundingData.maleProjects + setupFundingData.femaleProjects,
    totalAmount: setupFundingData.maleAmount + setupFundingData.femaleAmount,
    maleProjects: setupFundingData.maleProjects,
    femaleProjects: setupFundingData.femaleProjects,
}));

const cestStats = computed(() => ({
    totalProjects: cestFundingData.maleProjects + cestFundingData.femaleProjects,
    totalAmount: cestFundingData.maleAmount + cestFundingData.femaleAmount,
    maleProjects: cestFundingData.maleProjects,
    femaleProjects: cestFundingData.femaleProjects,
}));

interface Props {
    year: YearItem | null;
    isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

type TabType = 'GFPS' | 'DOST IX Employees' | 'Scholarship' | 'RSTL' | 'SETUP' | 'CEST';
const activeTab = ref<TabType>('GFPS');
const isChartLoading = ref(false);

const tabs: TabType[] = ['GFPS', 'DOST IX Employees', 'Scholarship', 'RSTL', 'SETUP', 'CEST'];

const selectTab = (tab: TabType) => {
    activeTab.value = tab;
};

const closeModal = () => emit('close');

const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeModal();
};

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeModal();
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Event listeners management
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
            isChartLoading.value = true;
            // Shorter loading time for snappier feel
            setTimeout(() => {
                isChartLoading.value = false;
            }, 150);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        }
    },
);

// Watch tab changes - minimal delay for smooth transition
watch(activeTab, () => {
    isChartLoading.value = true;
    // Reduced delay for faster tab switching
    setTimeout(() => {
        isChartLoading.value = false;
    }, 100);
});
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen && year"
                class="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 md:p-4 lg:p-6"
                @click="handleOverlayClick"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="`modal-title-${year.id}`"
            >
                <div
                    class="modal-content relative h-full max-h-full w-full overflow-hidden bg-white shadow-2xl md:max-h-[95vh] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl md:rounded-2xl"
                    @click.stop
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 md:px-6 md:py-4">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2
                                    :id="`modal-title-${year.id}`"
                                    class="text-base font-bold text-white md:text-lg lg:text-xl"
                                >
                                    {{ year.year }} Sex Disaggregated Data Report
                                </h2>
                                <p class="text-xs text-blue-200 md:text-sm">Department of Science and Technology Regional Office No. IX</p>
                            </div>
                        </div>
                            <button
                            type="button"
                            @click="closeModal"
                            class="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                            aria-label="Close modal"
                        >
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Navigation Tabs -->
                    <div class="border-b border-gray-200 bg-gray-50/80 px-4 py-2 md:px-6 md:py-3">
                        <div class="flex gap-1 overflow-x-auto pb-1 scrollbar-hide md:gap-2">
                            <button
                                v-for="tab in tabs"
                                :key="tab"
                                @click="selectTab(tab)"
                                :class="[
                                    'whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 md:px-4 md:py-2.5 md:text-sm touch-manipulation',
                                    activeTab === tab
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                ]"
                            >
                                {{ tab }}
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable Content -->
                    <div class="h-[calc(100%-140px)] overflow-y-auto bg-gray-100 p-3 md:max-h-[calc(95vh-140px)] md:p-5 lg:p-6">
                        <!-- Loading State -->
                        <div v-if="isChartLoading" class="flex h-64 items-center justify-center">
                            <div class="flex flex-col items-center gap-3">
                                <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-900"></div>
                                <p class="text-sm text-gray-500">Loading charts...</p>
                            </div>
                        </div>

                        <!-- GFPS Tab -->
                        <div v-else-if="activeTab === 'GFPS'" class="space-y-4">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Members</p>
                                    <p class="text-lg font-bold text-blue-900 md:text-xl lg:text-2xl">{{ gfpsStats.totalMembers }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Female Members</p>
                                    <p class="text-lg font-bold text-orange-500 md:text-xl lg:text-2xl">{{ gfpsStats.femaleCount }}</p>
                                    <p class="text-xs text-gray-400">{{ gfpsStats.femalePercentage }}%</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male Members</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ gfpsStats.maleCount }}</p>
                                    <p class="text-xs text-gray-400">{{ gfpsStats.malePercentage }}%</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">GFPS Assemblies</p>
                                    <p class="text-lg font-bold text-green-600 md:text-xl lg:text-2xl">4</p>
                                    <p class="text-xs text-gray-400">Quarterly</p>
                                </div>
                            </div>

                            <!-- Charts Grid -->
                            <div class="grid gap-3 md:grid-cols-2 md:gap-4">
                                <!-- Gender Distribution -->
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                    <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                        <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">GFPS Membership by Sex</h3>
                                        <p class="text-xs text-gray-500 md:text-sm">Distribution of Gender and Development Focal Point System members</p>
                                    </div>
                                    <GenderPieChart :female-count="22" :male-count="6" />
                                </div>

                                <!-- Assembly Participation -->
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                    <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                        <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">GFPS Assembly Participation</h3>
                                        <p class="text-xs text-gray-500 md:text-sm">Quarterly assembly attendance by sex</p>
                                    </div>
                                    <AssemblyStackedBarChart :data="assemblyData" />
                                </div>
                            </div>
                        </div>

                        <!-- DOST IX Employees Tab -->
                        <div v-else-if="activeTab === 'DOST IX Employees'" class="space-y-3 md:space-y-4">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Employees</p>
                                    <p class="text-lg font-bold text-blue-900 md:text-xl lg:text-2xl">{{ employeesStats.totalEmployees }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Female Employees</p>
                                    <p class="text-lg font-bold text-orange-500 md:text-xl lg:text-2xl">{{ employeesStats.femaleCount }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male Employees</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ employeesStats.maleCount }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Employment Types</p>
                                    <p class="text-lg font-bold text-green-600 md:text-xl lg:text-2xl">4</p>
                                    <p class="text-xs text-gray-400">Categories</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Employees by Employment Status</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">Sex-disaggregated data as of December 31, 2025</p>
                                </div>
                                <EmployeesGroupedBarChart :data="employeesData" />
                            </div>
                        </div>

                        <!-- Scholarship Tab -->
                        <div v-else-if="activeTab === 'Scholarship'" class="space-y-3 md:space-y-4">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Scholars</p>
                                    <p class="text-lg font-bold text-blue-900 md:text-xl lg:text-2xl">{{ scholarsStats.totalScholars }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Female Scholars</p>
                                    <p class="text-lg font-bold text-pink-500 md:text-xl lg:text-2xl">{{ scholarsStats.femaleCount }}</p>
                                    <p class="text-xs text-gray-400">36%</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male Scholars</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ scholarsStats.maleCount }}</p>
                                    <p class="text-xs text-gray-400">64%</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">School Year</p>
                                    <p class="text-lg font-bold text-purple-600 md:text-xl lg:text-2xl">2025-26</p>
                                    <p class="text-xs text-gray-400">As of Jan 13</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Distribution of On-Going Scholars by Sex</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">School Year 2025-2026 • Data as of January 13, 2025</p>
                                </div>
                                <div class="mx-auto w-full max-w-md lg:max-w-lg">
                                    <ScholarsPieChart :female-count="64" :male-count="114" />
                                </div>
                            </div>
                        </div>

                        <!-- RSTL Tab -->
                        <div v-else-if="activeTab === 'RSTL'" class="space-y-3 md:space-y-4">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Customers</p>
                                    <p class="text-lg font-bold text-blue-900 md:text-xl lg:text-2xl">{{ rstlStats.totalCustomers }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Female</p>
                                    <p class="text-lg font-bold text-orange-500 md:text-xl lg:text-2xl">{{ rstlStats.femaleCount }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ rstlStats.maleCount }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Period</p>
                                    <p class="text-lg font-bold text-green-600 md:text-xl lg:text-2xl">2025</p>
                                    <p class="text-xs text-gray-400">Full Year</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Testing and Calibration Services</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">Number of customers by sex (warm bodies) - Monthly breakdown for 2025</p>
                                </div>
                                <RstlWarmBodiesStackedChart :data="rstlWarmBodiesData" />
                            </div>
                        </div>

                        <!-- SETUP Tab -->
                        <div v-else-if="activeTab === 'SETUP'" class="space-y-3 md:space-y-4">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Projects</p>
                                    <p class="text-lg font-bold text-blue-900 md:text-xl lg:text-2xl">{{ setupStats.totalProjects }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Funding</p>
                                    <p class="text-base font-bold text-green-600 md:text-lg lg:text-xl">{{ formatCurrency(setupStats.totalAmount) }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male-led Projects</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ setupStats.maleProjects }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Female-led Projects</p>
                                    <p class="text-lg font-bold text-orange-500 md:text-xl lg:text-2xl">{{ setupStats.femaleProjects }}</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Small Enterprise Technology Upgrading Program (SETUP)</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">Number and amount of projects funded by sex • 2025</p>
                                </div>
                                <SetupFundingChart :data="setupFundingData" />
                            </div>
                        </div>

                        <!-- CEST Tab -->
                        <div v-else-if="activeTab === 'CEST'" class="space-y-3 md:space-y-4">
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Projects</p>
                                    <p class="text-lg font-bold text-blue-900 md:text-xl lg:text-2xl">{{ cestStats.totalProjects }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Total Funding</p>
                                    <p class="text-base font-bold text-green-600 md:text-lg lg:text-xl">{{ formatCurrency(cestStats.totalAmount) }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male-led Projects</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ cestStats.maleProjects }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Female-led Projects</p>
                                    <p class="text-lg font-bold text-orange-500 md:text-xl lg:text-2xl">{{ cestStats.femaleProjects }}</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Community Empowerment thru Science and Technology (CEST)</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">Number and amount of projects funded by sex • 2025</p>
                                </div>
                                <CestFundingChart :data="cestFundingData" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
