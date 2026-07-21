import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReportTabNav from './ReportTabNav.vue';

describe('ReportTabNav', () => {
    it('renders one button per tab and marks the active one selected', () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: 'GFPS' },
        });

        const buttons = wrapper.findAll('[role="tab"]');
        expect(buttons).toHaveLength(8);

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
            props: { activeTab: 'CEST' },
        });

        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('select')?.[0]).toEqual(['Overview']);
    });

    it('ArrowLeft emits the previous tab, wrapping before the first one', async () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: 'Overview' },
        });

        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'ArrowLeft' });

        expect(wrapper.emitted('select')?.[0]).toEqual(['CEST']);
    });

    it('Home and End jump to the first and last tab', async () => {
        const wrapper = mount(ReportTabNav, {
            props: { activeTab: 'RSTL' },
        });

        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'Home' });
        await wrapper.find('[role="tab"]').trigger('keydown', { key: 'End' });

        expect(wrapper.emitted('select')?.[0]).toEqual(['Overview']);
        expect(wrapper.emitted('select')?.[1]).toEqual(['CEST']);
    });
});
