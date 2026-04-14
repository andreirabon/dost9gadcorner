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
    schoolYearLabel: string;
    asOfDate: string | null;
    femaleCount: number;
    maleCount: number;
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

export interface ReportYearData {
    gfpsMembership: GfpsMembershipData;
    gfpsAssemblies: GfpsAssemblyDataRow[];
    employeeStatuses: EmployeeStatusDataRow[];
    scholarship: ScholarshipSummaryData;
    rstlMonthly: RstlMonthlyDataRow[];
    setupFunding: FundingSummaryData;
    cestFunding: FundingSummaryData;
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

export interface EditableReportYear {
    id: number;
    year: number;
    title: string | null;
    description: string | null;
    status: 'pending' | 'published';
    colorTheme: 'violet' | 'purple' | 'indigo' | null;
    publishedAt: string | null;
    gfpsMembership: GfpsMembershipData;
    gfpsAssemblies: EditableGfpsAssemblyRow[];
    employeeStatuses: EditableEmployeeStatusRow[];
    scholarship: ScholarshipSummaryData;
    rstlMonthly: EditableRstlMonthlyRow[];
    programFunding: EditableProgramFundingRow[];
}

export interface ManagedReportYearListItem {
    id: number;
    year: number;
    title: string | null;
    description: string | null;
    status: 'pending' | 'published';
    colorTheme: 'violet' | 'purple' | 'indigo' | null;
    publishedAt: string | null;
}
