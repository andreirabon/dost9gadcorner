import { REPORT_TABS } from '@/helpers/reportTabs';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReportTabNav from './ReportTabNav.vue';

/*
 * Derived from the tab list, never hardcoded: adding a tab should not mean
 * editing the wrap-around expectations here.
 */
const FIRST_TAB = REPORT_TABS[0];
const LAST_TAB = REPORT_TABS[REPORT_TABS.length - 1];

describe('ReportTabNav', () => {
    it('renders one button per tab and marks the active one selected', () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: 'GFPS' },
        });

        // Derived, not hardcoded: adding or removing a tab should not require
        // editing a magic number here.
        const buttons = wrapper.findAll('[role="tab"]');
        expect(buttons).toHaveLength(REPORT_TABS.length);

        const active = wrapper.find('[aria-selected="true"]');
        expect(active.text()).toBe('GFPS');
    });

    it('emits select with the clicked tab', async () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: 'Overview' },
        });

        await wrapper.findAll('[role="tab"]')[2].trigger('click');

        expect(wrapper.emitted('select')?.[0]).toEqual(['DOST IX Employees']);
    });

    it('ArrowRight emits the next tab, wrapping past the last one', async () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: LAST_TAB },
        });

        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('select')?.[0]).toEqual([FIRST_TAB]);
    });

    it('ArrowLeft emits the previous tab, wrapping before the first one', async () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: FIRST_TAB },
        });

        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'ArrowLeft' });

        expect(wrapper.emitted('select')?.[0]).toEqual([LAST_TAB]);
    });

    it('Home and End jump to the first and last tab', async () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: 'RSTL' },
        });

        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'Home' });
        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'End' });

        expect(wrapper.emitted('select')?.[0]).toEqual([FIRST_TAB]);
        expect(wrapper.emitted('select')?.[1]).toEqual([LAST_TAB]);
    });
});
