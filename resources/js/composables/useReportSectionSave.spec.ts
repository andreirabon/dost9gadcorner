import { describe, expect, it, vi } from 'vitest';

const toast = vi.fn();
const reload = vi.fn();

vi.mock('@/components/ui/toast/use-toast', () => ({ useToast: () => ({ toast }) }));
vi.mock('@inertiajs/vue3', () => ({ router: { reload: () => reload() } }));

const { useReportSectionSave } = await import('./useReportSectionSave');

describe('handleConflictError', () => {
    it('raises a persistent toast with a refresh action for a conflict', () => {
        toast.mockClear();
        const { handleConflictError } = useReportSectionSave();

        const handled = handleConflictError({ conflict: 'Modified by another user.' });

        expect(handled).toBe(true);
        const call = toast.mock.calls[0][0];
        // duration 0 keeps it on screen: a conflict needs a decision, not a glance.
        expect(call.duration).toBe(0);
        expect(call.description).toBe('Modified by another user.');
        expect(call.action.label).toBe('Refresh');
    });

    it('ignores an error bag that is not a conflict', () => {
        toast.mockClear();
        const { handleConflictError } = useReportSectionSave();

        expect(handleConflictError({ female_count: 'must be an integer' })).toBe(false);
        expect(toast).not.toHaveBeenCalled();
    });
});

describe('firstErrorMessage', () => {
    it('reads a plain string message', () => {
        const { firstErrorMessage } = useReportSectionSave();

        expect(firstErrorMessage({ year: 'The year is taken.' })).toBe('The year is taken.');
    });

    it('unwraps an array of messages', () => {
        const { firstErrorMessage } = useReportSectionSave();

        expect(firstErrorMessage({ year: ['The year is taken.'] as unknown as string })).toBe('The year is taken.');
    });

    it('returns null when there is nothing readable', () => {
        const { firstErrorMessage } = useReportSectionSave();

        expect(firstErrorMessage({})).toBeNull();
        expect(firstErrorMessage({ year: '' })).toBeNull();
    });
});

describe('handleSaveError', () => {
    it('shows the first field error inline', () => {
        const { handleSaveError, saveNotice } = useReportSectionSave();

        handleSaveError({ female_count: 'must be an integer' });

        expect(saveNotice.value).toBe('must be an integer');
    });

    it('falls back to a generic message when the bag is unreadable', () => {
        const { handleSaveError, saveNotice } = useReportSectionSave();

        handleSaveError({});

        expect(saveNotice.value).toBe('Could not save. Refresh and try again.');
    });

    it('does not show an inline notice for a conflict, which gets the toast', () => {
        const { handleSaveError, saveNotice } = useReportSectionSave();

        handleSaveError({ conflict: 'Modified by another user.' });

        expect(saveNotice.value).toBeNull();
    });
});

describe('showSaveNotice', () => {
    it('clears its own message after the timeout', () => {
        vi.useFakeTimers();
        const { showSaveNotice, saveNotice } = useReportSectionSave();

        showSaveNotice('No changes to save.');
        expect(saveNotice.value).toBe('No changes to save.');

        vi.advanceTimersByTime(3000);
        expect(saveNotice.value).toBeNull();
        vi.useRealTimers();
    });

    it('does not cut short a newer message', () => {
        vi.useFakeTimers();
        const { showSaveNotice, saveNotice } = useReportSectionSave();

        showSaveNotice('first');
        vi.advanceTimersByTime(2000);
        showSaveNotice('second');
        // The first message's timer fires here and must leave 'second' alone.
        vi.advanceTimersByTime(1000);

        expect(saveNotice.value).toBe('second');
        vi.useRealTimers();
    });
});
