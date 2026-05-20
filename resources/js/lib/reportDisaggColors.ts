/**
 * Sex-disaggregated report colors (series A / B).
 * True neutrals: cool slate gray (light vs dark contrast).
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

const DISAGG_DARK: ReportDisaggPalette = {
    female: SLATE_LIGHT,
    male: SLATE_GRAY,
    femaleSoft: SLATE_HINT,
    maleSoft: SLATE_MID,
    stroke: ['#94a3b8', '#334155'],
};

const DISAGG_LIGHT: ReportDisaggPalette = {
    female: SLATE_LIGHT,
    male: SLATE_GRAY,
    femaleSoft: SLATE_HINT,
    maleSoft: SLATE_MID,
    stroke: ['#64748b', '#1e293b'],
};

export function reportDisaggPalette(appearance: 'light' | 'dark'): ReportDisaggPalette {
    return appearance === 'light' ? DISAGG_LIGHT : DISAGG_DARK;
}

/** @deprecated Use reportDisaggPalette(appearance) for theme-aware charts */
export const REPORT_CHART_SEX_COLORS = {
    female: DISAGG_DARK.female,
    male: DISAGG_DARK.male,
    femaleSoft: DISAGG_DARK.femaleSoft,
    maleSoft: DISAGG_DARK.maleSoft,
} as const;

export const REPORT_CHART_STROKE_COLORS = DISAGG_DARK.stroke;
