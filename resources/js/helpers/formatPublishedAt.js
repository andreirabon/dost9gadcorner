/**
 * @param {string | null | undefined} raw
 * @returns {string | null}
 */
export function formatPublishedAt(raw) {
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
