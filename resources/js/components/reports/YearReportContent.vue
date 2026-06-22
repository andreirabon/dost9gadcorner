<script setup lang="ts">
import ReportBackArrowIcon from '@/components/reports/ReportBackArrowIcon.vue';
import { Link } from '@inertiajs/vue3';
import type { YearItem } from '@/types';
import type { FundingCategorySummaryData, FundingSummaryData, GfpsAssemblyDataRow, ReportYearData, RstlMonthlyDataRow, ScholarshipSummaryData } from '@/types/reports';
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';

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
const setupFundingBreakdown = computed<FundingCategorySummaryData[]>(() => reportData.value?.setupFundingBreakdown ?? []);
const cestFundingBreakdown = computed<FundingCategorySummaryData[]>(() => reportData.value?.cestFundingBreakdown ?? []);

const sumFundingRows = (rows: FundingCategorySummaryData[]): FundingSummaryData =>
    rows.reduce<FundingSummaryData>(
        (carry, row) => ({
            maleProjects: carry.maleProjects + row.maleProjects,
            maleAmount: carry.maleAmount + row.maleAmount,
            femaleProjects: carry.femaleProjects + row.femaleProjects,
            femaleAmount: carry.femaleAmount + row.femaleAmount,
        }),
        { ...emptyFundingData },
    );

const setupFundingRows = computed<FundingCategorySummaryData[]>(() => {
    let rows = setupFundingBreakdown.value;

    if (rows.length === 0 && (setupFundingData.value.maleProjects > 0 || setupFundingData.value.femaleProjects > 0)) {
        rows = [
            {
                label: 'SETUP',
                slug: 'setup',
                ...setupFundingData.value,
            },
        ];
    }

    return rows;
});



const cestFundingRows = computed<FundingCategorySummaryData[]>(() => {
    let rows = cestFundingBreakdown.value;

    if (rows.length === 0 && (cestFundingData.value.maleProjects > 0 || cestFundingData.value.femaleProjects > 0)) {
        rows = [
            {
                label: 'CEST',
                slug: 'cest',
                ...cestFundingData.value,
            },
        ];
    }

    return rows;
});

const selectedSetupCategorySlug = ref<string | null>(null);
const selectedCestCategorySlug = ref<string | null>(null);

const syncSelectedFundingCategory = (
    rows: FundingCategorySummaryData[],
    selectedSlug: { value: string | null },
): void => {
    if (rows.length === 0) {
        selectedSlug.value = null;
        return;
    }

    if (selectedSlug.value === null || !rows.some((row) => row.slug === selectedSlug.value)) {
        selectedSlug.value = rows[0].slug;
    }
};

watch(
    setupFundingRows,
    (rows) => {
        syncSelectedFundingCategory(rows, selectedSetupCategorySlug);
    },
    { immediate: true },
);

watch(
    cestFundingRows,
    (rows) => {
        syncSelectedFundingCategory(rows, selectedCestCategorySlug);
    },
    { immediate: true },
);

const selectedSetupCategory = computed<FundingCategorySummaryData | null>(
    () => setupFundingRows.value.find((row) => row.slug === selectedSetupCategorySlug.value) ?? null,
);

const selectedCestCategory = computed<FundingCategorySummaryData | null>(
    () => cestFundingRows.value.find((row) => row.slug === selectedCestCategorySlug.value) ?? null,
);

const selectSetupCategory = (slug: string): void => {
    selectedSetupCategorySlug.value = slug;
};

const selectCestCategory = (slug: string): void => {
    selectedCestCategorySlug.value = slug;
};

const fundingCategoryButtonClass = (isActive: boolean): string[] => [
    'inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide transition-[transform,background-color,border-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 active:scale-[0.97]',
    isActive
        ? 'border-purple-500 bg-purple-600 text-white shadow-sm'
        : 'border-purple-400/35 bg-purple-900/55 text-purple-100 hover:border-purple-400/55 hover:bg-purple-900/75 report-light:border-slate-300 report-light:bg-slate-50 report-light:text-slate-700 report-light:hover:border-slate-400 report-light:hover:bg-slate-100',
];

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
    const totalEmployees = femaleCount + maleCount;

    return {
        totalEmployees,
        femaleCount,
        maleCount,
        femalePercentage: percentage(femaleCount, totalEmployees),
        malePercentage: percentage(maleCount, totalEmployees),
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

const scholarshipHistory = computed<ScholarshipSummaryData[]>(() => reportData.value?.scholarshipHistory ?? []);

const expandedHistoryIndices = ref<Record<number, boolean>>({ 0: true });

const toggleHistoryExpand = (idx: number) => {
    expandedHistoryIndices.value[idx] = !expandedHistoryIndices.value[idx];
};

const isHistoryExpanded = (idx: number): boolean => {
    return !!expandedHistoryIndices.value[idx];
};

const rstlStats = computed(() => {
    const totalFemale = rstlWarmBodiesData.value.reduce((sum, row) => sum + row.female + row.femaleLed, 0);
    const totalMale = rstlWarmBodiesData.value.reduce((sum, row) => sum + row.male + row.maleLed, 0);
    const totalCustomers = totalFemale + totalMale;

    return {
        totalCustomers,
        femaleCount: totalFemale,
        maleCount: totalMale,
        femalePercentage: percentage(totalFemale, totalCustomers),
        malePercentage: percentage(totalMale, totalCustomers),
    };
});

const setupStats = computed(() => {
    const totals = sumFundingRows(setupFundingRows.value);

    return {
        totalProjects: totals.maleProjects + totals.femaleProjects,
        totalAmount: totals.maleAmount + totals.femaleAmount,
        maleProjects: totals.maleProjects,
        femaleProjects: totals.femaleProjects,
    };
});

const cestStats = computed(() => {
    const totals = sumFundingRows(cestFundingRows.value);

    return {
        totalProjects: totals.maleProjects + totals.femaleProjects,
        totalAmount: totals.maleAmount + totals.femaleAmount,
        maleProjects: totals.maleProjects,
        femaleProjects: totals.femaleProjects,
    };
});

const totalFemaleAcrossPrograms = computed(
    () => gfpsStats.value.femaleCount + employeesStats.value.femaleCount + scholarsStats.value.femaleCount + rstlStats.value.femaleCount,
);


const totalMaleAcrossPrograms = computed(
    () => gfpsStats.value.maleCount + employeesStats.value.maleCount + scholarsStats.value.maleCount + rstlStats.value.maleCount,
);

const combinedFundingAmount = computed(() => setupStats.value.totalAmount + cestStats.value.totalAmount);
const combinedProjectsCount = computed(() => setupStats.value.totalProjects + cestStats.value.totalProjects);
const combinedFundingCategories = computed(() => setupFundingRows.value.length + cestFundingRows.value.length);

type TabType = 'Overview' | 'GFPS' | 'DOST IX Employees' | 'Scholarship' | 'RSTL' | 'Program Funding' | 'SETUP' | 'CEST';
const tabs: TabType[] = ['Overview', 'GFPS', 'DOST IX Employees', 'Scholarship', 'RSTL', 'Program Funding', 'SETUP', 'CEST'];
const activeTab = ref<TabType>('Overview');
const tabStorageKey = 'year-report-last-tab';

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
        tab: 'Program Funding',
        title: 'Program Funding',
        primaryLabel: 'Funding categories',
        primaryValue: combinedFundingCategories.value,
        secondaryLabel: 'Combined funding',
        secondaryValue: formatCurrency(combinedFundingAmount.value),
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
});
</script>

<template>
    <article class="report-view-shell" :aria-labelledby="`report-title-${year.id}`">
        <header class="animate-fade-in-up">
            <div class="report-view-hero-accent"></div>
            <div class="report-view-hero px-page-gutter">
                <div class="report-view-hero-top">
                    <div class="report-view-heading">
                        <div class="report-view-kicker-row">
                            <span class="report-view-year-badge">{{ year.year }}</span>
                            <p class="report-view-kicker">Annual report</p>
                        </div>
                        <div class="space-y-2">
                            <h1
                                :id="`report-title-${year.id}`"
                                data-focus-anchor="true"
                                tabindex="-1"
                                class="report-view-title"
                            >
                                Sex Disaggregated Data
                            </h1>
                            <p class="report-view-subtitle">
                                Department of Science and Technology Regional Office IX validated figures across GFPS,
                                employment, scholarship, RSTL, SETUP, and CEST programs.
                            </p>
                        </div>
                    </div>
                    <div class="report-view-actions">
                        <Link
                            :href="`${route('index')}#yearly`"
                            class="report-view-back-link"
                            prefetch
                        >
                            <ReportBackArrowIcon />
                            <span class="hidden sm:inline">Select Another Year</span>
                            <span class="sm:hidden">Back</span>
                        </Link>
                    </div>
                </div>
                <div class="report-view-hero-divider" aria-hidden="true"></div>
                <div v-if="!isYearDataPending" class="report-view-tabs-container">
                    <div class="report-view-tabs" role="tablist" aria-label="Report sections">
                        <button
                            v-for="(tab, idx) in tabs"
                            :key="tab"
                            @click="selectTab(tab)"
                            @keydown="handleTabKeydown"
                            :class="['report-view-tab', { 'is-active': activeTab === tab }]"
                            :style="{ '--tab-index': idx }"
                            role="tab"
                            :aria-selected="activeTab === tab"
                            type="button"
                        >
                            {{ tab }}
                        </button>
                    </div>
                </div>
            </div>
        </header>


        <div class="report-view-body px-page-gutter animate-fade-in-up delay-1">
            <div v-if="isYearDataPending" class="report-view-empty">
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
                        {{ year.year }} figures are not available yet. This page will be updated as soon as validated
                        annual data is ready.
                    </p>
                </div>
            </div>

            <div v-else>
                <Transition name="tab-fade" mode="out-in">
                    <div :key="activeTab" class="w-full">
                        <div v-if="activeTab === 'Overview'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Female (all sections)</p>
                            <p class="report-view-metric-value">{{ formatCompactNumber(totalFemaleAcrossPrograms) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Male (all sections)</p>
                            <p class="report-view-metric-value">{{ formatCompactNumber(totalMaleAcrossPrograms) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Combined Projects</p>
                            <p class="report-view-metric-value">{{ combinedProjectsCount }}</p>
                            <p class="report-view-metric-meta">SETUP + CEST</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Combined Funding</p>
                            <p class="report-view-metric-value text-sm md:text-base">{{ formatCurrency(combinedFundingAmount) }}</p>
                            <p class="report-view-metric-meta">SETUP + CEST</p>
                        </div>
                    </div>

                    <div class="report-view-metric">
                        <div class="report-view-block-header">
                            <h3 class="report-view-block-title">Quick Access</h3>
                        </div>
                        <div class="report-view-quick-grid">
                            <button
                                v-for="program in overviewPrograms"
                                :key="program.tab"
                                type="button"
                                class="report-view-quick-item"
                                @click="selectTab(program.tab)"
                            >
                                <p class="report-view-quick-title">{{ program.title }}</p>
                                <p class="report-view-quick-label">{{ program.primaryLabel }}</p>
                                <p class="report-view-quick-value">{{ program.primaryValue }}</p>
                                <p class="report-view-quick-label">{{ program.secondaryLabel }}</p>
                                <p class="report-view-quick-value-sm">{{ program.secondaryValue }}</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'GFPS'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Members</p>
                            <p class="report-view-metric-value">{{ gfpsStats.totalMembers }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">GFPS Assemblies</p>
                            <p class="report-view-metric-value">{{ assemblyData.length }}</p>
                            <p class="report-view-metric-meta">Quarterly</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Female Members</p>
                            <p class="report-view-metric-value">{{ gfpsStats.femaleCount }}</p>
                            <p class="report-view-metric-meta">{{ gfpsStats.femalePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Male Members</p>
                            <p class="report-view-metric-value">{{ gfpsStats.maleCount }}</p>
                            <p class="report-view-metric-meta">{{ gfpsStats.malePercentage }}%</p>
                        </div>
                    </div>

                    <div class="report-view-charts">
                        <div class="report-view-block">
                            <div class="report-view-chart-head">
                                <h3 class="report-view-block-title">GFPS Membership by Sex</h3>
                                <p class="report-view-block-desc">Distribution of GFPS members</p>
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
                            <p class="report-view-metric-label">Employment Types</p>
                            <p class="report-view-metric-value">{{ employeesData.length }}</p>
                            <p class="report-view-metric-meta">Categories</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Employees</p>
                            <p class="report-view-metric-value">{{ employeesStats.totalEmployees }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Female Employees</p>
                            <p class="report-view-metric-value">{{ employeesStats.femaleCount }}</p>
                            <p class="report-view-metric-meta">{{ employeesStats.femalePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Male Employees</p>
                            <p class="report-view-metric-value">{{ employeesStats.maleCount }}</p>
                            <p class="report-view-metric-meta">{{ employeesStats.malePercentage }}%</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Employees by Employment Status</h3>
                            <p class="report-view-block-desc">Sex-disaggregated data as of December 31, {{ year.year }}</p>
                        </div>
                        <div class="report-chart-panel">
                            <EmployeesGroupedBarChart :data="employeesData" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'Scholarship'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Scholars</p>
                            <p class="report-view-metric-value">{{ scholarsStats.totalScholars }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">School Year</p>
                            <p class="report-view-metric-value">{{ scholarsStats.schoolYearLabel || 'Not set' }}</p>
                            <p class="report-view-metric-meta">{{ scholarsStats.asOfDate ?? 'No date set' }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Female Scholars</p>
                            <p class="report-view-metric-value">{{ scholarsStats.femaleCount }}</p>
                            <p class="report-view-metric-meta">{{ scholarsStats.femalePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Male Scholars</p>
                            <p class="report-view-metric-value">{{ scholarsStats.maleCount }}</p>
                            <p class="report-view-metric-meta">{{ scholarsStats.malePercentage }}%</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Distribution of On-Going Scholars by Sex</h3>
                            <p class="report-view-block-desc">
                                {{ scholarsStats.schoolYearLabel || `School Year ${year.year}` }}
                                <span v-if="scholarsStats.asOfDate"> • Data as of {{ scholarsStats.asOfDate }}</span>
                            </p>
                        </div>
                        <div class="report-chart-panel">
                            <ScholarsPieChart :female-count="scholarsStats.femaleCount" :male-count="scholarsStats.maleCount" />
                        </div>
                    </div>

                    <!-- Scholarship History Timeline -->
                    <div v-if="scholarshipHistory.length > 1" class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Scholar Count History</h3>
                            <p class="report-view-block-desc">Data progression across reporting periods</p>
                        </div>
                        <div class="space-y-2">
                            <button
                                v-for="(entry, idx) in scholarshipHistory"
                                :key="idx"
                                type="button"
                                class="w-full rounded-xl border px-4 py-3.5 text-left transition-[transform,background-color,border-color,color] duration-200 ease-out active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40"
                                :class="isHistoryExpanded(idx) ? 'border-purple-400/50 bg-purple-900/30 text-purple-100 report-light:border-purple-200 report-light:bg-purple-50/70 report-light:text-purple-950' : 'border-transparent bg-purple-900/10 hover:bg-purple-900/20 text-purple-200/80 hover:text-purple-50 report-light:bg-slate-50 report-light:hover:bg-slate-100/80 report-light:border-slate-200/60 report-light:text-slate-700 report-light:hover:text-slate-900'"
                                @click="toggleHistoryExpand(idx)"
                            >
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2.5">
                                        <svg
                                            class="size-4 shrink-0 transition-transform duration-200 text-purple-400/70 report-light:text-purple-700/60"
                                            :class="{ 'rotate-90': isHistoryExpanded(idx) }"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2.5"
                                            aria-hidden="true"
                                        >
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                        <span
                                            class="text-sm tracking-tight"
                                            :class="isHistoryExpanded(idx) ? 'font-semibold' : 'font-medium'"
                                        >
                                            {{ entry.asOfDate ?? 'No date' }}
                                        </span>
                                        <span v-if="idx === 0" class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase report-light:bg-emerald-100/80 report-light:text-emerald-800">
                                            Latest
                                        </span>
                                    </div>
                                    <span
                                        class="text-sm font-medium tabular-nums"
                                        :class="isHistoryExpanded(idx) ? 'text-purple-200 report-light:text-purple-900/90' : 'text-purple-300/60 report-light:text-slate-500'"
                                    >
                                        <span class="font-mono">{{ entry.femaleCount + entry.maleCount }}</span> scholars
                                    </span>
                                </div>
                                <Transition
                                    enter-active-class="transition-[transform,opacity] duration-200 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition-[transform,opacity] duration-150 ease-in"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0"
                                >
                                    <div
                                        v-if="isHistoryExpanded(idx)"
                                        class="mt-3.5 border-t border-purple-500/10 pt-3 text-xs report-light:border-purple-900/5"
                                    >
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <p class="text-[10px] font-semibold tracking-wider text-purple-300/50 uppercase report-light:text-slate-400">
                                                    School Year
                                                </p>
                                                <p class="mt-1.5 text-sm font-bold text-purple-100 report-light:text-slate-800">
                                                    {{ entry.schoolYearLabel || 'No school year' }}
                                                </p>
                                            </div>
                                            <div>
                                                <p class="text-[10px] font-semibold tracking-wider text-purple-300/50 uppercase report-light:text-slate-400">
                                                    Gender Breakdown
                                                </p>
                                                <div class="mt-1 flex items-baseline gap-3">
                                                    <span class="text-xs text-purple-300/70 report-light:text-slate-500">
                                                        Female:
                                                        <span class="text-base font-bold text-purple-100 report-light:text-slate-900 font-mono ml-0.5">{{ entry.femaleCount }}</span>
                                                    </span>
                                                    <span class="text-purple-500/20 report-light:text-slate-200">|</span>
                                                    <span class="text-xs text-purple-300/70 report-light:text-slate-500">
                                                        Male:
                                                        <span class="text-base font-bold text-purple-100 report-light:text-slate-900 font-mono ml-0.5">{{ entry.maleCount }}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'RSTL'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Customers</p>
                            <p class="report-view-metric-value">{{ rstlStats.totalCustomers }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Period</p>
                            <p class="report-view-metric-value">{{ year.year }}</p>
                            <p class="report-view-metric-meta">Full Year</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Female</p>
                            <p class="report-view-metric-value">{{ rstlStats.femaleCount }}</p>
                            <p class="report-view-metric-meta">{{ rstlStats.femalePercentage }}%</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Male</p>
                            <p class="report-view-metric-value">{{ rstlStats.maleCount }}</p>
                            <p class="report-view-metric-meta">{{ rstlStats.malePercentage }}%</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Testing and Calibration Services</h3>
                            <p class="report-view-block-desc">Customers by sex (warm bodies) - Monthly breakdown for {{ year.year }}</p>
                        </div>
                        <div class="report-chart-panel">
                            <RstlWarmBodiesStackedChart :data="rstlWarmBodiesData" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'Program Funding'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Combined Projects</p>
                            <p class="report-view-metric-value">{{ combinedProjectsCount }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Combined Funding</p>
                            <p class="report-view-metric-value text-sm md:text-base">{{ formatCurrency(combinedFundingAmount) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">SETUP Funding</p>
                            <p class="report-view-metric-value text-sm md:text-base">{{ formatCurrency(setupStats.totalAmount) }}</p>
                            <p class="report-view-metric-meta">{{ setupFundingRows.length }} Categories</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">CEST Funding</p>
                            <p class="report-view-metric-value text-sm md:text-base">{{ formatCurrency(cestStats.totalAmount) }}</p>
                            <p class="report-view-metric-meta">{{ cestFundingRows.length }} Categories</p>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">SETUP Categories</h3>
                            <p class="report-view-block-desc">Funding split by category • {{ year.year }}</p>
                        </div>
                        <div v-if="setupFundingRows.length === 0" class="report-view-block-desc">No SETUP category data yet.</div>
                        <div v-else class="report-view-category-grid">
                            <div v-for="category in setupFundingRows" :key="category.slug" class="report-view-quick-item">
                                <p class="report-view-quick-title">{{ category.label }}</p>
                                <p class="report-view-quick-label">Projects</p>
                                <p class="report-view-quick-value">{{ category.maleProjects + category.femaleProjects }}</p>
                                <p class="report-view-quick-label">Funding</p>
                                <p class="report-view-quick-value-sm">{{ formatCurrency(category.maleAmount + category.femaleAmount) }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">CEST Categories</h3>
                            <p class="report-view-block-desc">Funding split by category • {{ year.year }}</p>
                        </div>
                        <div v-if="cestFundingRows.length === 0" class="report-view-block-desc">No CEST category data yet.</div>
                        <div v-else class="report-view-category-grid">
                            <div v-for="category in cestFundingRows" :key="category.slug" class="report-view-quick-item">
                                <p class="report-view-quick-title">{{ category.label }}</p>
                                <p class="report-view-quick-label">Projects</p>
                                <p class="report-view-quick-value">{{ category.maleProjects + category.femaleProjects }}</p>
                                <p class="report-view-quick-label">Funding</p>
                                <p class="report-view-quick-value-sm">{{ formatCurrency(category.maleAmount + category.femaleAmount) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'SETUP'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Categories</p>
                            <p class="report-view-metric-value">{{ setupFundingRows.length }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Projects</p>
                            <p class="report-view-metric-value">{{ setupStats.totalProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Funding</p>
                            <p class="report-view-metric-value text-sm md:text-base">{{ formatCurrency(setupStats.totalAmount) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Male-led Projects</p>
                            <p class="report-view-metric-value">{{ setupStats.maleProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Female-led Projects</p>
                            <p class="report-view-metric-value">{{ setupStats.femaleProjects }}</p>
                        </div>
                    </div>

                    <div v-if="setupFundingRows.length === 0" class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Small Enterprise Technology Upgrading Program (SETUP)</h3>
                            <p class="report-view-block-desc">No category data yet for {{ year.year }}</p>
                        </div>
                    </div>

                    <div v-else class="report-view-block space-y-4">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Small Enterprise Technology Upgrading Program (SETUP)</h3>
                            <p class="report-view-block-desc">Select category to preview chart • {{ year.year }}</p>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="category in setupFundingRows"
                                :key="category.slug"
                                type="button"
                                :class="fundingCategoryButtonClass(selectedSetupCategorySlug === category.slug)"
                                :aria-pressed="selectedSetupCategorySlug === category.slug"
                                @click="selectSetupCategory(category.slug)"
                            >
                                {{ category.label }}
                            </button>
                        </div>
                        <div v-if="selectedSetupCategory" class="report-chart-panel">
                            <SetupFundingChart :data="selectedSetupCategory" :title="selectedSetupCategory.label" />
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'CEST'" class="space-y-4 md:space-y-6">
                    <div class="report-view-metrics">
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Categories</p>
                            <p class="report-view-metric-value">{{ cestFundingRows.length }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Projects</p>
                            <p class="report-view-metric-value">{{ cestStats.totalProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Total Funding</p>
                            <p class="report-view-metric-value text-sm md:text-base">{{ formatCurrency(cestStats.totalAmount) }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Male-led Projects</p>
                            <p class="report-view-metric-value">{{ cestStats.maleProjects }}</p>
                        </div>
                        <div class="report-view-metric">
                            <p class="report-view-metric-label">Female-led Projects</p>
                            <p class="report-view-metric-value">{{ cestStats.femaleProjects }}</p>
                        </div>
                    </div>

                    <div v-if="cestFundingRows.length === 0" class="report-view-block">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Community Empowerment thru Science and Technology (CEST)</h3>
                            <p class="report-view-block-desc">No category data yet for {{ year.year }}</p>
                        </div>
                    </div>

                    <div v-else class="report-view-block space-y-4">
                        <div class="report-view-chart-head">
                            <h3 class="report-view-block-title">Community Empowerment thru Science and Technology (CEST)</h3>
                            <p class="report-view-block-desc">Select category to preview chart • {{ year.year }}</p>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="category in cestFundingRows"
                                :key="category.slug"
                                type="button"
                                :class="fundingCategoryButtonClass(selectedCestCategorySlug === category.slug)"
                                :aria-pressed="selectedCestCategorySlug === category.slug"
                                @click="selectCestCategory(category.slug)"
                            >
                                {{ category.label }}
                            </button>
                        </div>
                        <div v-if="selectedCestCategory" class="report-chart-panel">
                            <CestFundingChart :data="selectedCestCategory" :title="selectedCestCategory.label" />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
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
.animate-fade-in-up {
    opacity: 0;
    transform: translateY(12px);
    animation: fadeInUp 400ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
.delay-1 {
    animation-delay: 80ms;
}
@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.tab-fade-enter-active,
.tab-fade-leave-active {
    transition: opacity 150ms cubic-bezier(0.23, 1, 0.32, 1), transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
}
.tab-fade-enter-from {
    opacity: 0;
    transform: translateY(4px);
}
.tab-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
