<script setup lang="ts">
import { REPORT_PAGE_THEME_KEY } from '@/composables/useReportPageTheme';
import type { YearItem } from '@/types';
import type { FundingSummaryData, GfpsAssemblyDataRow, ReportYearData, RstlMonthlyDataRow } from '@/types/reports';
import { Link } from '@inertiajs/vue3';
import { computed, defineAsyncComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';

const AssemblyStackedBarChart = defineAsyncComponent(() => import('@/components/charts/AssemblyStackedBarChart.vue'));
const CestFundingChart = defineAsyncComponent(() => import('@/components/charts/CestFundingChart.vue'));
const EmployeesGroupedBarChart = defineAsyncComponent(() => import('@/components/charts/EmployeesGroupedBarChart.vue'));
const GenderPieChart = defineAsyncComponent(() => import('@/components/charts/GenderPieChart.vue'));
const RstlWarmBodiesStackedChart = defineAsyncComponent(() => import('@/components/charts/RstlWarmBodiesStackedChart.vue'));
const ScholarsPieChart = defineAsyncComponent(() => import('@/components/charts/ScholarsPieChart.vue'));
const SetupFundingChart = defineAsyncComponent(() => import('@/components/charts/SetupFundingChart.vue'));

const props = defineProps<{
    year: YearItem;
}>();

const emptyFundingData: FundingSummaryData = {
    maleProjects: 0,
    maleAmount: 0,
    femaleProjects: 0,
    femaleAmount: 0,
};

const reportData = computed<ReportYearData | null>(() => props.year.reportData ?? null);

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

const isYearDataPending = computed(() => props.year.status !== 'published' || reportData.value === null);

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
const tabStorageKey = 'year-report-last-tab';

const reportTheme = inject(REPORT_PAGE_THEME_KEY, null);

const isReportLight = computed(() => reportTheme?.value === 'light');

function toggleReportTheme(): void {
    if (reportTheme) {
        reportTheme.value = reportTheme.value === 'dark' ? 'light' : 'dark';
    }
}

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

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

onMounted(() => {
    if (typeof window !== 'undefined') {
        const storedTab = localStorage.getItem(tabStorageKey);
        if (storedTab !== null && isValidTab(storedTab)) {
            activeTab.value = storedTab;
        } else {
            activeTab.value = 'Overview';
        }
    }

    isChartLoading.value = true;
    openLoadingTimeout = setTimeout(() => {
        isChartLoading.value = false;
        openLoadingTimeout = null;
    }, 150);
});

watch(activeTab, () => {
    isChartLoading.value = true;
    if (tabLoadingTimeout) {
        clearTimeout(tabLoadingTimeout);
    }
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
});
</script>

<template>
    <div class="relative isolate bg-slate-950 report-light:bg-slate-50">
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,rgba(45,212,191,0.06),transparent_50%)] report-light:opacity-70"
        />
        <article
            class="relative border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm report-light:border-slate-200 report-light:bg-white/90"
            :aria-labelledby="`report-title-${year.id}`"
        >
            <div
                class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-3 md:gap-4 md:px-6 md:py-4 report-light:border-slate-200 report-light:bg-slate-50/90"
            >
                <div class="flex min-w-0 items-center gap-3">
                    <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 report-light:bg-slate-200/80"
                    >
                        <svg class="h-5 w-5 text-slate-300 report-light:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <h2
                            :id="`report-title-${year.id}`"
                            class="text-sm font-semibold tracking-tight text-white report-light:text-slate-900 md:text-base lg:text-lg"
                        >
                            {{ year.year }} Sex Disaggregated Data Report
                        </h2>
                        <p class="text-xs font-medium text-slate-400 report-light:text-slate-600 md:text-sm">
                            Department of Science and Technology Regional Office No. IX
                        </p>
                    </div>
                </div>
                <div class="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
                    <button
                        v-if="reportTheme"
                        type="button"
                        class="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border text-slate-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 report-light:border-slate-300 report-light:bg-white report-light:text-slate-800 report-light:hover:bg-slate-50 report-light:focus-visible:ring-offset-slate-50"
                        :class="
                            isReportLight
                                ? 'border-slate-300 bg-white shadow-sm hover:bg-slate-50'
                                : 'border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10'
                        "
                        :aria-pressed="isReportLight"
                        :aria-label="isReportLight ? 'Switch report to dark theme' : 'Switch report to light theme'"
                        @click="toggleReportTheme"
                    >
                        <svg
                            v-if="isReportLight"
                            class="size-5 shrink-0 text-amber-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <svg
                            v-else
                            class="size-5 shrink-0 text-slate-300"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                            />
                        </svg>
                    </button>
                    <Link
                        :href="`${route('index')}#yearly`"
                        prefetch
                        class="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-200 transition-colors duration-200 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 report-light:border-slate-300 report-light:bg-white report-light:text-slate-800 report-light:hover:border-slate-400 report-light:hover:bg-slate-50 report-light:focus-visible:ring-offset-slate-50 md:text-sm"
                    >
                        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span class="hidden sm:inline">Back to yearly reports</span>
                        <span class="sm:hidden">Back</span>
                    </Link>
                </div>
            </div>

            <div
                v-if="!isYearDataPending"
                class="border-b border-white/10 bg-slate-950/90 px-3 py-2.5 md:px-5 md:py-3 report-light:border-slate-200 report-light:bg-slate-100/90"
            >
                <div class="md:hidden">
                    <label class="sr-only" for="year-report-tab-select">Select data section</label>
                    <select
                        id="year-report-tab-select"
                        :value="activeTab"
                        class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-100 shadow-sm focus:border-white/40 focus:outline-hidden focus:ring-2 focus:ring-teal-500/40 report-light:border-slate-300 report-light:bg-white report-light:text-slate-800 report-light:focus:border-slate-400"
                        @change="handleMobileTabChange"
                    >
                        <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
                    </select>
                </div>
                <div class="hidden gap-1.5 overflow-x-auto scrollbar-hide md:flex md:gap-2.5">
                    <button
                        v-for="tab in tabs"
                        :key="tab"
                        @click="selectTab(tab)"
                        @keydown="handleTabKeydown"
                        :class="[
                            'cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 report-light:focus-visible:ring-offset-slate-50 md:px-5 md:py-2.5 md:text-sm touch-manipulation',
                            activeTab === tab
                                ? 'bg-white text-slate-950 shadow-sm'
                                : 'border border-white/15 bg-white/5 text-slate-400 hover:border-white/25 hover:bg-white/10 hover:text-white report-light:border-slate-300 report-light:bg-slate-100 report-light:text-slate-600 report-light:hover:border-slate-400 report-light:hover:bg-slate-200/80 report-light:hover:text-slate-900',
                        ]"
                    >
                        {{ tab }}
                    </button>
                </div>
            </div>

            <div class="bg-slate-950 px-3 py-3 md:px-5 md:py-5 report-light:bg-slate-50">
                <div
                    v-if="isYearDataPending"
                    class="flex min-h-[min(32vh,13rem)] flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-10 text-center shadow-sm report-light:border-slate-200 report-light:bg-white/90"
                >
                    <div
                        class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-400 report-light:bg-slate-200/80 report-light:text-slate-500"
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
                    <div class="max-w-md space-y-4">
                        <p class="text-base font-semibold text-white report-light:text-slate-900 md:text-lg">Data not yet available</p>
                        <p class="text-sm leading-relaxed text-slate-400 report-light:text-slate-600 md:text-base">
                            {{ year.year }} figures are not available yet. This page will be updated as soon as
                            validated annual data is ready.
                        </p>
                    </div>
                </div>

                <div v-else-if="isChartLoading" class="flex h-48 items-center justify-center">
                    <div class="flex flex-col items-center gap-4">
                        <div
                            class="h-9 w-9 animate-spin rounded-full border-[3px] border-white/20 border-t-white report-light:border-slate-300 report-light:border-t-slate-700"
                        ></div>
                        <p class="text-sm text-slate-400 report-light:text-slate-600">Loading charts...</p>
                    </div>
                </div>

                <div v-else-if="activeTab === 'Overview'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs font-medium text-slate-400 report-light:text-slate-600">Total Female (all sections)</p>
                            <p class="text-lg font-semibold text-red-300 report-light:text-red-700 md:text-xl">{{ formatCompactNumber(totalFemaleAcrossPrograms) }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs font-medium text-slate-400 report-light:text-slate-600">Total Male (all sections)</p>
                            <p class="text-lg font-semibold text-blue-300 report-light:text-blue-700 md:text-xl">{{ formatCompactNumber(totalMaleAcrossPrograms) }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs font-medium text-slate-400 report-light:text-slate-600">Combined Projects</p>
                            <p class="text-lg font-semibold text-white report-light:text-slate-900 md:text-xl">{{ combinedProjectsCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">SETUP + CEST</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs font-medium text-slate-400 report-light:text-slate-600">Combined Funding</p>
                            <p class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">{{ formatCurrency(combinedFundingAmount) }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">SETUP + CEST</p>
                        </div>
                    </div>

                    <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-xs font-semibold tracking-tight text-white report-light:text-slate-900 md:text-sm">Quick Access</h3>
                        </div>
                        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <button
                                v-for="program in overviewPrograms"
                                :key="program.tab"
                                type="button"
                                class="cursor-pointer rounded-xl border border-white/15 bg-white/5 p-4 text-left shadow-sm transition-colors duration-200 hover:border-white/25 hover:bg-white/10 report-light:border-slate-300 report-light:bg-slate-50 report-light:hover:border-slate-400 report-light:hover:bg-slate-100 md:p-5"
                                @click="selectTab(program.tab)"
                            >
                                <p class="text-xs font-medium uppercase tracking-wide text-white report-light:text-slate-900">{{ program.title }}</p>
                                <p class="mt-1 text-xs text-slate-400 report-light:text-slate-600">{{ program.primaryLabel }}</p>
                                <p class="text-lg font-semibold tracking-tight text-white report-light:text-slate-900">{{ program.primaryValue }}</p>
                                <p class="mt-1 text-xs text-slate-400 report-light:text-slate-600">{{ program.secondaryLabel }}</p>
                                <p class="text-sm font-semibold text-white report-light:text-slate-900">{{ program.secondaryValue }}</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'GFPS'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Members</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ gfpsStats.totalMembers }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Female Members</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ gfpsStats.femaleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ gfpsStats.femalePercentage }}%</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Male Members</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ gfpsStats.maleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ gfpsStats.malePercentage }}%</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">GFPS Assemblies</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ assemblyData.length }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">Quarterly</p>
                        </div>
                    </div>

                    <div class="grid gap-4 md:grid-cols-2 md:gap-6">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                                <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">GFPS Membership by Sex</h3>
                                <p class="text-xs text-slate-400 report-light:text-slate-600">Distribution of GFPS members</p>
                            </div>
                            <GenderPieChart :female-count="gfpsStats.femaleCount" :male-count="gfpsStats.maleCount" />
                        </div>

                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                                <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">GFPS Assembly Participation</h3>
                                <p class="text-xs text-slate-400 report-light:text-slate-600">Quarterly assembly attendance by sex</p>
                            </div>
                            <AssemblyStackedBarChart :data="assemblyData" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'DOST IX Employees'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Employees</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ employeesStats.totalEmployees }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Female Employees</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ employeesStats.femaleCount }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Male Employees</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ employeesStats.maleCount }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Employment Types</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ employeesData.length }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">Categories</p>
                        </div>
                    </div>

                    <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">Employees by Employment Status</h3>
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Sex-disaggregated data as of December 31, {{ year.year }}</p>
                        </div>
                        <EmployeesGroupedBarChart :data="employeesData" />
                    </div>
                </div>

                <div v-else-if="activeTab === 'Scholarship'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Scholars</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ scholarsStats.totalScholars }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Female Scholars</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ scholarsStats.femaleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ scholarsStats.femalePercentage }}%</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Male Scholars</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ scholarsStats.maleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ scholarsStats.malePercentage }}%</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">School Year</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ scholarsStats.schoolYearLabel || 'Not set' }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ scholarsStats.asOfDate ?? 'No date set' }}</p>
                        </div>
                    </div>

                    <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">Distribution of On-Going Scholars by Sex</h3>
                            <p class="text-xs text-slate-400 report-light:text-slate-600">
                                {{ scholarsStats.schoolYearLabel || `School Year ${year.year}` }}
                                <span v-if="scholarsStats.asOfDate"> • Data as of {{ scholarsStats.asOfDate }}</span>
                            </p>
                        </div>
                        <div class="mx-auto w-full max-w-md lg:max-w-lg">
                            <ScholarsPieChart :female-count="scholarsStats.femaleCount" :male-count="scholarsStats.maleCount" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'RSTL'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Customers</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ rstlStats.totalCustomers }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Female</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ rstlStats.femaleCount }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Male</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ rstlStats.maleCount }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Period</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ year.year }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">Full Year</p>
                        </div>
                    </div>

                    <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">Testing and Calibration Services</h3>
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Customers by sex (warm bodies) - Monthly breakdown for {{ year.year }}</p>
                        </div>
                        <RstlWarmBodiesStackedChart :data="rstlWarmBodiesData" />
                    </div>
                </div>

                <div v-else-if="activeTab === 'SETUP'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Projects</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ setupStats.totalProjects }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Funding</p>
                            <p class="text-sm font-bold text-white report-light:text-slate-900 md:text-base">{{ formatCurrency(setupStats.totalAmount) }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Male-led Projects</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ setupStats.maleProjects }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Female-led Projects</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ setupStats.femaleProjects }}</p>
                        </div>
                    </div>

                    <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">Small Enterprise Technology Upgrading Program (SETUP)</h3>
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Projects funded by sex • {{ year.year }}</p>
                        </div>
                        <SetupFundingChart :data="setupFundingData" />
                    </div>
                </div>

                <div v-else-if="activeTab === 'CEST'" class="space-y-4 md:space-y-6">
                    <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Projects</p>
                            <p class="text-lg font-bold text-white report-light:text-slate-900 md:text-xl">{{ cestStats.totalProjects }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Total Funding</p>
                            <p class="text-sm font-bold text-white report-light:text-slate-900 md:text-base">{{ formatCurrency(cestStats.totalAmount) }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Male-led Projects</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ cestStats.maleProjects }}</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Female-led Projects</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ cestStats.femaleProjects }}</p>
                        </div>
                    </div>

                    <div class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm md:p-5 report-light:border-slate-200 report-light:bg-white/90">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-sm font-semibold text-white report-light:text-slate-900 md:text-base">Community Empowerment thru Science and Technology (CEST)</h3>
                            <p class="text-xs text-slate-400 report-light:text-slate-600">Projects funded by sex • {{ year.year }}</p>
                        </div>
                        <CestFundingChart :data="cestFundingData" />
                    </div>
                </div>
            </div>
        </article>
    </div>
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
