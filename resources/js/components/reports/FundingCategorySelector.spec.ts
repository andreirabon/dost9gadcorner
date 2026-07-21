import type { FundingCategorySummaryData } from '@/types/reports';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import FundingCategorySelector from './FundingCategorySelector.vue';

const category = (slug: string, label: string): FundingCategorySummaryData => ({
    slug,
    label,
    maleProjects: 1,
    femaleProjects: 1,
    maleAmount: 100,
    femaleAmount: 100,
});

describe('FundingCategorySelector', () => {
    it('auto-selects the first category and exposes it via the scoped slot', () => {
        const categories = [category('a', 'Category A'), category('b', 'Category B')];

        const wrapper = mount(FundingCategorySelector, {
            props: { title: 'T', description: 'D', emptyDescription: 'Empty', categories },
            slots: { default: (slotProps: { category: FundingCategorySummaryData }) => h('div', { class: 'chart-stub' }, slotProps.category.label) },
        });

        expect(wrapper.find('.chart-stub').text()).toBe('Category A');
    });

    it('clicking a category button switches the selection', async () => {
        const categories = [category('a', 'Category A'), category('b', 'Category B')];

        const wrapper = mount(FundingCategorySelector, {
            props: { title: 'T', description: 'D', emptyDescription: 'Empty', categories },
            slots: { default: (slotProps: { category: FundingCategorySummaryData }) => h('div', { class: 'chart-stub' }, slotProps.category.label) },
        });

        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');

        expect(wrapper.find('.chart-stub').text()).toBe('Category B');
        expect(buttons[1].attributes('aria-pressed')).toBe('true');
    });

    it('shows the empty state and no buttons when there are no categories', () => {
        const wrapper = mount(FundingCategorySelector, {
            props: { title: 'T', description: 'D', emptyDescription: 'Nothing here', categories: [] },
        });

        expect(wrapper.text()).toContain('Nothing here');
        expect(wrapper.findAll('button')).toHaveLength(0);
    });

    it('re-selects the first category when the current selection disappears from an updated list', async () => {
        const wrapper = mount(FundingCategorySelector, {
            props: {
                title: 'T',
                description: 'D',
                emptyDescription: 'Empty',
                categories: [category('a', 'Category A'), category('b', 'Category B')],
            },
            slots: { default: (slotProps: { category: FundingCategorySummaryData }) => h('div', { class: 'chart-stub' }, slotProps.category.label) },
        });

        await wrapper.findAll('button')[1].trigger('click');
        expect(wrapper.find('.chart-stub').text()).toBe('Category B');

        await wrapper.setProps({ categories: [category('c', 'Category C')] });

        expect(wrapper.find('.chart-stub').text()).toBe('Category C');
    });
});
