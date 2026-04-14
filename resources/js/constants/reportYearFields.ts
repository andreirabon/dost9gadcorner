/** Matches `report_years` + `StoreReportYearRequest` / `UpdateReportYearRequest` rules */
export const REPORT_YEAR_FIELD_LIMITS = {
    title: 255,
    description: 4000,
    yearMin: 2000,
    yearMax: 2100,
} as const;
