import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReportOverviewQuickAccess, { type OverviewProgram } from './ReportOverviewQuickAccess.vue';

const programs: OverviewProgram[] = [
    {
        tab: 'GFPS',
        title: 'GFPS',
        metrics: [
            { label: 'Total Members', value: 10 },
            { label: 'Female Members', value: 6, meta: '60%' },
        ],
    },
    {
        tab: 'RSTL',
        title: 'RSTL',
        metrics: [{ label: 'Total Customers', value: 20 }],
    },
];

describe('ReportOverviewQuickAccess', () => {
    it('renders one card per program with its metrics', () => {
        const wrapper = mount(ReportOverviewQuickAccess, { props: { programs } });

        const cards = wrapper.findAll('.report-view-quick-item');
        expect(cards).toHaveLength(2);
        expect(cards[0].text()).toContain('GFPS');
        expect(cards[0].text()).toContain('60%');
    });

    it('emits select-tab with the clicked program tab', async () => {
        const wrapper = mount(ReportOverviewQuickAccess, { props: { programs } });

        await wrapper.findAll('.report-view-quick-item')[1].trigger('click');

        expect(wrapper.emitted('select-tab')?.[0]).toEqual(['RSTL']);
    });
});
