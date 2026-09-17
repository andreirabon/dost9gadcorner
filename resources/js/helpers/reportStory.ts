import type { FundingGroupMetricTotals, FundingGroupStats } from '@/composables/useFundingGroup';
import { formatCompactCurrency } from '@/helpers/formatCurrency';
import { formatNumber } from '@/helpers/formatNumber';
import type { FundingCategorySummaryData, ScholarshipSummaryData } from '@/types/reports';

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
 * Joins labels the way a sentence lists them: `A`, `A and B`, `A, B and C`.
 */
const joinLabels = (labels: string[]): string =>
    labels.length <= 1 ? (labels[0] ?? '') : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;

/**
 * The largest row of a set, as a sentence built by the caller's template.
 *
 * A tie is reported as a tie. Naming only the first of two equal rows would
 * print a superlative that is not true — "attendance peaked in the 1st
 * Assembly" when the 2nd drew exactly as many — so every row at the highest
 * total is named, and the template is told it is phrasing a tie.
 *
 * @param template Receives the leading label (or labels, joined), the
 *                 formatted combined total, and whether more than one row
 *                 shares that total.
 */
export const peakRowTakeaway = (rows: SexRow[], template: (label: string, total: string, tied: boolean) => string): string | null => {
    const highest = rows.reduce((max, row) => Math.max(max, row.female + row.male), 0);

    if (highest === 0) {
        return null;
    }

    const leaders = rows.filter((row) => row.female + row.male === highest).map((row) => row.label);

    return template(joinLabels(leaders), formatNumber(highest), leaders.length > 1);
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

/**
 * How the scholar count and the women's share moved between the earliest and
 * the latest dated snapshot.
 *
 * Undated snapshots are left out: the history sorts them last, so treating one
 * as "earliest" would describe a change over a period nobody recorded.
 */
export const scholarHistoryTakeaway = (history: ScholarshipSummaryData[]): string | null => {
    const dated = history.filter((snapshot) => snapshot.asOfDate !== null);

    if (dated.length < 2) {
        return null;
    }

    // Newest first, as the relation orders them.
    const latest = dated[0];
    const earliest = dated[dated.length - 1];
    const latestTotal = latest.femaleCount + latest.maleCount;
    const earliestTotal = earliest.femaleCount + earliest.maleCount;

    if (latestTotal === 0 && earliestTotal === 0) {
        return null;
    }

    const movement =
        latestTotal === earliestTotal
            ? `held at ${formatNumber(latestTotal)}`
            : `${latestTotal > earliestTotal ? 'rose' : 'fell'} from ${formatNumber(earliestTotal)} to ${formatNumber(latestTotal)}`;

    const sentences = [`Scholars ${movement} between ${earliest.asOfDate} and ${latest.asOfDate}.`];

    if (earliestTotal > 0 && latestTotal > 0) {
        const from = share(earliest.femaleCount, earliestTotal);
        const to = share(latest.femaleCount, latestTotal);

        sentences.push(from === to ? `Women's share held at ${to}%.` : `Women's share went from ${from}% to ${to}%.`);
    }

    return sentences.join(' ');
};

/** Plural nouns for the jobs breakdown groups, in the order the heatmap draws them. */
const JOBS_BREAKDOWN_GROUPS = [
    { key: 'jobsPwd', noun: 'persons with disabilities' },
    { key: 'jobsSeniorCitizen', noun: 'senior citizens' },
    { key: 'jobsIp', noun: 'Indigenous Peoples' },
    { key: 'jobs4ps', noun: '4Ps beneficiaries' },
] as const;

/**
 * The jobs held by each priority group, stated one group at a time.
 *
 * These groups overlap — one worker can be a senior citizen and a 4Ps
 * beneficiary at once — so they are never added together or ranked against
 * each other. Each count is summed across categories only within its own
 * group, and the sentence says the groups overlap.
 */
export const jobsBreakdownTakeaway = (categories: FundingCategorySummaryData[]): string | null => {
    const parts = JOBS_BREAKDOWN_GROUPS.map((group) => ({
        noun: group.noun,
        count: categories.reduce((sum, category) => sum + (category[group.key] ?? 0), 0),
    }))
        .filter((group) => group.count > 0)
        .map((group, index) => `${formatNumber(group.count)} ${index === 0 ? 'went ' : ''}to ${group.noun}`);

    if (parts.length === 0) {
        return null;
    }

    return `Of the jobs generated, ${joinLabels(parts)}. Groups overlap, so these are not added together.`;
};
