<script setup lang="ts">
import type { YearItem } from '@/types';
import type { FundingSummaryData, GfpsAssemblyDataRow, ReportYearData, RstlMonthlyDataRow } from '@/types/reports';
import { computed, defineAsyncComponent, onUnmounted, ref, watch } from 'vue';

const AssemblyStackedBarChart = defineAsyncComponent(() => import('@/components/charts/AssemblyStackedBarChart.vue'));
const CestFundingChart = defineAsyncComponent(() => import('@/components/charts/CestFundingChart.vue'));
const EmployeesGroupedBarChart = defineAsyncComponent(() => import('@/components/charts/EmployeesGroupedBarChart.vue'));
const GenderPieChart = defineAsyncComponent(() => import('@/components/charts/GenderPieChart.vue'));
const RstlWarmBodiesStackedChart = defineAsyncComponent(() => import('@/components/charts/RstlWarmBodiesStackedChart.vue'));
const ScholarsPieChart = defineAsyncComponent(() => import('@/components/charts/ScholarsPieChart.vue'));
const SetupFundingChart = defineAsyncComponent(() => import('@/components/charts/SetupFundingChart.vue'));

interface Props {
    year: YearItem | null;
    isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

const emptyFundingData: FundingSummaryData = {
    maleProjects: 0,
    maleAmount: 0,
    femaleProjects: 0,
    femaleAmount: 0,
};

const reportData = computed<ReportYearData | null>(() => props.year?.reportData ?? null);

const assemblyData = computed<GfpsAssemblyDataRow[]>(() => reportData.value?.gfpsAssemblies ?? []);
const employeesData = computed<GfpsAssemblyDataRow[]>(() => reportData.value?.employeeStatuses ?? []);
const rstlWarmBodiesData = computed<RstlMonthlyDataRow[]>(() => reportData.value?.rstlMonthly ?? []);
const setupFundingData = computed<FundingSummaryData>(() => reportData.value?.setupFunding ?? emptyFundingData);
const cestFundingData = computed<FundingSummaryData>(() => reportData.value?.cestFunding ?? emptyFundingData);

const percentage = (value: number, total: number): number => {
    if (total === 0) {
        return 0;
    }

    return Number(((value / total) * 100).toFixed(1));
};

/** Years that do not yet have published statistics in this modal */
const isYearDataPending = computed(() => props.year?.status !== 'published' || reportData.value === null);

const gfpsStats = computed(() => {
    const femaleCount = reportData.value?.gfpsMembership.femaleCount ?? 0;
    const maleCount = reportData.value?.gfpsMembership.maleCount ?? 0;
    const totalMembers = femaleCount + maleCount;

    return {
        totalMembers,
        femaleCount,
        maleCount,
        femalePercentage: percentage(femaleCount, totalMembers),
        malePercentage: percentage(maleCount, totalMembers),
    };
});

const employeesStats = computed(() => {
    const femaleCount = employeesData.value.reduce((sum, row) => sum + row.female, 0);
    const maleCount = employeesData.value.reduce((sum, row) => sum + row.male, 0);

    return {
        totalEmployees: femaleCount + maleCount,
        femaleCount,
        maleCount,
    };
});

const scholarsStats = computed(() => {
    const femaleCount = reportData.value?.scholarship.femaleCount ?? 0;
    const maleCount = reportData.value?.scholarship.maleCount ?? 0;
    const totalScholars = femaleCount + maleCount;

    return {
        totalScholars,
        femaleCount,
        maleCount,
        femalePercentage: percentage(femaleCount, totalScholars),
        malePercentage: percentage(maleCount, totalScholars),
        schoolYearLabel: reportData.value?.scholarship.schoolYearLabel ?? '',
        asOfDate: reportData.value?.scholarship.asOfDate ?? null,
    };
});

const rstlStats = computed(() => {
    const totalFemale = rstlWarmBodiesData.value.reduce((sum, row) => sum + row.female + row.femaleLed, 0);
    const totalMale = rstlWarmBodiesData.value.reduce((sum, row) => sum + row.male + row.maleLed, 0);

    return {
        totalCustomers: totalFemale + totalMale,
        femaleCount: totalFemale,
        maleCount: totalMale,
    };
});

const setupStats = computed(() => ({
    totalProjects: setupFundingData.value.maleProjects + setupFundingData.value.femaleProjects,
    totalAmount: setupFundingData.value.maleAmount + setupFundingData.value.femaleAmount,
    maleProjects: setupFundingData.value.maleProjects,
    femaleProjects: setupFundingData.value.femaleProjects,
}));

const cestStats = computed(() => ({
    totalProjects: cestFundingData.value.maleProjects + cestFundingData.value.femaleProjects,
    totalAmount: cestFundingData.value.maleAmount + cestFundingData.value.femaleAmount,
    maleProjects: cestFundingData.value.maleProjects,
    femaleProjects: cestFundingData.value.femaleProjects,
}));

const totalFemaleAcrossPrograms = computed(
    () => gfpsStats.value.femaleCount + employeesStats.value.femaleCount + scholarsStats.value.femaleCount + rstlStats.value.femaleCount,
);

const totalMaleAcrossPrograms = computed(
    () => gfpsStats.value.maleCount + employeesStats.value.maleCount + scholarsStats.value.maleCount + rstlStats.value.maleCount,
);

const combinedFundingAmount = computed(() => setupStats.value.totalAmount + cestStats.value.totalAmount);
const combinedProjectsCount = computed(() => setupStats.value.totalProjects + cestStats.value.totalProjects);

type TabType = 'Overview' | 'GFPS' | 'DOST IX Employees' | 'Scholarship' | 'RSTL' | 'SETUP' | 'CEST';
const tabs: TabType[] = ['Overview', 'GFPS', 'DOST IX Employees', 'Scholarship', 'RSTL', 'SETUP', 'CEST'];
const activeTab = ref<TabType>('Overview');
const isChartLoading = ref(false);
let openLoadingTimeout: ReturnType<typeof setTimeout> | null = null;
let tabLoadingTimeout: ReturnType<typeof setTimeout> | null = null;
const tabStorageKey = 'year-modal-last-tab';

const isValidTab = (value: string): value is TabType => tabs.includes(value as TabType);

const formatCompactNumber = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
};

const selectTab = (tab: TabType) => {
    activeTab.value = tab;
    if (typeof window !== 'undefined') {
        localStorage.setItem(tabStorageKey, tab);
    }
};

const selectNextTab = (direction: 1 | -1) => {
    const currentIndex = tabs.indexOf(activeTab.value);
    if (currentIndex === -1) {
        return;
    }

    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    selectTab(tabs[nextIndex]);
};

const handleTabKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        selectNextTab(1);
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectNextTab(-1);
        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        selectTab(tabs[0]);
        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        selectTab(tabs[tabs.length - 1]);
    }
};

const handleMobileTabChange = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    if (target !== null && isValidTab(target.value)) {
        selectTab(target.value);
    }
};

const overviewPrograms = computed<
    Array<{
        tab: Exclude<TabType, 'Overview'>;
        title: string;
        primaryLabel: string;
        primaryValue: string | number;
        secondaryLabel: string;
        secondaryValue: string | number;
    }>
>(() => [
    {
        tab: 'GFPS',
        title: 'GFPS',
        primaryLabel: 'Members',
        primaryValue: gfpsStats.value.totalMembers,
        secondaryLabel: 'Female share',
        secondaryValue: `${gfpsStats.value.femalePercentage}%`,
    },
    {
        tab: 'DOST IX Employees',
        title: 'Employees',
        primaryLabel: 'Total employees',
        primaryValue: employeesStats.value.totalEmployees,
        secondaryLabel: 'Female count',
        secondaryValue: employeesStats.value.femaleCount,
    },
    {
        tab: 'Scholarship',
        title: 'Scholarship',
        primaryLabel: 'On-going scholars',
        primaryValue: scholarsStats.value.totalScholars,
        secondaryLabel: 'Female count',
        secondaryValue: scholarsStats.value.femaleCount,
    },
    {
        tab: 'RSTL',
        title: 'RSTL',
        primaryLabel: 'Total customers',
        primaryValue: rstlStats.value.totalCustomers,
        secondaryLabel: 'Female count',
        secondaryValue: rstlStats.value.femaleCount,
    },
    {
        tab: 'SETUP',
        title: 'SETUP',
        primaryLabel: 'Projects',
        primaryValue: setupStats.value.totalProjects,
        secondaryLabel: 'Funding',
        secondaryValue: formatCurrency(setupStats.value.totalAmount),
    },
    {
        tab: 'CEST',
        title: 'CEST',
        primaryLabel: 'Projects',
        primaryValue: cestStats.value.totalProjects,
        secondaryLabel: 'Funding',
        secondaryValue: formatCurrency(cestStats.value.totalAmount),
    },
]);

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
            if (typeof window !== 'undefined') {
                const storedTab = localStorage.getItem(tabStorageKey);
                if (storedTab !== null && isValidTab(storedTab)) {
                    activeTab.value = storedTab;
                } else {
                    activeTab.value = 'Overview';
                }
            }

            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
            isChartLoading.value = true;
            if (openLoadingTimeout) {
                clearTimeout(openLoadingTimeout);
            }
            // Shorter loading time for snappier feel
            openLoadingTimeout = setTimeout(() => {
                isChartLoading.value = false;
            }, 150);
        } else {
            if (openLoadingTimeout) {
                clearTimeout(openLoadingTimeout);
                openLoadingTimeout = null;
            }
            if (tabLoadingTimeout) {
                clearTimeout(tabLoadingTimeout);
                tabLoadingTimeout = null;
            }
            isChartLoading.value = false;
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        }
    },
);

// Watch tab changes - minimal delay for smooth transition
watch(activeTab, () => {
    isChartLoading.value = true;
    if (tabLoadingTimeout) {
        clearTimeout(tabLoadingTimeout);
    }
    // Reduced delay for faster tab switching
    tabLoadingTimeout = setTimeout(() => {
        isChartLoading.value = false;
    }, 100);
});

onUnmounted(() => {
    if (openLoadingTimeout) {
        clearTimeout(openLoadingTimeout);
        openLoadingTimeout = null;
    }

    if (tabLoadingTimeout) {
        clearTimeout(tabLoadingTimeout);
        tabLoadingTimeout = null;
    }

    document.removeEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = '';
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
                    <div class="flex items-center justify-between bg-linear-to-r from-blue-900 to-blue-800 px-4 py-3 md:px-6 md:py-4">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 :id="`modal-title-${year.id}`" class="text-base font-semibold tracking-tight text-white md:text-lg lg:text-2xl">
                                    {{ year.year }} Sex Disaggregated Data Report
                                </h2>
                                <p class="text-xs font-medium text-blue-200 md:text-sm">Department of Science and Technology Regional Office No. IX</p>
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
                    <div v-if="!isYearDataPending" class="border-b border-gray-200 bg-gray-50/80 px-4 py-2 md:px-6 md:py-3">
                        <div class="md:hidden">
                            <label class="sr-only" for="year-modal-tab-select">Select data section</label>
                            <select
                                id="year-modal-tab-select"
                                :value="activeTab"
                                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                                @change="handleMobileTabChange"
                            >
                                <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
                            </select>
                        </div>
                        <div class="hidden gap-1 overflow-x-auto pb-1 scrollbar-hide md:flex md:gap-2">
                            <button
                                v-for="tab in tabs"
                                :key="tab"
                                @click="selectTab(tab)"
                                @keydown="handleTabKeydown"
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
                    <div
                        :class="[
                            'overflow-y-auto bg-gray-100 p-3 md:max-h-[calc(95vh-140px)] md:p-5 lg:p-6',
                            isYearDataPending ? 'h-[calc(100%-88px)]' : 'h-[calc(100%-140px)]',
                        ]"
                    >
                        <!-- Pending year: no charts yet -->
                        <div
                            v-if="isYearDataPending"
                            class="flex min-h-[min(50vh,20rem)] flex-col items-center justify-center gap-4 rounded-xl bg-white px-6 py-12 text-center shadow-sm"
                        >
                            <div
                                class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800"
                                aria-hidden="true"
                            >
                                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div class="max-w-md space-y-2">
                                <p class="text-base font-semibold text-gray-900 md:text-lg">Data not yet available</p>
                                <p class="text-sm leading-relaxed text-gray-600 md:text-base">
                                    {{ year.year }} figures are not available yet. This page will be updated as soon as
                                    validated annual data is ready.
                                </p>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <div v-else-if="isChartLoading" class="flex h-64 items-center justify-center">
                            <div class="flex flex-col items-center gap-3">
                                <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-900"></div>
                                <p class="text-sm text-gray-500">Loading charts...</p>
                            </div>
                        </div>

                        <!-- GFPS Tab -->
                        <div v-else-if="activeTab === 'Overview'" class="space-y-4 md:space-y-5">
                            <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4">
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs font-medium text-gray-500 md:text-sm">Total Female (all sections)</p>
                                    <p class="text-lg font-semibold text-blue-900 md:text-2xl">{{ formatCompactNumber(totalFemaleAcrossPrograms) }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs font-medium text-gray-500 md:text-sm">Total Male (all sections)</p>
                                    <p class="text-lg font-semibold text-blue-900 md:text-2xl">{{ formatCompactNumber(totalMaleAcrossPrograms) }}</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs font-medium text-gray-500 md:text-sm">Combined Projects</p>
                                    <p class="text-lg font-semibold text-blue-900 md:text-2xl">{{ combinedProjectsCount }}</p>
                                    <p class="text-xs text-gray-400">SETUP + CEST</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs font-medium text-gray-500 md:text-sm">Combined Funding</p>
                                    <p class="text-sm font-semibold text-green-700 md:text-lg">{{ formatCurrency(combinedFundingAmount) }}</p>
                                    <p class="text-xs text-gray-400">SETUP + CEST</p>
                                </div>
                            </div>

                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-4 border-b border-gray-100 pb-3">
                                    <h3 class="text-base font-semibold tracking-tight text-gray-900 md:text-lg">Quick Access</h3>
                                    <p class="text-sm text-gray-500">Open any section directly with one click.</p>
                                </div>
                                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    <button
                                        v-for="program in overviewPrograms"
                                        :key="program.tab"
                                        type="button"
                                        class="rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors duration-150 hover:border-blue-300 hover:bg-blue-50/40"
                                        @click="selectTab(program.tab)"
                                    >
                                        <p class="text-xs font-medium uppercase tracking-wide text-blue-700">{{ program.title }}</p>
                                        <p class="mt-2 text-sm text-gray-500">{{ program.primaryLabel }}</p>
                                        <p class="text-xl font-semibold tracking-tight text-gray-900">{{ program.primaryValue }}</p>
                                        <p class="mt-2 text-sm text-gray-500">{{ program.secondaryLabel }}</p>
                                        <p class="text-sm font-semibold text-gray-800">{{ program.secondaryValue }}</p>
                                    </button>
                                </div>
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
                                    <p class="text-lg font-bold text-green-600 md:text-xl lg:text-2xl">{{ assemblyData.length }}</p>
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
                                    <GenderPieChart :female-count="gfpsStats.femaleCount" :male-count="gfpsStats.maleCount" />
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
                                    <p class="text-lg font-bold text-green-600 md:text-xl lg:text-2xl">{{ employeesData.length }}</p>
                                    <p class="text-xs text-gray-400">Categories</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Employees by Employment Status</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">Sex-disaggregated data as of December 31, {{ year.year }}</p>
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
                                    <p class="text-xs text-gray-400">{{ scholarsStats.femalePercentage }}%</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">Male Scholars</p>
                                    <p class="text-lg font-bold text-blue-500 md:text-xl lg:text-2xl">{{ scholarsStats.maleCount }}</p>
                                    <p class="text-xs text-gray-400">{{ scholarsStats.malePercentage }}%</p>
                                </div>
                                <div class="rounded-xl bg-white p-3 shadow-sm md:p-4">
                                    <p class="text-xs text-gray-500 md:text-sm">School Year</p>
                                    <p class="text-lg font-bold text-purple-600 md:text-xl lg:text-2xl">{{ scholarsStats.schoolYearLabel || 'Not set' }}</p>
                                    <p class="text-xs text-gray-400">{{ scholarsStats.asOfDate ?? 'No date set' }}</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Distribution of On-Going Scholars by Sex</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">
                                        {{ scholarsStats.schoolYearLabel || `School Year ${year.year}` }}
                                        <span v-if="scholarsStats.asOfDate"> • Data as of {{ scholarsStats.asOfDate }}</span>
                                    </p>
                                </div>
                                <div class="mx-auto w-full max-w-md lg:max-w-lg">
                                    <ScholarsPieChart :female-count="scholarsStats.femaleCount" :male-count="scholarsStats.maleCount" />
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
                                    <p class="text-lg font-bold text-green-600 md:text-xl lg:text-2xl">{{ year.year }}</p>
                                    <p class="text-xs text-gray-400">Full Year</p>
                                </div>
                            </div>

                            <!-- Chart -->
                            <div class="rounded-xl bg-white p-3 shadow-sm md:p-4 lg:p-6">
                                <div class="mb-3 border-b border-gray-100 pb-2 md:mb-4 md:pb-3">
                                    <h3 class="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Testing and Calibration Services</h3>
                                    <p class="text-xs text-gray-500 md:text-sm">Number of customers by sex (warm bodies) - Monthly breakdown for {{ year.year }}</p>
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
                                    <p class="text-xs text-gray-500 md:text-sm">Number and amount of projects funded by sex • {{ year.year }}</p>
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
                                    <p class="text-xs text-gray-500 md:text-sm">Number and amount of projects funded by sex • {{ year.year }}</p>
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
