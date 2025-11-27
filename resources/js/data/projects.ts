import type { ProjectItem } from '../types';

export const projects: Readonly<ProjectItem[]> = [
    {
        id: 1,
        name: 'Grants-In-Aid (GIA)',
        href: '#', // Replace with real route when available
        colorTheme: 'emerald' as const,
        description:
            'Financial assistance program for science and technology projects that promote gender equality and women empowerment in various sectors.',
        backgroundImage: '/svg/gia.jpg',
    },
    {
        id: 2,
        name: 'Small Enterprises Technology Upgrading (SETUP)',
        href: '#', // Replace with real route when available
        colorTheme: 'blue' as const,
        description: 'Technology upgrading program for small enterprises, with special focus on women-led businesses and gender-inclusive practices.',
        backgroundImage: '/svg/setup1.svg',
    },
    {
        id: 3,
        name: 'Community Enhancement through Science and Technology (CEST)',
        href: '#', // Replace with real route when available
        colorTheme: 'orange' as const,
        description:
            'Community-based science and technology initiatives that address gender gaps and promote inclusive development at the grassroots level.',
        backgroundImage: '/svg/cest.jpg',
    },
    {
        id: 4,
        name: 'Smart and Sustainable Communities Program (SSCP)',
        href: '#', // Replace with real route when available
        colorTheme: 'rose' as const,
        description: 'Sustainable development program integrating smart technologies with gender-responsive approaches for community resilience.',
        backgroundImage: '/svg/development2.svg',
    },
    {
        id: 5,
        name: 'S&T Undergraduate Scholarships',
        href: '#', // Replace with real route when available
        colorTheme: 'purple' as const,
        description: 'Scholarships encouraging Filipino youth to pursue careers in science and technology and build a qualified S&T workforce.',
        backgroundImage: '/svg/development2.svg',
    },
    {
        id: 6,
        name: 'Regional Standards and Testing Laboratory (RSTL)',
        href: '#', // Replace with real route when available
        colorTheme: 'teal' as const,
        description:
            'Provides accredited testing, calibration, and conformity assessment services to ensure product safety, quality, and regulatory compliance.',
        backgroundImage: '/svg/development2.svg',
    },
];
