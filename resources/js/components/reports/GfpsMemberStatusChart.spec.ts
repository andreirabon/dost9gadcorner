import type { YearItem } from '@/types';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

/*
 * The report shell pulls in every chart through `defineAsyncComponent`, none of
 * which happy-dom can render. Stubbing them at the module boundary leaves the
 * shell's own decision — whether the GFPS member-status block renders at all —
 * as the thing under test.
 */
const chartStub = () => ({
    __esModule: true,
    default: { name: 'ChartStub', template: '<div class="chart-stub" />' },
});

vi.mock('@/components/charts/EmployeesGroupedBarChart.vue', () => chartStub());
vi.mock('@/components/charts/GenderPieChart.vue', () => chartStub());
vi.mock('@/components/charts/StackedBarBySexChart.vue', () => chartStub());
vi.mock('@/components/charts/RstlWarmBodiesStackedChart.vue', () => chartStub());
vi.mock('@/components/charts/ScholarsPieChart.vue', () => chartStub());
vi.mock('@/components/charts/ScholarshipApplicantsBarChart.vue', () => chartStub());
vi.mock('@/components/charts/FundingSplitChart.vue', () => chartStub());
vi.mock('@/components/charts/JobsBreakdownHeatmap.vue', () => chartStub());

// The shell links back to the index; the router is not what is under test here.
vi.mock('@inertiajs/vue3', () => ({
    Link: { name: 'LinkStub', template: '<a><slot /></a>' },
}));

import YearReportContent from './YearReportContent.vue';

const statusRow = (label: string, female: number, male: number) => ({ label, female, male });

const yearWith = (gfpsMemberStatuses: ReturnType<typeof statusRow>[]): YearItem =>
    ({
        id: 1,
        year: '2025',
        reportData: {
            gfpsMembership: { femaleCount: 22, maleCount: 6 },
            gfpsAssemblies: [],
            employeeStatuses: [],
            gfpsMemberStatuses,
            scholarship: { id: null, schoolYearLabel: '', asOfDate: null, femaleCount: 0, maleCount: 0 },
            scholarshipHistory: [],
            scholarshipApplicants: [],
            rstlMonthly: [],
            setupFundingBreakdown: [],
            cestFundingBreakdown: [],
            giaFundingBreakdown: [],
        },
    }) as unknown as YearItem;

const mountGfpsTab = (gfpsMemberStatuses: ReturnType<typeof statusRow>[]) =>
    mount(YearReportContent, {
        props: { year: yearWith(gfpsMemberStatuses) },
        // route() is a Ziggy global, resolved off the instance in templates.
        global: { mocks: { route: (name: string) => `/${name}` } },
    });

const openGfpsTab = async (wrapper: ReturnType<typeof mountGfpsTab>) => {
    const gfps = wrapper.findAll('[role="tab"]').find((tab) => tab.text() === 'GFPS');
    await gfps?.trigger('click');

    return wrapper;
};

describe('GFPS members by employment status', () => {
    it('charts the member statuses on the GFPS tab once any is recorded', async () => {
        const wrapper = await openGfpsTab(mountGfpsTab([statusRow('Plantilla', 11, 4), statusRow('COS', 9, 2), statusRow('JO', 2, 0)]));

        expect(wrapper.text()).toContain('GFPS Members by Employment Status');
    });

    it('hides the block when every status is still zero', async () => {
        // Rows arrive zero-filled, so an all-zero set means nothing was entered
        // rather than a measured zero, and drawing it would assert a figure
        // nobody recorded.
        const wrapper = await openGfpsTab(mountGfpsTab([statusRow('Plantilla', 0, 0), statusRow('COS', 0, 0), statusRow('JO', 0, 0)]));

        expect(wrapper.text()).not.toContain('GFPS Members by Employment Status');
    });

    it('leaves the hand-entered membership total untouched by the breakdown', async () => {
        // The two are independent figures; nothing derives one from the other.
        const wrapper = await openGfpsTab(mountGfpsTab([statusRow('Plantilla', 1, 1)]));

        const text = wrapper.text();
        expect(text).toContain('Total Members');
        expect(text).toContain('28');
    });
});
