import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReportMetricsGrid, { type ReportMetricItem } from './ReportMetricsGrid.vue';

const metrics: ReportMetricItem[] = [
    { label: 'Total Members', value: 42 },
    { label: 'Female Members', value: 20, meta: '48%' },
];

describe('ReportMetricsGrid', () => {
    it('renders one card per metric with label, value, and optional meta', () => {
        const wrapper = mount(ReportMetricsGrid, { props: { metrics } });

        const cards = wrapper.findAll('.report-view-metric');
        expect(cards).toHaveLength(2);
        expect(cards[0].text()).toContain('Total Members');
        expect(cards[0].text()).toContain('42');
        expect(cards[0].text()).not.toContain('%');
        expect(cards[1].text()).toContain('48%');
    });

    it('applies the five-up modifier class only when the fiveUp prop is set', () => {
        const withoutFiveUp = mount(ReportMetricsGrid, { props: { metrics } });
        expect(withoutFiveUp.classes()).not.toContain('report-view-metrics--five-up');

        const withFiveUp = mount(ReportMetricsGrid, { props: { metrics, fiveUp: true } });
        expect(withFiveUp.classes()).toContain('report-view-metrics--five-up');
    });
});
