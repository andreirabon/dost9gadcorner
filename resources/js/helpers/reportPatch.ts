/**
 * Build sparse PATCH payloads for report year section saves.
 *
 * Only changed fields are sent, so two people editing different fields of the
 * same section do not overwrite each other.
 */

type Row = Record<string, unknown>;

export function normalizeNumeric(value: unknown): number {
    if (value === '' || value === null || value === undefined) {
        return 0;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeScalar(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value);
}

/**
 * Diff a keyed list of rows, returning one sparse patch per changed row.
 *
 * Every field is compared numerically — including decimals, so that "1000.00"
 * and 1000 are not reported as a change. Decimal fields are *sent* in their raw
 * form to preserve the exact scale the server stores; other fields are sent
 * coerced, so a text input's "8" arrives as 8.
 */
export function diffRowPatches(
    // Deliberately not a shared generic: the two sides routinely disagree on
    // primitive type (a saved 1000 vs an input's "1000.00"), and reconciling
    // that is the whole point of this function.
    originalRows: readonly Row[],
    currentRows: readonly Row[],
    keyField: string,
    valueFields: readonly string[],
    options: { decimalFields?: readonly string[] } = {},
): Row[] {
    const decimalFields = new Set(options.decimalFields ?? []);
    const originalByKey = new Map(originalRows.map((row) => [row[keyField], row]));
    const patches: Row[] = [];

    for (const current of currentRows) {
        const key = current[keyField];
        // A row absent from the original is treated as all-zero, so a first-time
        // entry still produces a patch.
        const original: Row = originalByKey.get(key) ?? {};
        const patch: Row = { [keyField]: key };
        let changed = false;

        for (const field of valueFields) {
            if (normalizeNumeric(original[field]) === normalizeNumeric(current[field])) {
                continue;
            }

            patch[field] = decimalFields.has(field) ? current[field] : normalizeNumeric(current[field]);
            changed = true;
        }

        if (changed) {
            patches.push(patch);
        }
    }

    return patches;
}

/**
 * Diff a flat object, returning a sparse patch or null when nothing changed.
 *
 * Fields listed in `options.numeric` are compared by value so that 2025 and
 * "2025" match; everything else is compared as a string.
 */
export function diffObjectPatch(
    original: Row,
    current: Row,
    fields: readonly string[],
    options: { numeric?: readonly string[] } = {},
): Row | null {
    const numericFields = new Set(options.numeric ?? []);
    const patch: Row = {};
    let changed = false;

    for (const field of fields) {
        const originalValue = numericFields.has(field) ? normalizeNumeric(original[field]) : normalizeScalar(original[field]);
        const currentValue = numericFields.has(field) ? normalizeNumeric(current[field]) : normalizeScalar(current[field]);

        if (originalValue !== currentValue) {
            patch[field] = current[field];
            changed = true;
        }
    }

    return changed ? patch : null;
}

export function hasPatch(payload: unknown): boolean {
    if (payload == null) {
        return false;
    }

    if (Array.isArray(payload)) {
        return payload.length > 0;
    }

    if (typeof payload === 'object') {
        return Object.keys(payload).length > 0;
    }

    return false;
}

/**
 * Deep-clone plain form snapshots without structuredClone, which cannot handle
 * Inertia/Vue reactive proxies.
 */
export function cloneSnapshot<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}
