import type { LucideIcon } from '@lucide/vue';
import type { Config } from 'ziggy-js';
import type { ReportYearData } from './reports';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    isActive?: boolean;
}

export interface ProjectItem {
    id: number;
    name: string;
    href: string;
    colorTheme?: 'emerald' | 'blue' | 'orange' | 'rose' | 'purple' | 'teal';
    description?: string;
    backgroundImage?: string;
}

export interface YearItem {
    id: number;
    year: string;
    href: string;
    description?: string;
    status?: 'pending' | 'published';
    reportData?: ReportYearData | null;
}

export type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
};

export type UserRoleSlug = 'none' | 'administrator' | 'gad' | 'scholarship' | 'hr' | 'rstl' | 'tos';

export interface User {
    id: number;
    username: string | null;
    avatar?: string;
    role?: UserRoleSlug;
    can?: {
        accessReportYears?: boolean;
        createReportYears?: boolean;
        deleteReportYears?: boolean;
    };
}

export type BreadcrumbItemType = BreadcrumbItem;
