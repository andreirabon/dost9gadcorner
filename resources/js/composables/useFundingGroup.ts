import type { FundingCategorySummaryData, FundingGroupPrefix, FundingSummaryData, ReportYearData } from '@/types/reports';
import { computed, type ComputedRef } from 'vue';

const EMPTY_FUNDING: FundingSummaryData = {
    maleProjects: 0,
    maleAmount: 0,
    femaleProjects: 0,
    femaleAmount: 0,
};

export interface FundingGroupStats {
    totalProjects: number;
    totalAmount: number;
    maleProjects: number;
    femaleProjects: number;
}

export interface FundingGroupMetricTotals {
    fundedProjects: number;
    fundedValue: number;
    trainingParticipants: number;
    jobsGenerated: number;
    specialResearch: number;
    /** False when nothing was ever entered, which is not the same as a measured zero. */
    hasData: boolean;
}

export interface FundingGroupJobsRow {
    label: string;
    female: number;
    male: number;
}

/**
 * The categories of one funding program family (SETUP, CEST, GIA).
 *
 * The three families differ only in which payload key they read, so they share
 * this one resolution rather than three copies that can drift apart. Everything
 * else a tab shows is a pure function of these rows — see the helpers below.
 *
 * The transformer emits one row per seeded funding program, so an empty list
 * means the year itself is unpublished, not that a family went unrecorded.
 *
 * @param reportData Live report payload; null until the year is published.
 * @param prefix     Payload key prefix.
 */
export function useFundingRows(
    reportData: ComputedRef<ReportYearData | null>,
    prefix: FundingGroupPrefix,
): ComputedRef<FundingCategorySummaryData[]> {
    return computed<FundingCategorySummaryData[]>(() => reportData.value?.[`${prefix}FundingBreakdown`] ?? []);
}

/** Projects and funding totalled across one family's categories. */
export const fundingStats = (rows: FundingCategorySummaryData[]): FundingGroupStats => {
    const totals = rows.reduce<FundingSummaryData>(
        (carry, row) => ({
            maleProjects: carry.maleProjects + row.maleProjects,
            maleAmount: carry.maleAmount + row.maleAmount,
            femaleProjects: carry.femaleProjects + row.femaleProjects,
            femaleAmount: carry.femaleAmount + row.femaleAmount,
        }),
        { ...EMPTY_FUNDING },
    );

    return {
        totalProjects: totals.maleProjects + totals.femaleProjects,
        totalAmount: totals.maleAmount + totals.femaleAmount,
        maleProjects: totals.maleProjects,
        femaleProjects: totals.femaleProjects,
    };
};

/**
 * Per-program annual metrics, totalled across one family's categories.
 *
 * `hasData` drives whether the row renders at all: these columns default to
 * zero in the schema, so an all-zero total means "never entered" rather than
 * "measured as none", and printing it would assert a figure nobody recorded.
 */
export const programMetricTotals = (rows: FundingCategorySummaryData[]): FundingGroupMetricTotals => {
    const total = (key: keyof FundingCategorySummaryData): number => rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);

    const metrics = {
        fundedProjects: total('fundedProjectsCount'),
        fundedValue: total('fundedProjectsValue'),
        trainingParticipants: total('trainingParticipants'),
        jobsGenerated: total('jobsTotal'),
        specialResearch: total('specialProjectsResearchMale') + total('specialProjectsResearchFemale'),
    };

    return {
        ...metrics,
        hasData: Object.values(metrics).some((value) => value > 0),
    };
};

/**
 * Jobs split by sex, which is a true partition — unlike the PWD / senior / IP /
 * 4Ps breakdown, whose groups overlap and must never be stacked.
 */
export const jobsBySex = (rows: FundingCategorySummaryData[]): FundingGroupJobsRow[] =>
    rows.map((row) => ({
        label: row.label,
        female: row.jobsFemale ?? 0,
        male: row.jobsMale ?? 0,
    }));

/** True once any job was recorded, so the by-sex chart is worth drawing. */
export const hasJobsData = (rows: FundingGroupJobsRow[]): boolean => rows.some((row) => row.female + row.male > 0);

/** The breakdown grid is only worth drawing once some subset has been recorded. */
export const hasBreakdownData = (rows: FundingCategorySummaryData[]): boolean =>
    rows.some((row) => (row.jobsPwd ?? 0) + (row.jobsSeniorCitizen ?? 0) + (row.jobsIp ?? 0) + (row.jobs4ps ?? 0) > 0);
