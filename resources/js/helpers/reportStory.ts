import type { FundingGroupMetricTotals, FundingGroupStats } from '@/composables/useFundingGroup';
import { formatCompactCurrency } from '@/helpers/formatCurrency';
import { formatNumber } from '@/helpers/formatNumber';

/**
 * Sentences that state what a report chart shows, computed from the same
 * figures the chart plots.
 *
 * Every function here returns `null` when nothing was recorded. The columns
 * default to zero in the schema, so an all-zero set means "never entered", not
 * "measured as none" — and a report published by a government agency must not
 * assert a finding nobody recorded. The caller renders the chart unchanged when
 * the sentence is null.
 *
 * Sentences state a fact and never a cause: "Women make up 57.9% of GFPS
 * members", never "GFPS attracts women".
 */

/** Female shares inside this band read as parity rather than as a majority. */
const PARITY_LOWER_BOUND = 45;

const PARITY_UPPER_BOUND = 55;

export interface SexRow {
    label: string;
    female: number;
    male: number;
}

export interface YearSummaryInput {
    year: string;
    female: number;
    male: number;
    projects: number;
    fundingAmount: number;
}

/** Share of a total, to one decimal. Zero total reads as 0 rather than NaN. */
export const percentage = (value: number, total: number): number => {
    if (total === 0) {
        return 0;
    }

    return Number(((value / total) * 100).toFixed(1));
};

const share = (value: number, total: number): string => percentage(value, total).toFixed(1);

/**
 * Uppercases the first character only, so a subject that opens a sentence reads
 * correctly without flattening an acronym: `RSTL customers` survives intact.
 */
const capitaliseFirst = (subject: string): string => subject.charAt(0).toUpperCase() + subject.slice(1);

/**
 * The sex split of one group, as a sentence.
 *
 * A split inside the parity band is reported as near-even with both shares: a
 * 51/49 result is not a finding, and calling it one overstates the data.
 *
 * @param subject Plural noun phrase for the group, e.g. `GFPS members`.
 */
export const sexShareTakeaway = (subject: string, female: number, male: number): string | null => {
    const total = female + male;

    if (total === 0) {
        return null;
    }

    const femaleShare = percentage(female, total);

    if (femaleShare >= PARITY_LOWER_BOUND && femaleShare <= PARITY_UPPER_BOUND) {
        return `${capitaliseFirst(subject)} are nearly even by sex — ${share(female, total)}% women, ${share(male, total)}% men.`;
    }

    const womenLead = female > male;
    const group = womenLead ? 'Women' : 'Men';
    const count = womenLead ? female : male;

    return `${group} make up ${share(count, total)}% of ${subject} (${formatNumber(count)} of ${formatNumber(total)}).`;
};

/**
 * The largest row of a set, as a sentence built by the caller's template.
 *
 * Ties resolve to the first row in input order, which is the order the rows are
 * already sorted in for display — so the sentence names the earlier month or
 * quarter rather than an arbitrary one.
 *
 * @param template Receives the row label and its formatted combined total.
 */
export const peakRowTakeaway = (rows: SexRow[], template: (label: string, total: string) => string): string | null => {
    const peak = rows.reduce<SexRow | null>((best, row) => (best === null || row.female + row.male > best.female + best.male ? row : best), null);

    if (peak === null) {
        return null;
    }

    const total = peak.female + peak.male;

    if (total === 0) {
        return null;
    }

    return template(peak.label, formatNumber(total));
};

/**
 * Joins the sentences a block can state into one takeaway, dropping the ones
 * its figures cannot support. Null when none survive, so a block with nothing
 * to say renders its plain head.
 */
export const joinTakeaways = (parts: (string | null)[]): string | null => {
    const kept = parts.filter((part): part is string => part !== null);

    return kept.length > 0 ? kept.join(' ') : null;
};

export interface FundingGroupLeadInput {
    /** Short program name, e.g. `SETUP`. */
    label: string;
    year: string;
    stats: FundingGroupStats;
    metrics: FundingGroupMetricTotals;
}

/**
 * The opening lines for one funding family's tab: how much it funded, and what
 * was recorded against it.
 *
 * Deliberately the same two-sentence shape for SETUP, CEST and GIA, so a
 * reader who has read one tab already knows how to read the next two.
 *
 * The amount is `stats.totalAmount` (male + female project amounts). Note that
 * these tabs also carry `metrics.fundedValue` under its own "Value Funded"
 * card, and the two do not agree — on CEST 2026 the second is ₱5.37M larger
 * than the first, while on SETUP and GIA it is smaller. Only the first is ever
 * named in a sentence here, so the two are never conflated.
 *
 * Each sentence is dropped when its own figures are absent, so a partly
 * recorded family still opens with whatever it can honestly state.
 */
export const fundingGroupLead = ({ label, year, stats, metrics }: FundingGroupLeadInput): string[] => {
    const sentences: string[] = [];

    if (stats.totalProjects > 0) {
        const worth = stats.totalAmount > 0 ? ` worth ${formatCompactCurrency(stats.totalAmount)}` : '';

        sentences.push(`${label} funded ${formatNumber(stats.totalProjects)} projects in ${year}${worth}.`);
    }

    /*
     * Jobs and training are counted per funding program for the year, so they
     * are reported as recorded against the family rather than as caused by the
     * projects above — the data supports the count, not the causation.
     */
    const outcomes: string[] = [];

    if (metrics.jobsGenerated > 0) {
        outcomes.push(`${formatNumber(metrics.jobsGenerated)} jobs generated`);
    }

    if (metrics.trainingParticipants > 0) {
        outcomes.push(`${formatNumber(metrics.trainingParticipants)} training participants`);
    }

    if (outcomes.length > 0) {
        sentences.push(`${label} recorded ${outcomes.join(' and ')} for the year.`);
    }

    return sentences;
};

/**
 * The year's opening lines: total reach and sex split, then funding when any
 * was recorded. Either sentence is dropped when its own figures are absent, so
 * a partly filled year still opens with whatever it can honestly say.
 */
export const yearSummaryLead = ({ year, female, male, projects, fundingAmount }: YearSummaryInput): string[] => {
    const people = female + male;
    const sentences: string[] = [];

    if (people > 0) {
        sentences.push(
            `In ${year}, DOST IX recorded ${formatNumber(people)} people across GFPS, employees, scholars and RSTL customers — ${share(
                female,
                people,
            )}% of them women.`,
        );
    }

    /*
     * Shortened to keep the sentence readable: ₱29.5M lands where
     * ₱29,488,840.48 stalls the reader mid-line. The exact figure sits on the
     * "Combined Funding" card directly below, so nothing is lost by rounding.
     *
     * Projects recorded without an amount still get their sentence, minus the
     * value clause — the count is the finding, and ₱0 would assert a figure
     * nobody entered.
     */
    if (projects > 0) {
        const worth = fundingAmount > 0 ? ` worth ${formatCompactCurrency(fundingAmount)}` : '';

        sentences.push(`SETUP, CEST and GIA together funded ${formatNumber(projects)} projects${worth}.`);
    }

    return sentences;
};
