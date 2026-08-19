import { describe, expect, it } from 'vitest';
import { formatNumber, formatNumberInput, parseNumberInput } from './formatNumber';

describe('formatNumber', () => {
    it('groups thousands', () => {
        expect(formatNumber(50000.25)).toBe('50,000.25');
        expect(formatNumber(2177208.91)).toBe('2,177,208.91');
        expect(formatNumber(226)).toBe('226');
    });

    it('renders nothing rather than NaN for a non-finite value', () => {
        expect(formatNumber(Number.NaN)).toBe('');
        expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('');
    });
});

describe('formatNumberInput', () => {
    it('groups a complete number, keeping the decimals as typed', () => {
        expect(formatNumberInput('50000.25')).toBe('50,000.25');
        expect(formatNumberInput('50000.5')).toBe('50,000.5');
        expect(formatNumberInput('50000')).toBe('50,000');
    });

    it('leaves a half-typed value alone so the caret does not jump', () => {
        // "50000." is mid-typing: reformatting here would eat the dot.
        expect(formatNumberInput('50000.')).toBe('50000.');
        expect(formatNumberInput('-')).toBe('-');
    });

    it('renders an empty field as empty, not as zero', () => {
        expect(formatNumberInput('')).toBe('');
        expect(formatNumberInput('   ')).toBe('');
    });
});

describe('parseNumberInput', () => {
    it('strips the separators so the model keeps a plain number', () => {
        expect(parseNumberInput('50,000.25')).toBe('50000.25');
        expect(parseNumberInput('2,177,208.91')).toBe('2177208.91');
    });

    it('drops characters that would make the payload non-numeric', () => {
        expect(parseNumberInput('50,000abc')).toBe('50000');
        expect(parseNumberInput('₱50,000.25')).toBe('');
    });

    it('survives a round trip through display and back', () => {
        const raw = '2177208.91';

        expect(parseNumberInput(formatNumberInput(raw))).toBe(raw);
    });

    it('keeps an empty field empty', () => {
        expect(parseNumberInput('')).toBe('');
    });
});
