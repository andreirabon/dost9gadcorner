<script setup lang="ts">
import FundingGroupPanel from '@/components/reports/FundingGroupPanel.vue';
import ReportBackArrowIcon from '@/components/reports/ReportBackArrowIcon.vue';
import ReportChartBlock from '@/components/reports/ReportChartBlock.vue';
import ReportMetricsGrid from '@/components/reports/ReportMetricsGrid.vue';
import ReportOverviewQuickAccess, { type OverviewProgram } from '@/components/reports/ReportOverviewQuickAccess.vue';
import ReportTabNav from '@/components/reports/ReportTabNav.vue';
import ScholarshipApplicantTables from '@/components/reports/ScholarshipApplicantTables.vue';
import ScholarshipHistoryTimeline from '@/components/reports/ScholarshipHistoryTimeline.vue';
import { fundingStats, useFundingRows } from '@/composables/useFundingGroup';
import { formatFundingOrEmpty } from '@/helpers/formatCurrency';
import { isValidReportTab, REPORT_TABPANEL_ID, reportTabSlug, type TabType } from '@/helpers/reportTabs';
import type { YearItem } from '@/types';
import type { GfpsAssemblyDataRow, ReportYearData, RstlMonthlyDataRow, ScholarshipApplicantDataRow, ScholarshipSummaryData } from '@/types/reports';
import { Link } from '@inertiajs/vue3';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

const StackedBarBySexChart = defineAsyncComponent(() => import('@/components/charts/StackedBarBySexChart.vue'));
const EmployeesGroupedBarChart = defineAsyncComponent(() => import('@/components/charts/EmployeesGroupedBarChart.vue'));
const GenderPieChart = defineAsyncComponent(() => import('@/components/charts/GenderPieChart.vue'));
const RstlWarmBodiesStackedChart = defineAsyncComponent(() => import('@/components/charts/RstlWarmBodiesStackedChart.vue'));
const ScholarsPieChart = defineAsyncComponent(() => import('@/components/charts/ScholarsPieChart.vue'));
const ScholarshipApplicantsBarChart = defineAsyncComponent(() => import('@/components/charts/ScholarshipApplicantsBarChart.vue'));

const props = defineProps<{
    year: YearItem;
}>();

const reportData = computed<ReportYearData | null>(() => props.year.reportData ?? null);

const assemblyData = computed<GfpsAssemblyDataRow[]>(() => reportData.value?.gfpsAssemblies ?? []);
const employeesData = computed<GfpsAssemblyDataRow[]>(() => reportData.value?.employeeStatuses ?? []);
const gfpsMemberStatusData = computed<GfpsAssemblyDataRow[]>(() => reportData.value?.gfpsMemberStatuses ?? []);
const rstlWarmBodiesData = computed<RstlMonthlyDataRow[]>(() => reportData.value?.rstlMonthly ?? []);

/*
 * The three funding families are identical in shape and differ only in which
 * payload keys they read, so each is one call rather than its own copy of the
 * rows, totals and metric derivations.
 */
const setupFundingRows = useFundingRows(reportData, 'setup');
const cestFundingRows = useFundingRows(reportData, 'cest');
const giaFundingRows = useFundingRows(reportData, 'gia');

const percentage = (value: number, total: number): number => {
    if (total === 0) {
        return 0;
    }

    return Number(((value / total) * 100).toFixed(1));
};

/** Rows arrive zero-filled, so an all-zero set means nothing was entered. */
const hasMemberStatusData = computed(() => gfpsMemberStatusData.value.some((row) => row.female + row.male > 0));

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
const scholarshipApplicants = computed<ScholarshipApplicantDataRow[]>(() => reportData.value?.scholarshipApplicants ?? []);

/**
 * Applicants split by study level, charted as small multiples.
 *
 * A level with nothing recorded is dropped rather than drawn as an empty axis —
 * the same rule the applicant tables use.
 */
const applicantsByLevel = (level: 'undergraduate' | 'graduate'): ScholarshipApplicantDataRow[] =>
    scholarshipApplicants.value.filter((row) => row.level === level);

const undergraduateApplicants = computed(() => applicantsByLevel('undergraduate'));
const graduateApplicants = computed(() => applicantsByLevel('graduate'));

const hasApplicantData = (rows: ScholarshipApplicantDataRow[]): boolean => rows.some((row) => row.female + row.male > 0);

const showApplicantCharts = computed(() => hasApplicantData(undergraduateApplicants.value) || hasApplicantData(graduateApplicants.value));

/** Shared axis ceiling: small multiples only compare honestly on one scale. */
const applicantAxisCeiling = computed(() => scholarshipApplicants.value.reduce((max, row) => Math.max(max, row.female + row.male), 0));

/**
 * Jobs generated per funding category, shaped for the stacked bar.
 *
 * Male + female sum to the recorded total (the edit screen enforces it), so a
 * stack is honest here — unlike the PWD/senior/IP/4Ps breakdown, whose groups
 * overlap and must never be stacked.
 */
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

const setupStats = computed(() => fundingStats(setupFundingRows.value));
const cestStats = computed(() => fundingStats(cestFundingRows.value));
const giaStats = computed(() => fundingStats(giaFundingRows.value));

const totalFemaleAcrossPrograms = computed(
    () => gfpsStats.value.femaleCount + employeesStats.value.femaleCount + scholarsStats.value.femaleCount + rstlStats.value.femaleCount,
);

const totalMaleAcrossPrograms = computed(
    () => gfpsStats.value.maleCount + employeesStats.value.maleCount + scholarsStats.value.maleCount + rstlStats.value.maleCount,
);

const combinedFundingAmount = computed(() => setupStats.value.totalAmount + cestStats.value.totalAmount + giaStats.value.totalAmount);
const combinedProjectsCount = computed(() => setupStats.value.totalProjects + cestStats.value.totalProjects + giaStats.value.totalProjects);

const activeTab = ref<TabType>('Overview');
const tabStorageKey = computed(() => `year-report-last-tab:${props.year.id}`);

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
        tab: 'DOST IX Employees',
        title: 'DOST IX Employees',
        metrics: [
            { label: 'Total Employees', value: employeesStats.value.totalEmployees },
            { label: 'Female Employees', value: employeesStats.value.femaleCount, meta: `${employeesStats.value.femalePercentage}%` },
        ],
    },
    {
        tab: 'GFPS',
        title: 'GFPS',
        metrics: [
            { label: 'Total Members', value: gfpsStats.value.totalMembers },
            { label: 'Female Members', value: gfpsStats.value.femaleCount, meta: `${gfpsStats.value.femalePercentage}%` },
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
    {
        tab: 'GIA',
        title: 'GIA',
        metrics: [
            { label: 'Total Projects', value: giaStats.value.totalProjects },
            { label: 'Total Funding', value: formatFundingOrEmpty(giaStats.value.totalAmount) },
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
            <div class="report-view-hero px-page-gutter">
                <div class="report-view-hero-top">
                    <div class="report-view-heading">
                        <div class="space-y-2">
                            <h1 :id="`report-title-${year.id}`" data-focus-anchor="true" tabindex="-1" class="report-view-title">
                                {{ year.title }}
                            </h1>
                        </div>
                    </div>
                    <div class="report-view-actions">
                        <Link :href="`${route('index')}#yearly`" class="report-view-back-link" prefetch>
                            <ReportBackArrowIcon />
                            <span class="hidden sm:inline">Select Another Year</span>
                            <span class="sm:hidden">Back</span>
                        </Link>
                    </div>
                </div>
                <div v-if="!isYearDataPending" class="report-view-tabs-container">
                    <ReportTabNav :active-tab="activeTab" @select="selectTab" />
                </div>
            </div>
        </header>

        <div class="report-view-body px-page-gutter animate-fade-in-up delay-1">
            <div v-if="isYearDataPending" class="report-view-empty">
                <div class="report-view-empty-icon" aria-hidden="true">
                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="max-w-md space-y-4">
                    <p class="report-view-empty-title">Data not yet available</p>
                    <p class="report-view-empty-desc">
                        {{ year.year }} figures are not available yet. This page will be updated as soon as validated annual data is ready.
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
                                    { label: 'Combined Projects', value: combinedProjectsCount, meta: 'SETUP + CEST + GIA' },
                                    {
                                        label: 'Combined Funding',
                                        value: formatFundingOrEmpty(combinedFundingAmount),
                                        meta: 'SETUP + CEST + GIA',
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
                                    <StackedBarBySexChart :data="assemblyData" />
                                </ReportChartBlock>
                            </div>

                            <ReportChartBlock
                                v-if="hasMemberStatusData"
                                title="GFPS Members by Employment Status"
                                description="GFPS members only — recorded separately from the membership total above"
                            >
                                <EmployeesGroupedBarChart :data="gfpsMemberStatusData" />
                            </ReportChartBlock>
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

                            <ReportChartBlock
                                title="Employees by Employment Status"
                                :description="`Sex-disaggregated data as of December 31, ${year.year}`"
                            >
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

                            <!--
                        Full width, not the usual two-up grid: eight bars each need
                        a readable row height, and a half-width card squeezes them
                        into a band too thin to label. They share an axis ceiling,
                        so the two remain directly comparable stacked.
                    -->
                            <template v-if="showApplicantCharts">
                                <ReportChartBlock
                                    v-if="hasApplicantData(undergraduateApplicants)"
                                    title="Undergraduate Applicants by Sex"
                                    :description="`Applicants per program • ${year.year}`"
                                >
                                    <ScholarshipApplicantsBarChart :rows="undergraduateApplicants" :axis-ceiling="applicantAxisCeiling" />
                                </ReportChartBlock>

                                <ReportChartBlock
                                    v-if="hasApplicantData(graduateApplicants)"
                                    title="Graduate Applicants by Sex"
                                    :description="`Applicants per program • ${year.year}`"
                                >
                                    <ScholarshipApplicantsBarChart :rows="graduateApplicants" :axis-ceiling="applicantAxisCeiling" />
                                </ReportChartBlock>
                            </template>

                            <ScholarshipApplicantTables
                                :rows="scholarshipApplicants"
                                empty-label="No scholarship applicant data recorded for this year."
                            />

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

                        <FundingGroupPanel
                            v-else-if="activeTab === 'SETUP'"
                            label="SETUP"
                            full-name="Small Enterprise Technology Upgrading Program (SETUP)"
                            :year="year.year"
                            :categories="setupFundingRows"
                        />

                        <FundingGroupPanel
                            v-else-if="activeTab === 'CEST'"
                            label="CEST"
                            full-name="Community Empowerment thru Science and Technology (CEST)"
                            :year="year.year"
                            :categories="cestFundingRows"
                        />

                        <FundingGroupPanel
                            v-else-if="activeTab === 'GIA'"
                            label="GIA"
                            full-name="Grants-in-Aid (GIA)"
                            :year="year.year"
                            :categories="giaFundingRows"
                        />
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
    transition:
        opacity 150ms cubic-bezier(0.23, 1, 0.32, 1),
        transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
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
