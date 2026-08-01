export interface GfpsMembershipData {
    femaleCount: number;
    maleCount: number;
}

export interface GfpsAssemblyDataRow {
    label: string;
    female: number;
    male: number;
}

export interface EmployeeStatusDataRow {
    label: string;
    female: number;
    male: number;
}

export interface ScholarshipSummaryData {
    id: number | null;
    schoolYearLabel: string;
    asOfDate: string | null;
    femaleCount: number;
    maleCount: number;
}

export interface EditableScholarshipSummary {
    schoolYearId: number | null;
    asOfDate: string | null;
    femaleCount: number;
    maleCount: number;
}

export interface ScholarshipSnapshot {
    id: number;
    schoolYearId: number | null;
    schoolYearLabel: string;
    asOfDate: string | null;
    femaleCount: number;
    maleCount: number;
    createdAt: string | null;
    updatedAt: string | null;
    lastEditedBy: string | null;
    lastEditedAt: string | null;
}

export interface LookupSchoolYear {
    id: number;
    label: string;
}

export interface RstlMonthlyDataRow {
    label: string;
    female: number;
    femaleLed: number;
    male: number;
    maleLed: number;
}

export interface FundingSummaryData {
    maleProjects: number;
    maleAmount: number;
    femaleProjects: number;
    femaleAmount: number;
}

export interface FundingCategorySummaryData extends FundingSummaryData {
    label: string;
    slug: string;
}

export interface ReportYearData {
    gfpsMembership: GfpsMembershipData;
    gfpsAssemblies: GfpsAssemblyDataRow[];
    employeeStatuses: EmployeeStatusDataRow[];
    scholarship: ScholarshipSummaryData;
    scholarshipHistory: ScholarshipSummaryData[];
    rstlMonthly: RstlMonthlyDataRow[];
    setupFunding: FundingSummaryData;
    cestFunding: FundingSummaryData;
    setupFundingBreakdown: FundingCategorySummaryData[];
    cestFundingBreakdown: FundingCategorySummaryData[];
}

export interface EditableGfpsAssemblyRow {
    periodId: number;
    label: string;
    femaleCount: number;
    maleCount: number;
}

export interface EditableEmployeeStatusRow {
    employmentStatusId: number;
    label: string;
    femaleCount: number;
    maleCount: number;
}

export interface EditableRstlMonthlyRow {
    reportMonthId: number;
    label: string;
    femaleCount: number;
    femaleLedCount: number;
    maleCount: number;
    maleLedCount: number;
}

export interface EditableProgramFundingRow {
    fundingProgramId: number;
    label: string;
    slug: string;
    femaleProjects: number;
    femaleAmount: number;
    maleProjects: number;
    maleAmount: number;
}

export interface ReportYearEditAbilities {
    updateFullReport: boolean;
    updateMetadata: boolean;
    updateGfpsMembership: boolean;
    updateGfpsAssemblies: boolean;
    updateScholarship: boolean;
    deleteScholarship: boolean;
    updateEmployeeStatuses: boolean;
    updateRstlMonthly: boolean;
    updateProgramFunding: boolean;
    toggleLock: boolean;
}

export interface EditableReportYear {
    id: number;
    year: number;
    title: string | null;
    description: string | null;
    status: 'pending' | 'published';
    publishedAt: string | null;
    /** Optional cover/thumbnail URL for admin header; omit or null uses placeholder */
    coverImageUrl?: string | null;
    gfpsMembership: GfpsMembershipData;
    gfpsAssemblies: EditableGfpsAssemblyRow[];
    employeeStatuses: EditableEmployeeStatusRow[];
    scholarshipSnapshots: ScholarshipSnapshot[];
    rstlMonthly: EditableRstlMonthlyRow[];
    programFunding: EditableProgramFundingRow[];
    /**
     * Funding program slugs this user may edit, or null when unrestricted.
     * Presentation only — the server rejects out-of-scope writes regardless.
     */
    editableFundingSlugs: string[] | null;
    isLocked: boolean;
}

/**
 * Which data sections of a report year already hold rows. Drives the coverage
 * markers on the report-years index so a year's remaining data entry is
 * visible without opening it.
 */
export interface ReportYearSectionCoverage {
    employees: boolean;
    assembly: boolean;
    membership: boolean;
    funding: boolean;
    rstl: boolean;
    scholarships: boolean;
}

export interface ManagedReportYearListItem {
    id: number;
    year: number;
    title: string | null;
    description: string | null;
    status: 'pending' | 'published';
    publishedAt: string | null;
    isLocked: boolean;
    sections: ReportYearSectionCoverage;
}

export interface SectionTimestamps {
    metadata: string | null;
    gfpsMembership: string | null;
    gfpsAssemblies: string | null;
    employeeStatuses: string | null;
    scholarship: string | null;
    rstlMonthly: string | null;
    programFunding: string | null;
}
