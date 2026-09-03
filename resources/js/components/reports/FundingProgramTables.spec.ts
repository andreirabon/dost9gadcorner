import type { FundingCategorySummaryData } from '@/types/reports';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FundingProgramTables from './FundingProgramTables.vue';

const category = (overrides: Partial<FundingCategorySummaryData> = {}): FundingCategorySummaryData => ({
    slug: 'setup-zc-ic',
    label: 'SETUP ZC-IC',
    maleProjects: 0,
    femaleProjects: 0,
    maleAmount: 0,
    femaleAmount: 0,
    ...overrides,
});

const mountTables = (categories: FundingCategorySummaryData[]) =>
    mount(FundingProgramTables, {
        props: { groupLabel: 'SETUP', categories, emptyLabel: 'No SETUP category data yet.' },
    });

describe('FundingProgramTables', () => {
    it('shows the empty label when there are no categories at all', () => {
        expect(mountTables([]).text()).toContain('No SETUP category data yet.');
    });

    it('omits the sections the charts above already plot', () => {
        const wrapper = mountTables([category({ jobsTotal: 100, jobsMale: 50, jobsFemale: 50, jobsPwd: 5 })]);

        const text = wrapper.text();
        expect(text).not.toContain('Jobs Generated');
        expect(text).not.toContain('Jobs Breakdown');
    });

    it('renders every section that has data, labelled by program group', () => {
        const wrapper = mountTables([
            category({
                femaleProjects: 8,
                femaleAmount: 1000,
                fundedProjectsCount: 10,
                trainingParticipants: 40,
            }),
        ]);

        const text = wrapper.text();
        expect(text).toContain('SETUP Program');
        expect(text).toContain('SETUP Program Metrics');
    });

    it('leaves special projects research to its own tab', () => {
        // SETUP, CEST and GIA do not carry it as a program metric, so it must
        // not reappear as a trailing table on their tabs.
        const wrapper = mountTables([category({ femaleProjects: 8, specialProjectsResearchMale: 6, specialProjectsResearchFemale: 4 })]);

        expect(wrapper.text()).not.toContain('Special Projects Research');
    });

    it('drops a section entirely when no category has data for it', () => {
        // Zero is the schema default, so an all-zero section means "never
        // entered" rather than "measured as none".
        const wrapper = mountTables([category({ femaleProjects: 8 })]);

        expect(wrapper.text()).toContain('SETUP Program');
        expect(wrapper.text()).not.toContain('SETUP Program Metrics');
    });

    it('renders unrecorded money as absent rather than a confirmed zero balance', () => {
        const wrapper = mountTables([category({ femaleProjects: 3, femaleAmount: 0 })]);

        expect(wrapper.text()).toContain('No data yet');
    });

    it('keeps one row per category', () => {
        const wrapper = mountTables([
            category({ slug: 'setup-a', label: 'SETUP A', femaleProjects: 5 }),
            category({ slug: 'setup-b', label: 'SETUP B', femaleProjects: 7 }),
        ]);

        expect(wrapper.text()).toContain('SETUP A');
        expect(wrapper.text()).toContain('SETUP B');
    });
});
