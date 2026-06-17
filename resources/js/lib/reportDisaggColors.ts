/**
 * Sex-disaggregated report colors (series A / B).
 * Cool slate gray palette for light report charts.
 * ApexCharts needs hex; values align with --report-disagg-* in app.css.
 */
export type ReportDisaggPalette = {
    /** Series A (Female in data labels) — light slate */
    female: string;
    /** Series B (Male in data labels) — slate gray */
    male: string;
    /** Non-binary — silver/grey */
    nonBinary: string;
    /** Genderqueer — darker grey */
    genderqueer: string;
    femaleSoft: string;
    maleSoft: string;
    nonBinarySoft: string;
    genderqueerSoft: string;
    stroke: readonly [string, string, string, string];
};

/** Slate 400 — lighter series */
const SLATE_LIGHT = '#94a3b8';
/** Slate 700 — primary slate gray anchor */
const SLATE_GRAY = '#334155';
/** Slate 300 — stacked / soft A */
const SLATE_HINT = '#cbd5e1';
/** Slate 500 — stacked / soft B */
const SLATE_MID = '#64748b';
/** Zinc 300 — silver */
const SILVER = '#d4d4d8';
/** Zinc 500 — mid grey */
const GREY = '#71717a';
/** Zinc 200 — silver soft */
const SILVER_SOFT = '#e4e4e7';
/** Zinc 400 — grey soft */
const GREY_SOFT = '#a1a1aa';

const DISAGG_LIGHT: ReportDisaggPalette = {
    female: SLATE_LIGHT,
    male: SLATE_GRAY,
    nonBinary: SILVER,
    genderqueer: GREY,
    femaleSoft: SLATE_HINT,
    maleSoft: SLATE_MID,
    nonBinarySoft: SILVER_SOFT,
    genderqueerSoft: GREY_SOFT,
    stroke: ['#64748b', '#1e293b', '#a1a1aa', '#52525b'],
};

export function reportDisaggPalette(_appearance?: 'light'): ReportDisaggPalette {
    return DISAGG_LIGHT;
}

/** @deprecated Use reportDisaggPalette() */
export const REPORT_CHART_SEX_COLORS = {
    female: DISAGG_LIGHT.female,
    male: DISAGG_LIGHT.male,
    nonBinary: DISAGG_LIGHT.nonBinary,
    genderqueer: DISAGG_LIGHT.genderqueer,
    femaleSoft: DISAGG_LIGHT.femaleSoft,
    maleSoft: DISAGG_LIGHT.maleSoft,
    nonBinarySoft: DISAGG_LIGHT.nonBinarySoft,
    genderqueerSoft: DISAGG_LIGHT.genderqueerSoft,
} as const;

export const REPORT_CHART_STROKE_COLORS = DISAGG_LIGHT.stroke;
