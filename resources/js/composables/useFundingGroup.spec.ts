import type { FundingCategorySummaryData, ReportYearData } from '@/types/reports';
import { describe, expect, it } from 'vitest';
import { computed, ref } from 'vue';
import { fundingStats, jobsBySex, programMetricTotals, useFundingRows } from './useFundingGroup';

const category = (overrides: Partial<FundingCategorySummaryData> = {}): FundingCategorySummaryData => ({
    label: 'SETUP ZC/IC',
    slug: 'setup-zc-ic',
    maleProjects: 0,
    maleAmount: 0,
    femaleProjects: 0,
    femaleAmount: 0,
    ...overrides,
});

const reportData = (overrides: Partial<ReportYearData> = {}): ReportYearData =>
    ({
        setupFundingBreakdown: [],
        cestFundingBreakdown: [],
        giaFundingBreakdown: [],
        ...overrides,
    }) as ReportYearData;

describe('useFundingRows', () => {
    it('reads the breakdown belonging to its own prefix', () => {
        const source = computed(() =>
            reportData({
                setupFundingBreakdown: [category({ label: 'SETUP ZC/IC', maleProjects: 3 })],
                giaFundingBreakdown: [category({ label: 'GIA ZSP', slug: 'gia-zsp', maleProjects: 9 })],
            }),
        );

        const rows = useFundingRows(source, 'gia');

        expect(rows.value.map((row) => row.label)).toEqual(['GIA ZSP']);
        expect(fundingStats(rows.value).maleProjects).toBe(9);
    });

    it('totals projects and amounts across every category', () => {
        const source = computed(() =>
            reportData({
                giaFundingBreakdown: [
                    category({ slug: 'gia-zsp', maleProjects: 2, femaleProjects: 3, maleAmount: 100, femaleAmount: 50 }),
                    category({ slug: 'gia-zds', maleProjects: 1, femaleProjects: 4, maleAmount: 25, femaleAmount: 25 }),
                ],
            }),
        );

        const stats = fundingStats(useFundingRows(source, 'gia').value);

        expect(stats.totalProjects).toBe(10);
        expect(stats.totalAmount).toBe(200);
    });

    it('is empty for a year that has no payload yet', () => {
        expect(
            useFundingRows(
                computed(() => null),
                'gia',
            ).value,
        ).toEqual([]);
    });

    it('exposes jobs per category as separate female and male counts', () => {
        // Jobs by sex are two disjoint groups, unlike the overlapping breakdown.
        const source = computed(() =>
            reportData({
                giaFundingBreakdown: [category({ slug: 'gia-zsp', label: 'GIA ZSP', jobsFemale: 7, jobsMale: 4 })],
            }),
        );

        const jobs = jobsBySex(useFundingRows(source, 'gia').value);

        expect(jobs).toEqual([{ label: 'GIA ZSP', female: 7, male: 4 }]);
    });

    it('reports metric totals as absent when no metric was ever entered', () => {
        // These columns default to zero, so an all-zero total means "never
        // entered" rather than "measured as none".
        const source = computed(() => reportData({ giaFundingBreakdown: [category({ slug: 'gia-zsp', maleProjects: 3 })] }));

        expect(programMetricTotals(useFundingRows(source, 'gia').value).hasData).toBe(false);
    });

    it('totals the program metrics once any of them is entered', () => {
        const source = computed(() =>
            reportData({
                giaFundingBreakdown: [
                    category({ slug: 'gia-zsp', fundedProjectsCount: 2, trainingParticipants: 30, specialProjectsResearchMale: 1 }),
                    category({ slug: 'gia-zds', fundedProjectsCount: 3, trainingParticipants: 10, specialProjectsResearchFemale: 4 }),
                ],
            }),
        );

        const metricTotals = programMetricTotals(useFundingRows(source, 'gia').value);

        expect(metricTotals.hasData).toBe(true);
        expect(metricTotals.fundedProjects).toBe(5);
        expect(metricTotals.trainingParticipants).toBe(40);
        expect(metricTotals.specialResearch).toBe(5);
    });

    it('tracks a changing report payload', () => {
        const payload = ref<ReportYearData | null>(null);
        const rows = useFundingRows(
            computed(() => payload.value),
            'gia',
        );

        expect(rows.value).toEqual([]);

        payload.value = reportData({ giaFundingBreakdown: [category({ slug: 'gia-zsp', label: 'GIA ZSP' })] });

        expect(rows.value.map((row) => row.label)).toEqual(['GIA ZSP']);
    });
});
