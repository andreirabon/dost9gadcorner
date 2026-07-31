/**
 * Render an ISO timestamp for display, falling back to the raw string when it
 * cannot be parsed rather than showing "Invalid Date".
 */
export function formatPublishedAt(raw: string | null | undefined): string | null {
    if (!raw) {
        return null;
    }

    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) {
        return raw;
    }

    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}
