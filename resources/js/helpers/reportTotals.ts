/** Coerce a form field to a number; blank and malformed inputs count as zero. */
export function toNumber(value: unknown): number {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Column totals for a table section.
 *
 * Inputs hand back strings, so every field is coerced before summing — an empty
 * cell must read as 0 rather than turning the whole total into NaN.
 */
export function sumRowFields<K extends string>(rows: readonly Record<string, unknown>[], fields: readonly K[]): Record<K, number> {
    const totals = Object.fromEntries(fields.map((field) => [field, 0])) as Record<K, number>;

    for (const row of rows) {
        for (const field of fields) {
            totals[field] += toNumber(row[field]);
        }
    }

    return totals;
}
