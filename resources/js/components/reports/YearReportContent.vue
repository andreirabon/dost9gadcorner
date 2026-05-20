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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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
    <article class="report-view-shell" :aria-labelledby="`report-title-${year.id}`">
        <header class="report-view-hero px-page-gutter">
            <div class="report-view-heading">
                <p class="report-view-kicker">Annual report</p>
                <div class="space-y-2">
                    <h1
                            :id="`report-title-${year.id}`"
                            data-focus-anchor="true"
                            tabindex="-1"
                            class="report-view-title"
                        >
                            <span class="report-view-title-accent">{{ year.year }}</span>
                            Sex Disaggregated Data
                        </h1>
                        <p class="report-view-subtitle">
                            Department of Science and Technology Regional Office No. IX — validated figures across GFPS,
                            employment, scholarship, RSTL, SETUP, and CEST programs.
                    </p>
                </div>
            </div>
            <div class="report-view-actions">
                    <button
                        v-if="reportTheme"
                        type="button"
                        class="report-view-btn-icon"
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
                            class="size-5 shrink-0 text-fuchsia-300/90"
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
                        class="report-view-btn"
                    >
                        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span class="hidden sm:inline">Back to yearly reports</span>
                        <span class="sm:hidden">Back</span>
                    </Link>
            </div>
        </header>

        <nav v-if="!isYearDataPending" class="report-view-nav px-page-gutter" aria-label="Report sections">
                <div class="md:hidden">
                    <label class="sr-only" for="year-report-tab-select">Select data section</label>
                    <select
                        id="year-report-tab-select"
                        :value="activeTab"
                        class="report-view-select"
                        @change="handleMobileTabChange"
                    >
                        <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
                    </select>
                </div>
                <div class="report-view-tabs" role="tablist">
                    <button
                        v-for="tab in tabs"
                        :key="tab"
                        @click="selectTab(tab)"
                        @keydown="handleTabKeydown"
                        :class="['report-view-tab', { 'is-active': activeTab === tab }]"
                        role="tab"
                        :aria-selected="activeTab === tab"
                        type="button"
                    >
                        {{ tab }}
                    </button>
                </div>
        </nav>

        <div class="report-view-body px-page-gutter">
                <div
                    v-if="isYearDataPending"
                    class="report-view-empty"
                >
                    <div class="report-view-empty-icon" aria-hidden="true">
                        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div class="max-w-md space-y-4">
                        <p class="report-view-empty-title">Data not yet available</p>
                        <p class="report-view-empty-desc">
                            {{ year.year }} figures are not available yet. This page will be updated as soon as
                            validated annual data is ready.
                        </p>
                    </div>
                </div>

                <div v-else-if="isChartLoading" class="report-view-loading">
                    <div class="flex flex-col items-center gap-4">
                        <div class="report-view-spinner" aria-hidden="true" />
                        <p class="report-view-loading-label">Loading charts...</p>
                    </div>
                </div>

                <div v-else-if="activeTab === 'Overview'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs font-medium text-purple-200/80 font-light report-light:text-slate-600">Total Female (all sections)</p>
                            <p class="text-lg font-semibold text-red-300 report-light:text-red-700 md:text-xl">{{ formatCompactNumber(totalFemaleAcrossPrograms) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs font-medium text-purple-200/80 font-light report-light:text-slate-600">Total Male (all sections)</p>
                            <p class="text-lg font-semibold text-blue-300 report-light:text-blue-700 md:text-xl">{{ formatCompactNumber(totalMaleAcrossPrograms) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs font-medium text-purple-200/80 font-light report-light:text-slate-600">Combined Projects</p>
                            <p class="text-lg font-semibold text-purple-50 report-light:text-slate-900 md:text-xl">{{ combinedProjectsCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">SETUP + CEST</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs font-medium text-purple-200/80 font-light report-light:text-slate-600">Combined Funding</p>
                            <p class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">{{ formatCurrency(combinedFundingAmount) }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">SETUP + CEST</p>
                        </div>
                    </div>

                    <div class="report-view-metric">
                        <div class="mb-3 border-b border-white/10 pb-3 report-light:border-slate-200">
                            <h3 class="text-xs font-semibold tracking-tight text-purple-50 report-light:text-slate-900 md:text-sm">Quick Access</h3>
                        </div>
                        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <button
                                v-for="program in overviewPrograms"
                                :key="program.tab"
                                type="button"
                                class="cursor-pointer rounded-xl border border-purple-400/35 bg-purple-900/55 ring-1 ring-white/10 p-4 text-left shadow-sm transition-colors duration-200 hover:border-purple-400/50 hover:bg-purple-900/65 report-light:border-slate-300 report-light:bg-slate-50 report-light:hover:border-slate-400 report-light:hover:bg-slate-100 md:p-5"
                                @click="selectTab(program.tab)"
                            >
                                <p class="text-xs font-medium uppercase tracking-wide text-purple-50 report-light:text-slate-900">{{ program.title }}</p>
                                <p class="mt-1 text-xs text-purple-200/80 font-light report-light:text-slate-600">{{ program.primaryLabel }}</p>
                                <p class="text-lg font-semibold tracking-tight text-purple-50 report-light:text-slate-900">{{ program.primaryValue }}</p>
                                <p class="mt-1 text-xs text-purple-200/80 font-light report-light:text-slate-600">{{ program.secondaryLabel }}</p>
                                <p class="text-sm font-semibold text-purple-50 report-light:text-slate-900">{{ program.secondaryValue }}</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'GFPS'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Members</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ gfpsStats.totalMembers }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Female Members</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ gfpsStats.femaleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ gfpsStats.femalePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Male Members</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ gfpsStats.maleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ gfpsStats.malePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">GFPS Assemblies</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ assemblyData.length }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">Quarterly</p>
                        </div>
                    </div>

                    <div class="report-view-charts">
                        <div class="report-view-block">
                            <div class="report-view-chart-head">
                                <h3 class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">GFPS Membership by Sex</h3>
                                <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Distribution of GFPS members</p>
                            </div>
                            <div class="report-chart-panel">
                                <GenderPieChart :female-count="gfpsStats.femaleCount" :male-count="gfpsStats.maleCount" />
                            </div>
                        </div>

                        <div class="report-view-block">
                            <div class="report-view-chart-head">
                                <h3 class="report-view-block-title">GFPS Assembly Participation</h3>
                                <p class="report-view-block-desc">Quarterly assembly attendance by sex</p>
                            </div>
                            <div class="report-chart-panel">
                                <AssemblyStackedBarChart :data="assemblyData" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'DOST IX Employees'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Employees</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ employeesStats.totalEmployees }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Female Employees</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ employeesStats.femaleCount }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Male Employees</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ employeesStats.maleCount }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Employment Types</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ employeesData.length }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">Categories</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">Employees by Employment Status</h3>
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Sex-disaggregated data as of December 31, {{ year.year }}</p>
                        </div>
                        <div class="report-chart-panel">
                            <EmployeesGroupedBarChart :data="employeesData" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'Scholarship'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Scholars</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ scholarsStats.totalScholars }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Female Scholars</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ scholarsStats.femaleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ scholarsStats.femalePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Male Scholars</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ scholarsStats.maleCount }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ scholarsStats.malePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">School Year</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ scholarsStats.schoolYearLabel || 'Not set' }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">{{ scholarsStats.asOfDate ?? 'No date set' }}</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">Distribution of On-Going Scholars by Sex</h3>
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">
                                {{ scholarsStats.schoolYearLabel || `School Year ${year.year}` }}
                                <span v-if="scholarsStats.asOfDate"> • Data as of {{ scholarsStats.asOfDate }}</span>
                            </p>
                        </div>
                        <div class="report-chart-panel">
                            <ScholarsPieChart :female-count="scholarsStats.femaleCount" :male-count="scholarsStats.maleCount" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'RSTL'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Customers</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ rstlStats.totalCustomers }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Female</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ rstlStats.femaleCount }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Male</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ rstlStats.maleCount }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Period</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ year.year }}</p>
                            <p class="text-xs text-slate-500 report-light:text-slate-600">Full Year</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">Testing and Calibration Services</h3>
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Customers by sex (warm bodies) - Monthly breakdown for {{ year.year }}</p>
                        </div>
                        <div class="report-chart-panel">
                            <RstlWarmBodiesStackedChart :data="rstlWarmBodiesData" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'SETUP'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Projects</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ setupStats.totalProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Funding</p>
                            <p class="text-sm font-bold text-purple-50 report-light:text-slate-900 md:text-base">{{ formatCurrency(setupStats.totalAmount) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Male-led Projects</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ setupStats.maleProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Female-led Projects</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ setupStats.femaleProjects }}</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">Small Enterprise Technology Upgrading Program (SETUP)</h3>
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Projects funded by sex • {{ year.year }}</p>
                        </div>
                        <div class="report-chart-panel">
                            <SetupFundingChart :data="setupFundingData" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'CEST'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Projects</p>
                            <p class="text-lg font-bold text-purple-50 report-light:text-slate-900 md:text-xl">{{ cestStats.totalProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Total Funding</p>
                            <p class="text-sm font-bold text-purple-50 report-light:text-slate-900 md:text-base">{{ formatCurrency(cestStats.totalAmount) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Male-led Projects</p>
                            <p class="text-lg font-bold text-blue-300 report-light:text-blue-700 md:text-xl">{{ cestStats.maleProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Female-led Projects</p>
                            <p class="text-lg font-bold text-red-300 report-light:text-red-700 md:text-xl">{{ cestStats.femaleProjects }}</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="text-sm font-semibold text-purple-50 report-light:text-slate-900 md:text-base">Community Empowerment thru Science and Technology (CEST)</h3>
                            <p class="text-xs text-purple-200/80 font-light report-light:text-slate-600">Projects funded by sex • {{ year.year }}</p>
                        </div>
                        <div class="report-chart-panel">
                            <CestFundingChart :data="cestFundingData" />
                        </div>
                    </div>
                </div>
            </div>
    </article>
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
