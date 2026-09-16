import ReportChartBlock from '@/components/reports/ReportChartBlock.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('ReportChartBlock', () => {
    it('renders the takeaway directly after the title so it is read as the finding', () => {
        const wrapper = mount(ReportChartBlock, {
            props: { title: 'GFPS Membership by Sex', takeaway: 'Women make up 57.9% of GFPS members (22 of 38).' },
        });

        const head = wrapper.get('.report-view-chart-head');

        expect(head.get('h3').text()).toBe('GFPS Membership by Sex');
        expect(head.get('.report-view-block-takeaway').text()).toBe('Women make up 57.9% of GFPS members (22 of 38).');
        expect(head.classes()).toContain('report-view-chart-head--story');
    });

    it('leaves the head untouched when there is no takeaway to state', () => {
        const wrapper = mount(ReportChartBlock, {
            props: { title: 'GFPS Membership by Sex', description: 'Distribution of GFPS members' },
        });

        expect(wrapper.find('.report-view-block-takeaway').exists()).toBe(false);
        expect(wrapper.get('.report-view-chart-head').classes()).not.toContain('report-view-chart-head--story');
        expect(wrapper.get('.report-view-block-desc').text()).toBe('Distribution of GFPS members');
    });

    it('keeps the description slot working alongside a takeaway', () => {
        const wrapper = mount(ReportChartBlock, {
            props: { title: 'Scholars', takeaway: 'Women make up 61.4% of on-going scholars (140 of 228).' },
            slots: { description: 'SY 2025-2026' },
        });

        expect(wrapper.get('.report-view-block-desc').text()).toBe('SY 2025-2026');
        expect(wrapper.find('.report-view-block-takeaway').exists()).toBe(true);
    });
});
