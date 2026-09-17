import { describe, expect, it } from 'vitest';
import {
    fundingGroupLead,
    jobsBreakdownTakeaway,
    joinTakeaways,
    peakRowTakeaway,
    percentage,
    scholarHistoryTakeaway,
    sexShareTakeaway,
    yearSummaryLead,
} from './reportStory';

describe('joinTakeaways', () => {
    it('joins the sentences that could be stated', () => {
        expect(joinTakeaways(['Permanent is the largest group (112).', null, 'Women are 52.3% of all employees.'])).toBe(
            'Permanent is the largest group (112). Women are 52.3% of all employees.',
        );
    });

    it('returns null when no sentence survived', () => {
        expect(joinTakeaways([null, null])).toBeNull();
    });
});

describe('percentage', () => {
    it('rounds to one decimal', () => {
        expect(percentage(22, 38)).toBe(57.9);
    });

    it('returns zero rather than NaN when the total is zero', () => {
        expect(percentage(0, 0)).toBe(0);
    });
});

describe('sexShareTakeaway', () => {
    it('names the larger group with its share and counts', () => {
        expect(sexShareTakeaway('GFPS members', 22, 16)).toBe('Women make up 57.9% of GFPS members (22 of 38).');
    });

    it('names men when they are the larger group', () => {
        expect(sexShareTakeaway('GFPS members', 16, 22)).toBe('Men make up 57.9% of GFPS members (22 of 38).');
    });

    it('calls a near-even split even rather than reporting a majority', () => {
        expect(sexShareTakeaway('on-going scholars', 51, 49)).toBe('On-going scholars are nearly even by sex — 51.0% women, 49.0% men.');
    });

    it('keeps an acronym subject uppercase at the start of a parity sentence', () => {
        expect(sexShareTakeaway('RSTL customers', 50, 50)).toBe('RSTL customers are nearly even by sex — 50.0% women, 50.0% men.');
    });

    it('says nothing when nothing was recorded', () => {
        expect(sexShareTakeaway('GFPS members', 0, 0)).toBeNull();
    });

    it('groups thousands in the counts', () => {
        expect(sexShareTakeaway('RSTL customers', 3000, 1000)).toBe('Women make up 75.0% of RSTL customers (3,000 of 4,000).');
    });
});

describe('peakRowTakeaway', () => {
    const template = (label: string, total: string, tied: boolean): string =>
        tied ? `Attendance was highest in ${label}, with ${total} each.` : `Attendance peaked in ${label} with ${total} participants.`;

    it('reports the row with the highest combined total', () => {
        const rows = [
            { label: 'Q1', female: 10, male: 5 },
            { label: 'Q3', female: 40, male: 24 },
            { label: 'Q4', female: 12, male: 3 },
        ];

        expect(peakRowTakeaway(rows, template)).toBe('Attendance peaked in Q3 with 64 participants.');
    });

    it('reports a tie as a tie instead of naming only the first row', () => {
        // The real 2026 GFPS data: 1st and 2nd Assembly both drew 25.
        const rows = [
            { label: '1st Assembly', female: 20, male: 5 },
            { label: '2nd Assembly', female: 20, male: 5 },
            { label: '3rd Quarter', female: 14, male: 3 },
        ];

        expect(peakRowTakeaway(rows, template)).toBe('Attendance was highest in 1st Assembly and 2nd Assembly, with 25 each.');
    });

    it('lists a three-way tie the way a sentence would', () => {
        const rows = [
            { label: 'Q1', female: 5, male: 5 },
            { label: 'Q2', female: 5, male: 5 },
            { label: 'Q3', female: 5, male: 5 },
        ];

        expect(peakRowTakeaway(rows, template)).toBe('Attendance was highest in Q1, Q2 and Q3, with 10 each.');
    });

    it('says nothing for an empty set', () => {
        expect(peakRowTakeaway([], template)).toBeNull();
    });

    it('says nothing when every row is zero, which means nothing was entered', () => {
        expect(peakRowTakeaway([{ label: 'Q1', female: 0, male: 0 }], template)).toBeNull();
    });
});

describe('fundingGroupLead', () => {
    // SETUP's real 2026 figures, summed from program_funding_summaries.
    const setup = {
        label: 'SETUP',
        year: '2026',
        stats: { totalProjects: 59, totalAmount: 8021344.3, maleProjects: 33, femaleProjects: 26 },
        metrics: { fundedProjects: 59, fundedValue: 7602450.31, trainingParticipants: 177, jobsGenerated: 348, hasData: true },
    };

    it('opens with what was funded, then what was recorded against it', () => {
        expect(fundingGroupLead(setup)).toEqual([
            'SETUP funded 59 projects in 2026 worth ₱8.02M.',
            'SETUP recorded 348 jobs generated and 177 training participants for the year.',
        ]);
    });

    it('keeps the same shape for another family', () => {
        const [first] = fundingGroupLead({
            ...setup,
            label: 'GIA',
            stats: { totalProjects: 100, totalAmount: 11725705.26, maleProjects: 54, femaleProjects: 46 },
        });

        expect(first).toBe('GIA funded 100 projects in 2026 worth ₱11.7M.');
    });

    it('never states the female-led share, which belongs to its own metric card', () => {
        expect(fundingGroupLead(setup).join(' ')).not.toContain('Female-led');
    });

    it('drops the value clause when no amount was recorded', () => {
        const [first] = fundingGroupLead({ ...setup, stats: { ...setup.stats, totalAmount: 0 } });

        expect(first).toBe('SETUP funded 59 projects in 2026.');
    });

    it('names only the outcome that was recorded', () => {
        const sentences = fundingGroupLead({
            ...setup,
            metrics: { ...setup.metrics, trainingParticipants: 0 },
        });

        expect(sentences[1]).toBe('SETUP recorded 348 jobs generated for the year.');
    });

    it('omits the outcome sentence when neither jobs nor training were recorded', () => {
        const sentences = fundingGroupLead({
            ...setup,
            metrics: { fundedProjects: 0, fundedValue: 0, trainingParticipants: 0, jobsGenerated: 0, hasData: false },
        });

        expect(sentences).toHaveLength(1);
    });

    it('says nothing at all for a family with no projects', () => {
        const sentences = fundingGroupLead({
            ...setup,
            stats: { totalProjects: 0, totalAmount: 0, maleProjects: 0, femaleProjects: 0 },
            metrics: { fundedProjects: 0, fundedValue: 0, trainingParticipants: 0, jobsGenerated: 0, hasData: false },
        });

        expect(sentences).toEqual([]);
    });
});

describe('scholarHistoryTakeaway', () => {
    const snapshot = (asOfDate: string | null, femaleCount: number, maleCount: number) => ({
        id: 1,
        schoolYearLabel: 'SY 2025-2026',
        asOfDate,
        femaleCount,
        maleCount,
    });

    it('states how the count and the women’s share moved, oldest to newest', () => {
        // Newest first, as the relation orders them.
        const history = [snapshot('2026-06-30', 140, 88), snapshot('2025-06-30', 120, 90)];

        expect(scholarHistoryTakeaway(history)).toBe(
            "Scholars rose from 210 to 228 between 2025-06-30 and 2026-06-30. Women's share went from 57.1% to 61.4%.",
        );
    });

    it('says the count fell when it fell', () => {
        const history = [snapshot('2026-06-30', 50, 50), snapshot('2025-06-30', 60, 60)];

        expect(scholarHistoryTakeaway(history)).toContain('Scholars fell from 120 to 100');
    });

    it('says the count and share held when nothing moved', () => {
        const history = [snapshot('2026-06-30', 60, 40), snapshot('2025-06-30', 60, 40)];

        expect(scholarHistoryTakeaway(history)).toBe("Scholars held at 100 between 2025-06-30 and 2026-06-30. Women's share held at 60.0%.");
    });

    it('ignores undated snapshots rather than treating one as the earliest', () => {
        const history = [snapshot('2026-06-30', 60, 40), snapshot(null, 1, 1)];

        expect(scholarHistoryTakeaway(history)).toBeNull();
    });

    it('says nothing with fewer than two snapshots', () => {
        expect(scholarHistoryTakeaway([snapshot('2026-06-30', 60, 40)])).toBeNull();
    });
});

describe('jobsBreakdownTakeaway', () => {
    const category = (overrides: Record<string, number> = {}) => ({
        label: 'SETUP ZSP',
        slug: 'setup-zsp',
        maleProjects: 0,
        maleAmount: 0,
        femaleProjects: 0,
        femaleAmount: 0,
        ...overrides,
    });

    it('states each group on its own, summed across categories within that group only', () => {
        const categories = [category({ jobsPwd: 2, jobsSeniorCitizen: 3, jobs4ps: 4 }), category({ jobsPwd: 1, jobsIp: 5 })];

        expect(jobsBreakdownTakeaway(categories)).toBe(
            'Of the jobs generated, 3 went to persons with disabilities, 3 to senior citizens, 5 to Indigenous Peoples and 4 to 4Ps beneficiaries. Groups overlap, so these are not added together.',
        );
    });

    it('leaves out a group with nothing recorded', () => {
        expect(jobsBreakdownTakeaway([category({ jobsIp: 7 })])).toBe(
            'Of the jobs generated, 7 went to Indigenous Peoples. Groups overlap, so these are not added together.',
        );
    });

    it('never prints a combined total across groups', () => {
        const sentence = jobsBreakdownTakeaway([category({ jobsPwd: 2, jobsSeniorCitizen: 3 })]) ?? '';

        expect(sentence).not.toContain('5');
    });

    it('says nothing when no group was recorded', () => {
        expect(jobsBreakdownTakeaway([category()])).toBeNull();
    });
});

describe('yearSummaryLead', () => {
    it('leads with reach and the women’s share, then the funding sentence', () => {
        const sentences = yearSummaryLead({ year: '2026', female: 1850, male: 1562, projects: 87, fundingAmount: 42100000 });

        expect(sentences).toEqual([
            'In 2026, DOST IX recorded 3,412 people across GFPS, employees, scholars and RSTL customers — 54.2% of them women.',
            'SETUP, CEST and GIA together funded 87 projects worth ₱42.1M.',
        ]);
    });

    it('shortens the amount so the sentence stays readable', () => {
        const sentences = yearSummaryLead({ year: '2026', female: 1, male: 1, projects: 223, fundingAmount: 29488840.48 });

        expect(sentences[1]).toBe('SETUP, CEST and GIA together funded 223 projects worth ₱29.5M.');
    });

    it('drops the value clause when projects were recorded without an amount', () => {
        const sentences = yearSummaryLead({ year: '2026', female: 1, male: 1, projects: 5, fundingAmount: 0 });

        expect(sentences[1]).toBe('SETUP, CEST and GIA together funded 5 projects.');
    });

    it('drops the funding sentence when no projects were recorded', () => {
        const sentences = yearSummaryLead({ year: '2026', female: 10, male: 10, projects: 0, fundingAmount: 0 });

        expect(sentences).toHaveLength(1);
    });

    it('returns nothing at all for a year with no figures', () => {
        expect(yearSummaryLead({ year: '2026', female: 0, male: 0, projects: 0, fundingAmount: 0 })).toEqual([]);
    });
});
