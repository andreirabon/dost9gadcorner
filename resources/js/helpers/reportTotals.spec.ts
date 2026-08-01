import { describe, expect, it } from 'vitest';
import { sumFields } from './reportTotals';

describe('sumFields', () => {
    it('adds the named fields on a single row', () => {
        expect(sumFields({ female_count: 4, male_count: 3 }, ['female_count', 'male_count'])).toBe(7);
    });

    it('treats a blank cell as zero rather than returning NaN', () => {
        expect(sumFields({ female_count: '', male_count: 5 }, ['female_count', 'male_count'])).toBe(5);
    });

    it('coerces the numeric strings that inputs hand back', () => {
        expect(sumFields({ female_count: '12', male_count: '8' }, ['female_count', 'male_count'])).toBe(20);
    });

    it('ignores fields that are absent from the row', () => {
        expect(sumFields({ female_count: 6 }, ['female_count', 'male_count'])).toBe(6);
    });

    it('returns zero when no fields are requested', () => {
        expect(sumFields({ female_count: 6 }, [])).toBe(0);
    });
});
