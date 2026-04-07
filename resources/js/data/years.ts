import type { YearItem } from '@/types';

export const years: Readonly<YearItem[]> = [
    {
        id: 1,
        year: '2025',
        href: '#', // Replace with real route when available
        colorTheme: 'violet' as const,
        description: 'Sex-disaggregated data report for 2025 covering DOST IX employees, RSTL services, SETUP, and CEST programs.',
        backgroundImage: '/svg/reports.svg',
    },
    {
        id: 2,
        year: '2026',
        href: '#',
        colorTheme: 'indigo' as const,
        description: '2026 report: figures are not available yet. This page will be updated as soon as validated annual data is ready.',
        backgroundImage: '/svg/reports.svg',
    },
];
