export type TabType = 'Overview' | 'GFPS' | 'DOST IX Employees' | 'Scholarship' | 'RSTL' | 'SETUP' | 'CEST';

export const REPORT_TABS: TabType[] = ['Overview', 'GFPS', 'DOST IX Employees', 'Scholarship', 'RSTL', 'SETUP', 'CEST'];

/** Shared id contract between the tab-nav buttons (`aria-controls`) and the single dynamic tabpanel they point to. */
export const REPORT_TABPANEL_ID = 'report-tabpanel';

export const isValidReportTab = (value: string): value is TabType => REPORT_TABS.includes(value as TabType);

export const reportTabSlug = (tab: TabType): string => tab.toLowerCase().replace(/\s+/g, '-');
