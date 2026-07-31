import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

const post = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock('@/components/ui/toast/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

vi.mock('@inertiajs/vue3', () => ({
    router: { delete: (...args: unknown[]) => del(...args), reload: vi.fn() },
    useForm: (data: Record<string, unknown>) => ({
        ...data,
        errors: {},
        processing: false,
        recentlySuccessful: false,
        post,
        patch,
        reset: vi.fn(),
        transform() {
            return this;
        },
    }),
}));

const ScholarshipSection = (await import('./ScholarshipSection.vue')).default;

// route() is a Ziggy global in the app; stub it for the component under test.
(globalThis as Record<string, unknown>).route = (name: string, params: unknown) => `/${name}/${JSON.stringify(params)}`;

function snapshot(overrides: Record<string, unknown> = {}) {
    return {
        id: 1,
        schoolYearId: 7,
        schoolYearLabel: '2024-2025',
        asOfDate: '2025-06-01',
        femaleCount: 10,
        maleCount: 5,
        createdAt: '2025-06-01T00:00:00+00:00',
        updatedAt: '2025-06-01T00:00:00+00:00',
        lastEditedBy: null,
        lastEditedAt: null,
        ...overrides,
    };
}

function reportYear(overrides: Record<string, unknown> = {}) {
    return {
        id: 3,
        year: 2026,
        title: null,
        description: null,
        status: 'pending' as const,
        publishedAt: null,
        coverImageUrl: null,
        gfpsMembership: { femaleCount: 0, maleCount: 0 },
        gfpsAssemblies: [],
        employeeStatuses: [],
        scholarshipSnapshots: [snapshot()],
        rstlMonthly: [],
        programFunding: [],
        editableFundingSlugs: null,
        isLocked: false,
        ...overrides,
    };
}

function mountSection(props: Record<string, unknown> = {}) {
    const { reportYear: reportYearOverrides, ...rest } = props;

    return mount(ScholarshipSection, {
        props: {
            reportYear: reportYear((reportYearOverrides ?? {}) as Record<string, unknown>),
            schoolYears: [{ id: 7, label: '2024-2025' }],
            canUpdate: true,
            canDelete: true,
            isReadOnly: false,
            ...rest,
        },
        // Keep VTU's default Transition stub: mode="out-in" otherwise waits for a
        // leave animation that never runs in happy-dom, so the form never mounts.
        global: { stubs: { Teleport: true } },
    });
}

describe('ScholarshipSection', () => {
    it('shows the snapshot history with a count', () => {
        const wrapper = mountSection();

        expect(wrapper.text()).toContain('Snapshot History');
        expect(wrapper.text()).toContain('2024-2025');
    });

    it('marks the first snapshot as the latest', () => {
        const wrapper = mountSection({
            reportYear: { scholarshipSnapshots: [snapshot({ id: 2 }), snapshot({ id: 1 })] },
        });

        expect(wrapper.text()).toContain('Latest Snapshot');
    });

    it('prompts to add the first record when there are no snapshots', () => {
        const wrapper = mountSection({ reportYear: { scholarshipSnapshots: [] } });

        expect(wrapper.text()).toContain('No snapshots recorded');
    });

    it('hides the edit and delete actions when the user lacks the abilities', () => {
        const wrapper = mountSection({ canUpdate: false, canDelete: false });

        expect(wrapper.text()).not.toContain('Edit');
        expect(wrapper.text()).not.toContain('Delete');
    });

    it('disables the add-snapshot button while the report is locked', () => {
        const wrapper = mountSection({ isReadOnly: true });

        const addButton = wrapper.findAll('button').find((b) => b.text().includes('Add New Snapshot'));
        expect(addButton?.attributes('disabled')).toBeDefined();
    });

    it('caps the as-of date picker at today so a future date cannot be chosen', async () => {
        const wrapper = mountSection();

        await wrapper
            .findAll('button')
            .find((b) => b.text().includes('Add New Snapshot'))!
            .trigger('click');

        await nextTick();

        const dateInput = wrapper.find('input[type="date"]');
        expect(dateInput.exists()).toBe(true);
        expect(dateInput.attributes('max')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
