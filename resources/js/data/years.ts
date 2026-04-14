import type { YearItem } from '@/types';

export const years: Readonly<YearItem[]> = [
    {
        id: 1,
        year: '2025',
        href: '#', // Replace with real route when available
        colorTheme: 'violet' as const,
        description:
            '2025 sex-disaggregated indicators for DOST Region IX—workforce, RSTL services, and SETUP and CEST programs—supporting evidence-based gender and development planning.',
    },
    {
        id: 2,
        year: '2026',
        href: '#',
        colorTheme: 'indigo' as const,
        description: '2026 report: figures are not available yet. This page will be updated as soon as validated annual data is ready.',
    },
];
