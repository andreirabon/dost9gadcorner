import type { ScholarshipSummaryData } from '@/types/reports';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ScholarshipHistoryTimeline from './ScholarshipHistoryTimeline.vue';

const entry = (id: number, asOfDate: string, femaleCount: number, maleCount: number): ScholarshipSummaryData => ({
    id,
    schoolYearLabel: `SY ${id}`,
    asOfDate,
    femaleCount,
    maleCount,
});

describe('ScholarshipHistoryTimeline', () => {
    // Regression guard: an earlier version threw
    // "Cannot access 'historyRowId' before initialization" because the immediate watch ran
    // before the function it called was declared. Mounting with history.length > 1 must not throw.
    it('mounts without throwing when there is more than one history entry', () => {
        const history = [entry(1, '2025-06-01', 10, 5), entry(2, '2024-06-01', 8, 4)];

        expect(() => mount(ScholarshipHistoryTimeline, { props: { history } })).not.toThrow();
    });

    it('renders nothing when there is one or zero history entries', () => {
        const wrapper = mount(ScholarshipHistoryTimeline, { props: { history: [entry(1, '2025-06-01', 10, 5)] } });

        expect(wrapper.find('.report-view-block').exists()).toBe(false);
    });

    it('auto-expands the latest (first) entry on mount', () => {
        const history = [entry(1, '2025-06-01', 10, 5), entry(2, '2024-06-01', 8, 4)];
        const wrapper = mount(ScholarshipHistoryTimeline, { props: { history } });

        const buttons = wrapper.findAll('button');
        expect(buttons[0].text()).toContain('Latest');
        expect(buttons[0].attributes('class')).toContain('border-brand-700');
        expect(buttons[1].attributes('class')).not.toContain('border-brand-700');
    });

    it('clicking a collapsed entry expands it independently of other entries', async () => {
        const history = [entry(1, '2025-06-01', 10, 5), entry(2, '2024-06-01', 8, 4)];
        const wrapper = mount(ScholarshipHistoryTimeline, { props: { history } });

        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');

        // Entries expand independently (not an accordion): the newly-clicked entry expands
        // and the already-expanded "Latest" entry stays expanded too.
        expect(buttons[1].attributes('class')).toContain('border-brand-700');
        expect(buttons[0].attributes('class')).toContain('border-brand-700');
    });

    it('clicking an expanded entry collapses it back', async () => {
        const history = [entry(1, '2025-06-01', 10, 5), entry(2, '2024-06-01', 8, 4)];
        const wrapper = mount(ScholarshipHistoryTimeline, { props: { history } });

        const buttons = wrapper.findAll('button');
        await buttons[0].trigger('click');

        expect(buttons[0].attributes('class')).not.toContain('border-brand-700');
    });
});
