import { useReportSectionSave } from '@/composables/useReportSectionSave';
import { cloneSnapshot, diffRowPatches, hasPatch } from '@/helpers/reportPatch';
import { useForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

type Row = Record<string, unknown>;

interface RowSectionOptions {
    /** Initial rows, already mapped to the server's field names. */
    rows: Row[];
    /** Row identity field, echoed back in every patch (e.g. 'period_id'). */
    key: string;
    /** Fields that may change and are worth diffing. */
    fields: readonly string[];
    /** Fields sent in raw form to preserve decimal scale. */
    decimalFields?: readonly string[];
    /** Key the server expects the row array under (e.g. 'breakdowns'). */
    payloadKey: string;
    /** Deferred so the route is resolved at save time, not at setup. */
    url: () => string;
    /** Deferred so the freshest conflict token is sent. */
    expectedUpdatedAt: () => string | null | undefined;
    /** Where to surface a message; the page shell owns the notice line. */
    notify: (message: string) => void;
}

/**
 * Form + diff + save for a table-shaped report section.
 *
 * The four table sections (assemblies, employee status, RSTL, program funding)
 * all save identically: diff against the last-saved baseline, skip the request
 * when nothing changed, PATCH only the changed rows with a conflict token, then
 * re-baseline on success. Written once here rather than four times.
 */
export function useRowSection(options: RowSectionOptions) {
    const { patchOptions, handleConflictError, firstErrorMessage } = useReportSectionSave();

    // Rows are dynamic per section, so they are carried untyped through the form
    // and validated by the server; the section component owns the real shape.
    const form = useForm({ rows: options.rows as Record<string, never>[] });

    // The baseline the next diff compares against. Advanced only on success, so
    // a failed save leaves the user's edits pending rather than silently accepted.
    const baseline = ref(cloneSnapshot(options.rows));

    function save(): void {
        const patches = diffRowPatches(baseline.value as Row[], form.rows as Row[], options.key, options.fields, {
            decimalFields: options.decimalFields,
        });

        if (!hasPatch(patches)) {
            options.notify('No changes to save.');
            return;
        }

        form.transform(() => ({
            [options.payloadKey]: patches,
            expected_updated_at: options.expectedUpdatedAt(),
        })).patch(options.url(), {
            ...patchOptions,
            onSuccess: () => {
                baseline.value = cloneSnapshot(form.rows);
            },
            onError: (errors) => {
                if (handleConflictError(errors)) {
                    return;
                }

                options.notify(firstErrorMessage(errors) ?? 'Could not save. Refresh and try again.');
            },
        });
    }

    // Errors come back keyed by what the server was sent (`attendances`,
    // `breakdowns`, `summaries`) — not by the local `rows` field name.
    const error = computed(() => (form.errors as Record<string, string | undefined>)[options.payloadKey]);

    return { form, save, error };
}
