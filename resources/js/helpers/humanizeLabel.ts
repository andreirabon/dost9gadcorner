/** "report_year.updated" / "female_count" -> "Report Year Updated" / "Female Count" */
export function humanizeLabel(value: string): string {
    return value
        .split('.')
        .join(' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
