import { describe, expect, it } from 'vitest';
import { cloneSnapshot, diffObjectPatch, diffRowPatches, hasPatch, normalizeNumeric } from './reportPatch';

describe('normalizeNumeric', () => {
    it('treats empty and missing values as zero', () => {
        expect(normalizeNumeric('')).toBe(0);
        expect(normalizeNumeric(null)).toBe(0);
        expect(normalizeNumeric(undefined)).toBe(0);
    });

    it('coerces numeric strings', () => {
        expect(normalizeNumeric('42')).toBe(42);
        expect(normalizeNumeric('1000.50')).toBe(1000.5);
    });

    it('falls back to zero for values that are not finite numbers', () => {
        expect(normalizeNumeric('abc')).toBe(0);
        expect(normalizeNumeric(Infinity)).toBe(0);
    });
});

describe('diffObjectPatch', () => {
    it('returns null when nothing changed', () => {
        const original = { title: 'A', description: 'B' };

        expect(diffObjectPatch(original, { ...original }, ['title', 'description'])).toBeNull();
    });

    it('returns only the fields that changed', () => {
        const patch = diffObjectPatch({ title: 'A', description: 'B' }, { title: 'A', description: 'C' }, ['title', 'description']);

        expect(patch).toEqual({ description: 'C' });
    });

    it('ignores fields outside the allowed list', () => {
        const patch = diffObjectPatch({ title: 'A', status: 'pending' }, { title: 'A', status: 'published' }, ['title']);

        expect(patch).toBeNull();
    });

    it('compares numeric fields by value, not by string form', () => {
        const patch = diffObjectPatch({ year: 2025 }, { year: '2025' }, ['year'], { numeric: ['year'] });

        expect(patch).toBeNull();
    });

    it('treats a blank numeric field as zero rather than as a change to empty', () => {
        expect(diffObjectPatch({ year: 0 }, { year: '' }, ['year'], { numeric: ['year'] })).toBeNull();
    });

    it('sends the raw current value, not the coerced one', () => {
        const patch = diffObjectPatch({ year: 2025 }, { year: '2026' }, ['year'], { numeric: ['year'] });

        expect(patch).toEqual({ year: '2026' });
    });
});

describe('diffRowPatches', () => {
    const rows = (female: number, male: number) => [{ period_id: 1, female_count: female, male_count: male }];

    it('emits nothing when no row changed', () => {
        expect(diffRowPatches(rows(1, 2), rows(1, 2), 'period_id', ['female_count', 'male_count'])).toEqual([]);
    });

    it('emits only changed rows, each carrying its key', () => {
        const original = [
            { period_id: 1, female_count: 1, male_count: 2 },
            { period_id: 2, female_count: 3, male_count: 4 },
        ];
        const current = [
            { period_id: 1, female_count: 1, male_count: 2 },
            { period_id: 2, female_count: 9, male_count: 4 },
        ];

        expect(diffRowPatches(original, current, 'period_id', ['female_count', 'male_count'])).toEqual([{ period_id: 2, female_count: 9 }]);
    });

    it('emits only the changed fields within a row', () => {
        expect(diffRowPatches(rows(1, 2), rows(1, 7), 'period_id', ['female_count', 'male_count'])).toEqual([{ period_id: 1, male_count: 7 }]);
    });

    it('treats a row missing from the original as changed from zero', () => {
        expect(diffRowPatches([], rows(0, 5), 'period_id', ['female_count', 'male_count'])).toEqual([{ period_id: 1, male_count: 5 }]);
    });

    it('compares decimal fields numerically so formatting alone is not a change', () => {
        const original = [{ funding_program_id: 1, female_amount: '1000.00' }];
        const current = [{ funding_program_id: 1, female_amount: 1000 }];

        expect(diffRowPatches(original, current, 'funding_program_id', ['female_amount'], { decimalFields: ['female_amount'] })).toEqual([]);
    });

    it('sends a changed decimal in its raw form, preserving precision', () => {
        const original = [{ funding_program_id: 1, female_amount: '1000.00' }];
        const current = [{ funding_program_id: 1, female_amount: '2500.75' }];

        expect(diffRowPatches(original, current, 'funding_program_id', ['female_amount'], { decimalFields: ['female_amount'] })).toEqual([
            { funding_program_id: 1, female_amount: '2500.75' },
        ]);
    });

    it('sends a changed non-decimal field coerced to a number', () => {
        const original = [{ period_id: 1, female_count: 1 }];
        const current = [{ period_id: 1, female_count: '8' }];

        expect(diffRowPatches(original, current, 'period_id', ['female_count'])).toEqual([{ period_id: 1, female_count: 8 }]);
    });
});

describe('hasPatch', () => {
    it('rejects empty payloads', () => {
        expect(hasPatch(null)).toBe(false);
        expect(hasPatch(undefined)).toBe(false);
        expect(hasPatch([])).toBe(false);
        expect(hasPatch({})).toBe(false);
    });

    it('accepts populated payloads', () => {
        expect(hasPatch([{ id: 1 }])).toBe(true);
        expect(hasPatch({ title: 'A' })).toBe(true);
    });
});

describe('cloneSnapshot', () => {
    it('returns a copy that does not alias the source', () => {
        const source = { rows: [{ female_count: 1 }] };
        const copy = cloneSnapshot(source);

        copy.rows[0].female_count = 99;

        expect(source.rows[0].female_count).toBe(1);
    });
});
