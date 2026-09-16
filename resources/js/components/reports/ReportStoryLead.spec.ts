import ReportStoryLead from '@/components/reports/ReportStoryLead.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

const LEAD = '.report-view-story-lead';
const NOTE = '.report-view-story-note';

describe('ReportStoryLead', () => {
    it('renders nothing at all when the year has neither computed lines nor a note', () => {
        const wrapper = mount(ReportStoryLead, { props: { sentences: [] } });

        expect(wrapper.find('.report-view-block').exists()).toBe(false);
    });

    it('renders each computed line as its own paragraph', () => {
        const wrapper = mount(ReportStoryLead, {
            props: { sentences: ['In 2026, DOST IX recorded 530 people.', 'SETUP, CEST and GIA together funded 223 projects.'] },
        });

        const leads = wrapper.findAll(LEAD);

        expect(leads).toHaveLength(2);
        expect(leads[0].text()).toBe('In 2026, DOST IX recorded 530 people.');
        expect(leads[1].text()).toBe('SETUP, CEST and GIA together funded 223 projects.');
        expect(wrapper.find(NOTE).exists()).toBe(false);
    });

    it('renders the note on its own when the year has no computed lines', () => {
        const wrapper = mount(ReportStoryLead, { props: { sentences: [], description: 'Data report for 2026.' } });

        expect(wrapper.find(LEAD).exists()).toBe(false);
        expect(wrapper.get(NOTE).text()).toBe('Data report for 2026.');
    });

    it('puts the note after the computed lines, so the finding leads', () => {
        const wrapper = mount(ReportStoryLead, {
            props: { sentences: ['In 2026, DOST IX recorded 530 people.'], description: 'Data report for 2026.' },
        });

        const classes = wrapper.findAll('p').map((paragraph) => paragraph.classes());

        expect(classes[0]).toContain('report-view-story-lead');
        expect(classes[1]).toContain('report-view-story-note');
    });

    it('treats a whitespace-only note as absent rather than printing an empty paragraph', () => {
        const wrapper = mount(ReportStoryLead, { props: { sentences: [], description: '   \n  ' } });

        expect(wrapper.find('.report-view-block').exists()).toBe(false);
    });

    it('treats a null note as absent', () => {
        const wrapper = mount(ReportStoryLead, { props: { sentences: ['In 2026, DOST IX recorded 530 people.'], description: null } });

        expect(wrapper.find(NOTE).exists()).toBe(false);
        expect(wrapper.find(LEAD).exists()).toBe(true);
    });
});
