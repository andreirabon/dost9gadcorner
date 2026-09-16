export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Shortened peso amount for prose, e.g. 29488840.48 → "₱29.5M".
 *
 * Three significant digits, so a figure reads at a glance in a sentence
 * without the trailing ".0" that a fixed decimal count leaves on round
 * amounts. Only for narrative text: the metric cards and tables keep
 * `formatCurrency`, which is the figure of record.
 */
export function formatCompactCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        notation: 'compact',
        maximumSignificantDigits: 3,
    }).format(value);
}

/**
 * ₱0.00 reads as a validated zero, so funding that was never recorded reads as
 * absent instead — the same rule the category cards and tables use.
 */
export function formatFundingOrEmpty(amount: number): string {
    return amount > 0 ? formatCurrency(amount) : 'No data yet';
}
