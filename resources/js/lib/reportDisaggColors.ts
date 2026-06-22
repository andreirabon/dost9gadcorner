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
    femaleSoft: string;
    maleSoft: string;
    stroke: readonly [string, string];
};

/** Slate 400 — lighter series */
const SLATE_LIGHT = '#94a3b8';
/** Slate 700 — primary slate gray anchor */
const SLATE_GRAY = '#334155';
/** Slate 300 — stacked / soft A */
const SLATE_HINT = '#cbd5e1';
/** Slate 500 — stacked / soft B */
const SLATE_MID = '#64748b';

const DISAGG_LIGHT: ReportDisaggPalette = {
    female: SLATE_LIGHT,
    male: SLATE_GRAY,
    femaleSoft: SLATE_HINT,
    maleSoft: SLATE_MID,
    stroke: ['#64748b', '#1e293b'],
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
