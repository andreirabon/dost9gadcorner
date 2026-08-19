const GROUPED = new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 });

/**
 * Thousands-separated number, e.g. 50000.25 → "50,000.25".
 *
 * Non-finite input returns an empty string rather than "NaN", so a half-typed
 * or missing figure never renders as an error word in the UI.
 */
export function formatNumber(value: number): string {
    return Number.isFinite(value) ? GROUPED.format(value) : '';
}

/**
 * Grouped number for a text input, keeping the decimals the user actually typed
 * rather than padding or truncating them.
 *
 * Returns the raw string untouched when it is not a complete number — mid-typing
 * states like "50000." or "-" must survive, or the caret jumps and the trailing
 * separator is eaten as soon as it is typed.
 */
export function formatNumberInput(raw: string): string {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return '';
    }

    const parsed = Number(trimmed);

    /*
     * A trailing dot parses as a finite number ("50000." → 50000), so testing
     * only for finiteness would format it and swallow the dot the instant it is
     * typed. Both incomplete shapes are returned untouched.
     */
    if (!Number.isFinite(parsed) || trimmed.endsWith('.')) {
        return raw;
    }

    const [, decimals = ''] = trimmed.split('.');

    return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: decimals.length,
        maximumFractionDigits: Math.max(decimals.length, 2),
    }).format(parsed);
}

/**
 * Strips grouping separators so a formatted field can be read back as a number.
 * Everything except digits, a single leading sign, and one dot is dropped.
 */
export function parseNumberInput(raw: string): string {
    const cleaned = String(raw).replace(/,/g, '');
    const match = cleaned.match(/^-?\d*\.?\d*/);

    return match ? match[0] : '';
}
