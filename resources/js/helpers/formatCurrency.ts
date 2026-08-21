export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * ₱0.00 reads as a validated zero, so funding that was never recorded reads as
 * absent instead — the same rule the category cards and tables use.
 */
export function formatFundingOrEmpty(amount: number): string {
    return amount > 0 ? formatCurrency(amount) : 'No data yet';
}
