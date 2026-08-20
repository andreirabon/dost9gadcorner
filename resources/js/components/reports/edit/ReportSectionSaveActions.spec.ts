import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReportSectionSaveActions from './ReportSectionSaveActions.vue';

function mountActions(props: Partial<{ processing: boolean; recentlySuccessful: boolean; isReadOnly: boolean }> = {}) {
    return mount(ReportSectionSaveActions, {
        props: {
            processing: false,
            recentlySuccessful: false,
            isReadOnly: false,
            ...props,
        },
        slots: { default: 'Save employee status' },
    });
}

describe('ReportSectionSaveActions', () => {
    it('renders the slotted label on an enabled submit button', () => {
        const wrapper = mountActions();

        const button = wrapper.get('button');

        expect(button.attributes('type')).toBe('submit');
        expect(button.attributes('disabled')).toBeUndefined();
        expect(button.text()).toContain('Save employee status');
    });

    it('disables the button while a save is in flight', () => {
        const wrapper = mountActions({ processing: true });

        expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    });

    it('disables the button for a read-only section', () => {
        const wrapper = mountActions({ isReadOnly: true });

        expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    });

    it('hides the saved hint until a save succeeds', () => {
        const idle = mountActions();
        const saved = mountActions({ recentlySuccessful: true });

        expect(idle.get('.report-save-hint').attributes('style')).toContain('display: none');
        expect(saved.get('.report-save-hint').attributes('style')).toBeUndefined();
    });
});
