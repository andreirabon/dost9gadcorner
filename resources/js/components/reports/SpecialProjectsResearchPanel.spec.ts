import type { FundingCategorySummaryData } from '@/types/reports';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SpecialProjectsResearchPanel from './SpecialProjectsResearchPanel.vue';

const category = (overrides: Partial<FundingCategorySummaryData> = {}): FundingCategorySummaryData => ({
    slug: 'research-zc-ic',
    label: 'Special Projects Research ZC/IC',
    maleProjects: 0,
    femaleProjects: 0,
    maleAmount: 0,
    femaleAmount: 0,
    ...overrides,
});

const mountPanel = (categories: FundingCategorySummaryData[]) =>
    mount(SpecialProjectsResearchPanel, {
        props: { categories, year: '2025' },
        global: { stubs: { StackedBarBySexChart: true } },
    });

describe('SpecialProjectsResearchPanel', () => {
    it('says nothing was recorded when no category carries research', () => {
        const wrapper = mountPanel([category({ femaleProjects: 8, fundedProjectsCount: 3 })]);

        expect(wrapper.text()).toContain('No special projects research recorded for 2025.');
    });

    it('names each row by its province, not by the full programme name', () => {
        const wrapper = mountPanel([
            category({ slug: 'research-zsp', label: 'Special Projects Research ZSP', specialProjectsResearchFemale: 3 }),
            category({ slug: 'research-zds', label: 'Special Projects Research ZDS', specialProjectsResearchMale: 2 }),
        ]);

        const rowHeads = wrapper.findAll('.report-view-table-rowhead').map((node) => node.text());

        expect(rowHeads).toEqual(['ZSP', 'ZDS']);
    });

    it('totals researchers across provinces and by sex', () => {
        const wrapper = mountPanel([
            category({
                slug: 'research-zsp',
                label: 'Special Projects Research ZSP',
                specialProjectsResearchMale: 2,
                specialProjectsResearchFemale: 3,
            }),
            category({
                slug: 'research-zdn',
                label: 'Special Projects Research ZDN',
                specialProjectsResearchMale: 4,
                specialProjectsResearchFemale: 1,
            }),
        ]);

        const cells = wrapper.findAll('.report-view-metric-value').map((node) => node.text());

        // Provinces with research, total researchers, female, male.
        expect(cells).toEqual(['2', '10', '4', '6']);
    });

    it('drops a province that recorded nothing rather than printing a row of zeros', () => {
        const wrapper = mountPanel([
            category({ slug: 'research-zsp', label: 'Special Projects Research ZSP', specialProjectsResearchFemale: 3 }),
            category({ slug: 'research-zds', label: 'Special Projects Research ZDS' }),
        ]);

        const rowHeads = wrapper.findAll('.report-view-table-rowhead').map((node) => node.text());

        expect(rowHeads).toEqual(['ZSP']);
    });
});
