/**
 * Sex-disaggregated report colors (series A / B).
 * Purple for female, orange for male.
 * ApexCharts needs hex; values align with --report-disagg-* in app.css.
 */
export type ReportDisaggPalette = {
    /** Series A (Female in data labels) — purple */
    female: string;
    /** Series B (Male in data labels) — orange */
    male: string;
    femaleSoft: string;
    maleSoft: string;
    stroke: readonly [string, string];
};

/** Female anchor — purple */
const FEMALE_PURPLE = '#603f8b';
/** Male anchor — orange */
const MALE_ORANGE = '#ff8210';
/** Stacked / soft female — tinted purple */
const FEMALE_PURPLE_SOFT = '#9b83bd';
/** Stacked / soft male — tinted orange */
const MALE_ORANGE_SOFT = '#ffb673';

const DISAGG_LIGHT: ReportDisaggPalette = {
    female: FEMALE_PURPLE,
    male: MALE_ORANGE,
    femaleSoft: FEMALE_PURPLE_SOFT,
    maleSoft: MALE_ORANGE_SOFT,
    stroke: ['#452c66', '#c25f00'],
};

export function reportDisaggPalette(_appearance?: 'light'): ReportDisaggPalette {
    return DISAGG_LIGHT;
}

/** @deprecated Use reportDisaggPalette() */
export const REPORT_CHART_SEX_COLORS = {
    female: DISAGG_LIGHT.female,
    male: DISAGG_LIGHT.male,
    femaleSoft: DISAGG_LIGHT.femaleSoft,
    maleSoft: DISAGG_LIGHT.maleSoft,
} as const;

export const REPORT_CHART_STROKE_COLORS = DISAGG_LIGHT.stroke;
