import { useToast } from '@/components/ui/toast/use-toast';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

/** Inertia hands errors back as a flat bag; values are usually strings. */
type ErrorBag = Record<string, string>;

const NOTICE_TIMEOUT_MS = 3000;

/**
 * Shared save plumbing for the report edit sections.
 *
 * Every section saves the same way: diff, bail out if nothing changed, PATCH
 * with a conflict token, then either re-baseline or surface the failure. That
 * was written out seven times in Edit.vue, which is how the scholarship delete
 * ended up as the one path with no error branch at all.
 */
export function useReportSectionSave() {
    const { toast } = useToast();
    const saveNotice = ref<string | null>(null);

    /** Options every in-page save shares: never jump the viewport on save. */
    const patchOptions = { preserveScroll: true as const };

    function showSaveNotice(message: string): void {
        saveNotice.value = message;

        window.setTimeout(() => {
            // Only clear our own message — a newer notice must not be cut short.
            if (saveNotice.value === message) {
                saveNotice.value = null;
            }
        }, NOTICE_TIMEOUT_MS);
    }

    /**
     * A conflict means someone else saved this section first. It is not a field
     * error, so it gets a persistent toast with a refresh action rather than a
     * notice that disappears after three seconds.
     *
     * Returns true when the error bag was a conflict and has been handled.
     */
    function handleConflictError(errors: ErrorBag): boolean {
        if (!errors.conflict) {
            return false;
        }

        toast({
            title: 'Save Conflict',
            description: errors.conflict,
            type: 'error',
            duration: 0,
            action: {
                label: 'Refresh',
                onClick: () => router.reload(),
            },
        });

        return true;
    }

    /** First readable message in the bag, for the inline notice. */
    function firstErrorMessage(errors: ErrorBag): string | null {
        const first = Object.values(errors)[0];
        const message = Array.isArray(first) ? first[0] : first;

        return typeof message === 'string' && message !== '' ? message : null;
    }

    /**
     * Standard onError for a section save: conflicts get the toast, anything
     * else gets an inline notice. Never let a failed save look like a success.
     */
    function handleSaveError(errors: ErrorBag, fallback = 'Could not save. Refresh and try again.'): void {
        if (handleConflictError(errors)) {
            return;
        }

        showSaveNotice(firstErrorMessage(errors) ?? fallback);
    }

    return {
        saveNotice,
        patchOptions,
        showSaveNotice,
        handleConflictError,
        firstErrorMessage,
        handleSaveError,
    };
}
