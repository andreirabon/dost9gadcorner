/**
 * Full names for the jobs-generated subgroups.
 *
 * Spelled out rather than abbreviated: this is a public report, and PWD / IP /
 * 4Ps are only obvious to readers already inside the programme. Defined once so
 * the table, the edit screen, and the heatmap cannot drift apart.
 */
export const JOBS_BREAKDOWN_LABELS = {
    pwd: 'Person with Disability',
    seniorCitizen: 'Senior Citizen',
    ip: 'Indigenous People',
    fourPs: 'Pantawid Pamilyang Pilipino Program',
} as const;

/**
 * Breaks a long axis label into lines.
 *
 * ApexCharts truncates a category label with an ellipsis once it exceeds the
 * axis width — which would silently abbreviate exactly the names this report
 * spells out in full. Returning an array instead makes Apex render each element
 * on its own line, so the whole name survives.
 *
 * Words longer than the limit are left intact rather than broken mid-word: an
 * over-long line is still readable, a hyphenated fragment is not.
 */
export function wrapAxisLabel(text: string, maxCharsPerLine = 26): string[] {
    const lines: string[] = [];
    let current = '';

    for (const word of String(text).split(/\s+/).filter(Boolean)) {
        if (current === '') {
            current = word;
            continue;
        }

        if (`${current} ${word}`.length <= maxCharsPerLine) {
            current = `${current} ${word}`;
            continue;
        }

        lines.push(current);
        current = word;
    }

    if (current !== '') {
        lines.push(current);
    }

    return lines.length > 0 ? lines : [''];
}
