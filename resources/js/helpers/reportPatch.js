/**
 * Build sparse PATCH payloads for report year section saves.
 */

/**
 * @param {unknown} value
 * @returns {number}
 */
export function normalizeNumeric(value) {
    if (value === '' || value === null || value === undefined) {
        return 0;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * @param {string|number} value
 * @returns {string}
 */
function normalizeScalar(value) {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value);
}

/**
 * @template {Record<string, unknown>} T
 * @param {T[]} originalRows
 * @param {T[]} currentRows
 * @param {string} keyField
 * @param {string[]} valueFields
 * @param {{ decimalFields?: string[] }} [options]
 * @returns {Array<Record<string, unknown>>}
 */
export function diffRowPatches(originalRows, currentRows, keyField, valueFields, options = {}) {
    const decimalFields = new Set(options.decimalFields ?? []);
    const originalByKey = new Map(originalRows.map((row) => [row[keyField], row]));
    const patches = [];

    for (const current of currentRows) {
        const key = current[keyField];
        const original = originalByKey.get(key) ?? {};
        /** @type {Record<string, unknown>} */
        const patch = { [keyField]: key };
        let changed = false;

        for (const field of valueFields) {
            let originalValue;
            let currentValue;

            if (decimalFields.has(field)) {
                originalValue = normalizeNumeric(original[field]);
                currentValue = normalizeNumeric(current[field]);
            } else {
                originalValue = normalizeNumeric(original[field]);
                currentValue = normalizeNumeric(current[field]);
            }

            if (originalValue !== currentValue) {
                patch[field] = decimalFields.has(field) ? current[field] : currentValue;
                changed = true;
            }
        }

        if (changed) {
            patches.push(patch);
        }
    }

    return patches;
}

/**
 * @param {Record<string, unknown>} original
 * @param {Record<string, unknown>} current
 * @param {string[]} fields
 * @param {{ numeric?: string[] }} [options]
 * @returns {Record<string, unknown>|null}
 */
export function diffObjectPatch(original, current, fields, options = {}) {
    const numericFields = new Set(options.numeric ?? []);
    /** @type {Record<string, unknown>} */
    const patch = {};
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

/**
 * @param {unknown} payload
 * @returns {boolean}
 */
export function hasPatch(payload) {
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
 * Deep-clone plain form snapshots without structuredClone (Inertia/Vue reactive arrays are not cloneable).
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function cloneSnapshot(value) {
    return JSON.parse(JSON.stringify(value));
}
