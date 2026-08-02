<script setup lang="ts">
import ReportBackArrowIcon from '@/components/reports/ReportBackArrowIcon.vue';
import FundingCategoryGrid from '@/components/reports/FundingCategoryGrid.vue';
import FundingCategorySelector from '@/components/reports/FundingCategorySelector.vue';
import ReportChartBlock from '@/components/reports/ReportChartBlock.vue';
import ReportMetricsGrid from '@/components/reports/ReportMetricsGrid.vue';
import ReportOverviewQuickAccess, { type OverviewProgram } from '@/components/reports/ReportOverviewQuickAccess.vue';
import ReportTabNav from '@/components/reports/ReportTabNav.vue';
import ScholarshipHistoryTimeline from '@/components/reports/ScholarshipHistoryTimeline.vue';
import { formatCurrency } from '@/helpers/formatCurrency';
import { isValidReportTab, REPORT_TABPANEL_ID, reportTabSlug, type TabType } from '@/helpers/reportTabs';
import type { YearItem } from '@/types';
import type { FundingCategorySummaryData, FundingSummaryData, GfpsAssemblyDataRow, ReportYearData, RstlMonthlyDataRow, ScholarshipSummaryData } from '@/types/reports';
import { Link } from '@inertiajs/vue3';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

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

const percentage = (value: number, total: number): number => {
    if (total === 0) {
        return 0;
    }

    return Number(((value / total) * 100).toFixed(1));
};

const isYearDataPending = computed(() => reportData.value === null);

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

const activeTab = ref<TabType>('Overview');
const tabStorageKey = computed(() => `year-report-last-tab:${props.year.id}`);

/** ₱0.00 reads as a validated zero; funding that was never recorded should read as absent, not as a confirmed nil balance. */
const formatFundingOrEmpty = (amount: number): string => (amount > 0 ? formatCurrency(amount) : 'No data yet');

const formatCompactNumber = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
};

/** Storage can throw (Safari private mode, disabled storage, quota exceeded); tab persistence is a nicety, not a requirement. */
const persistLastTab = (key: string, tab: TabType): void => {
    try {
        localStorage.setItem(key, tab);
    } catch {
        // Ignore: tab selection still works in-memory for this session.
    }
};

const readLastTab = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const selectTab = (tab: TabType) => {
    activeTab.value = tab;
    if (typeof window !== 'undefined') {
        persistLastTab(tabStorageKey.value, tab);
    }
};

const overviewPrograms = computed<OverviewProgram[]>(() => [
    {
        tab: 'GFPS',
        title: 'GFPS',
        metrics: [
            { label: 'Total Members', value: gfpsStats.value.totalMembers },
            { label: 'Female Members', value: gfpsStats.value.femaleCount, meta: `${gfpsStats.value.femalePercentage}%` },
        ],
    },
    {
        tab: 'DOST IX Employees',
        title: 'DOST IX Employees',
        metrics: [
            { label: 'Total Employees', value: employeesStats.value.totalEmployees },
            { label: 'Female Employees', value: employeesStats.value.femaleCount, meta: `${employeesStats.value.femalePercentage}%` },
        ],
    },
    {
        tab: 'Scholarship',
        title: 'Scholarship',
        metrics: [
            { label: 'Total Scholars', value: scholarsStats.value.totalScholars },
            { label: 'Female Scholars', value: scholarsStats.value.femaleCount, meta: `${scholarsStats.value.femalePercentage}%` },
        ],
    },
    {
        tab: 'RSTL',
        title: 'RSTL',
        metrics: [
            { label: 'Total Customers', value: rstlStats.value.totalCustomers },
            { label: 'Female', value: rstlStats.value.femaleCount, meta: `${rstlStats.value.femalePercentage}%` },
        ],
    },
    {
        tab: 'Program Funding',
        title: 'Program Funding',
        metrics: [
            { label: 'Combined Projects', value: combinedProjectsCount.value },
            { label: 'Combined Funding', value: formatFundingOrEmpty(combinedFundingAmount.value) },
        ],
    },
    {
        tab: 'SETUP',
        title: 'SETUP',
        metrics: [
            { label: 'Total Projects', value: setupStats.value.totalProjects },
            { label: 'Total Funding', value: formatFundingOrEmpty(setupStats.value.totalAmount) },
        ],
    },
    {
        tab: 'CEST',
        title: 'CEST',
        metrics: [
            { label: 'Total Projects', value: cestStats.value.totalProjects },
            { label: 'Total Funding', value: formatFundingOrEmpty(cestStats.value.totalAmount) },
        ],
    },
]);

onMounted(() => {
    if (typeof window !== 'undefined') {
        const storedTab = readLastTab(tabStorageKey.value);
        if (storedTab !== null && isValidReportTab(storedTab)) {
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
                                {{ year.title }}
                            </h1>
                            <p v-if="year.description" class="report-view-subtitle">{{ year.description }}</p>
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
                    <ReportTabNav :active-tab="activeTab" @select="selectTab" />
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
                    <div
                        :key="activeTab"
                        :id="REPORT_TABPANEL_ID"
                        role="tabpanel"
                        :aria-labelledby="`report-tab-${reportTabSlug(activeTab)}`"
                        tabindex="0"
                        class="w-full"
                    >
                        <div v-if="activeTab === 'Overview'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        :metrics="[
                            { label: 'Total Female (all sections)', value: formatCompactNumber(totalFemaleAcrossPrograms) },
                            { label: 'Total Male (all sections)', value: formatCompactNumber(totalMaleAcrossPrograms) },
                            { label: 'Combined Projects', value: combinedProjectsCount, meta: 'SETUP + CEST' },
                            {
                                label: 'Combined Funding',
                                value: formatFundingOrEmpty(combinedFundingAmount),
                                meta: 'SETUP + CEST',
                                valueClass: 'text-base md:text-lg',
                            },
                        ]"
                    />

                    <ReportOverviewQuickAccess :programs="overviewPrograms" @select-tab="selectTab" />
                </div>

                <div v-else-if="activeTab === 'GFPS'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        :metrics="[
                            { label: 'Total Members', value: gfpsStats.totalMembers },
                            { label: 'GFPS Assemblies', value: assemblyData.length, meta: 'Quarterly' },
                            { label: 'Female Members', value: gfpsStats.femaleCount, meta: `${gfpsStats.femalePercentage}%` },
                            { label: 'Male Members', value: gfpsStats.maleCount, meta: `${gfpsStats.malePercentage}%` },
                        ]"
                    />

                    <div class="report-view-charts">
                        <ReportChartBlock title="GFPS Membership by Sex" description="Distribution of GFPS members">
                            <GenderPieChart :female-count="gfpsStats.femaleCount" :male-count="gfpsStats.maleCount" />
                        </ReportChartBlock>

                        <ReportChartBlock title="GFPS Assembly Participation" description="Quarterly assembly attendance by sex">
                            <AssemblyStackedBarChart :data="assemblyData" />
                        </ReportChartBlock>
                    </div>
                </div>

                <div v-else-if="activeTab === 'DOST IX Employees'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        :metrics="[
                            { label: 'Employment Types', value: employeesData.length, meta: 'Categories' },
                            { label: 'Total Employees', value: employeesStats.totalEmployees },
                            { label: 'Female Employees', value: employeesStats.femaleCount, meta: `${employeesStats.femalePercentage}%` },
                            { label: 'Male Employees', value: employeesStats.maleCount, meta: `${employeesStats.malePercentage}%` },
                        ]"
                    />

                    <ReportChartBlock title="Employees by Employment Status" :description="`Sex-disaggregated data as of December 31, ${year.year}`">
                        <EmployeesGroupedBarChart :data="employeesData" />
                    </ReportChartBlock>
                </div>

                <div v-else-if="activeTab === 'Scholarship'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        :metrics="[
                            { label: 'Total Scholars', value: scholarsStats.totalScholars },
                            {
                                label: 'School Year',
                                value: scholarsStats.schoolYearLabel || 'Not set',
                                meta: scholarsStats.asOfDate ?? 'No date set',
                            },
                            { label: 'Female Scholars', value: scholarsStats.femaleCount, meta: `${scholarsStats.femalePercentage}%` },
                            { label: 'Male Scholars', value: scholarsStats.maleCount, meta: `${scholarsStats.malePercentage}%` },
                        ]"
                    />

                    <ReportChartBlock title="Distribution of On-Going Scholars by Sex">
                        <template #description>
                            {{ scholarsStats.schoolYearLabel || `School Year ${year.year}` }}
                            <span v-if="scholarsStats.asOfDate"> • Data as of {{ scholarsStats.asOfDate }}</span>
                        </template>
                        <ScholarsPieChart :female-count="scholarsStats.femaleCount" :male-count="scholarsStats.maleCount" />
                    </ReportChartBlock>

                    <ScholarshipHistoryTimeline :history="scholarshipHistory" />
                </div>

                <div v-else-if="activeTab === 'RSTL'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        :metrics="[
                            { label: 'Total Customers', value: rstlStats.totalCustomers },
                            { label: 'Period', value: year.year, meta: 'Full Year' },
                            { label: 'Female', value: rstlStats.femaleCount, meta: `${rstlStats.femalePercentage}%` },
                            { label: 'Male', value: rstlStats.maleCount, meta: `${rstlStats.malePercentage}%` },
                        ]"
                    />

                    <ReportChartBlock
                        title="Testing and Calibration Services"
                        :description="`Customers by sex (warm bodies) - Monthly breakdown for ${year.year}`"
                    >
                        <RstlWarmBodiesStackedChart :data="rstlWarmBodiesData" />
                    </ReportChartBlock>
                </div>

                <div v-else-if="activeTab === 'Program Funding'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        :metrics="[
                            { label: 'Combined Projects', value: combinedProjectsCount },
                            { label: 'Combined Funding', value: formatFundingOrEmpty(combinedFundingAmount), valueClass: 'text-base md:text-lg' },
                            {
                                label: 'SETUP Funding',
                                value: formatFundingOrEmpty(setupStats.totalAmount),
                                meta: `${setupFundingRows.length} Categories`,
                                valueClass: 'text-base md:text-lg',
                            },
                            {
                                label: 'CEST Funding',
                                value: formatFundingOrEmpty(cestStats.totalAmount),
                                meta: `${cestFundingRows.length} Categories`,
                                valueClass: 'text-base md:text-lg',
                            },
                        ]"
                    />

                    <FundingCategoryGrid
                        title="SETUP Categories"
                        :description="`Funding split by category • ${year.year}`"
                        :categories="setupFundingRows"
                        empty-label="No SETUP category data yet."
                    />

                    <FundingCategoryGrid
                        title="CEST Categories"
                        :description="`Funding split by category • ${year.year}`"
                        :categories="cestFundingRows"
                        empty-label="No CEST category data yet."
                    />
                </div>

                <div v-else-if="activeTab === 'SETUP'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        five-up
                        :metrics="[
                            { label: 'Categories', value: setupFundingRows.length },
                            { label: 'Total Projects', value: setupStats.totalProjects },
                            { label: 'Total Funding', value: formatFundingOrEmpty(setupStats.totalAmount), valueClass: 'text-base md:text-lg' },
                            { label: 'Male-led Projects', value: setupStats.maleProjects },
                            { label: 'Female-led Projects', value: setupStats.femaleProjects },
                        ]"
                    />

                    <FundingCategorySelector
                        title="Small Enterprise Technology Upgrading Program (SETUP)"
                        :description="`Select category to preview chart • ${year.year}`"
                        :empty-description="`No category data yet for ${year.year}`"
                        :categories="setupFundingRows"
                        v-slot="{ category }"
                    >
                        <SetupFundingChart :data="category" :title="category.label" />
                    </FundingCategorySelector>
                </div>

                <div v-else-if="activeTab === 'CEST'" class="space-y-3 md:space-y-4">
                    <ReportMetricsGrid
                        five-up
                        :metrics="[
                            { label: 'Categories', value: cestFundingRows.length },
                            { label: 'Total Projects', value: cestStats.totalProjects },
                            { label: 'Total Funding', value: formatFundingOrEmpty(cestStats.totalAmount), valueClass: 'text-base md:text-lg' },
                            { label: 'Male-led Projects', value: cestStats.maleProjects },
                            { label: 'Female-led Projects', value: cestStats.femaleProjects },
                        ]"
                    />

                    <FundingCategorySelector
                        title="Community Empowerment thru Science and Technology (CEST)"
                        :description="`Select category to preview chart • ${year.year}`"
                        :empty-description="`No category data yet for ${year.year}`"
                        :categories="cestFundingRows"
                        v-slot="{ category }"
                    >
                        <CestFundingChart :data="category" :title="category.label" />
                    </FundingCategorySelector>
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
