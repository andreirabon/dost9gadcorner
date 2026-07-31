import { describe, expect, it, vi } from 'vitest';

const patch = vi.fn();
let lastTransform: ((data: unknown) => unknown) | null = null;

vi.mock('@/components/ui/toast/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

vi.mock('@inertiajs/vue3', () => ({
    router: { reload: vi.fn() },
    useForm: (data: Record<string, unknown>) => {
        const form: Record<string, unknown> = {
            ...data,
            errors: {},
            processing: false,
            recentlySuccessful: false,
            transform(fn: (d: unknown) => unknown) {
                lastTransform = fn;
                return form;
            },
            patch,
        };

        return form;
    },
}));

const { useRowSection } = await import('./useRowSection');

function makeSection(overrides: Record<string, unknown> = {}) {
    const notify = vi.fn();

    const section = useRowSection({
        rows: [
            { period_id: 1, female_count: 1, male_count: 2 },
            { period_id: 2, female_count: 3, male_count: 4 },
        ],
        key: 'period_id',
        fields: ['female_count', 'male_count'],
        payloadKey: 'attendances',
        url: () => '/report-years/9/gfps-assemblies',
        expectedUpdatedAt: () => '2026-01-01T00:00:00+00:00',
        notify,
        ...overrides,
    });

    return { ...section, notify };
}

describe('useRowSection', () => {
    it('does not call the server when nothing changed', () => {
        patch.mockClear();
        const { save, notify } = makeSection();

        save();

        expect(patch).not.toHaveBeenCalled();
        expect(notify).toHaveBeenCalledWith('No changes to save.');
    });

    it('sends only the changed rows under the key the server expects', () => {
        patch.mockClear();
        lastTransform = null;
        const { form, save } = makeSection();

        (form.rows as Record<string, unknown>[])[1].female_count = 99;
        save();

        expect(patch).toHaveBeenCalledOnce();
        expect(patch.mock.calls[0][0]).toBe('/report-years/9/gfps-assemblies');

        const payload = lastTransform!({}) as Record<string, unknown>;
        // Named 'attendances', not the local 'rows' field, and row 1 is untouched.
        expect(payload.attendances).toEqual([{ period_id: 2, female_count: 99 }]);
        expect(payload.expected_updated_at).toBe('2026-01-01T00:00:00+00:00');
    });

    it('resolves the conflict token at save time, not at setup', () => {
        patch.mockClear();
        lastTransform = null;
        let token = 'first';
        const { form, save } = makeSection({ expectedUpdatedAt: () => token });

        token = 'second';
        (form.rows as Record<string, unknown>[])[0].male_count = 7;
        save();

        expect((lastTransform!({}) as Record<string, unknown>).expected_updated_at).toBe('second');
    });

    it('reads server errors from the payload key rather than the local field name', () => {
        const { form, error } = makeSection();

        (form.errors as Record<string, string>).attendances = 'The attendances field is required.';

        expect(error.value).toBe('The attendances field is required.');
    });

    it('surfaces a validation failure through notify', () => {
        patch.mockClear();
        const { form, save, notify } = makeSection();

        (form.rows as Record<string, unknown>[])[0].female_count = 5;
        save();

        const options = patch.mock.calls[0][1] as { onError: (e: Record<string, string>) => void };
        options.onError({ 'attendances.0.female_count': 'must be an integer' });

        expect(notify).toHaveBeenCalledWith('must be an integer');
    });

    it('only re-baselines after a successful save, so a failed save stays dirty', () => {
        patch.mockClear();
        const { form, save } = makeSection();

        (form.rows as Record<string, unknown>[])[0].female_count = 5;
        save();

        // Failure path: no onSuccess, so the next save must still see the change.
        patch.mockClear();
        save();
        expect(patch).toHaveBeenCalledOnce();

        // Success path: re-baseline, then the same rows are no longer a change.
        const options = patch.mock.calls[0][1] as { onSuccess: () => void };
        options.onSuccess();
        patch.mockClear();
        save();
        expect(patch).not.toHaveBeenCalled();
    });
});
