import type { ProjectItem } from '@/types';

export type ProjectColorTheme = NonNullable<ProjectItem['colorTheme']>;

export interface ProjectThemeClasses {
    border: string;
    bg: string;
    hover: string;
    text: string;
    focus: string;
}

const themeMap: Record<ProjectColorTheme, ProjectThemeClasses> = {
    emerald: {
        border: 'border-emerald-400/60',
        bg: 'bg-emerald-500/80',
        hover: 'from-emerald-400/40 to-emerald-600/30',
        text: 'text-white',
        focus: 'focus-visible:ring-emerald-400',
    },
    blue: {
        border: 'border-blue-400/60',
        bg: 'bg-blue-500/80',
        hover: 'from-blue-400/40 to-blue-600/30',
        text: 'text-white',
        focus: 'focus-visible:ring-blue-400',
    },
    orange: {
        border: 'border-orange-400/60',
        bg: 'bg-orange-400/80',
        hover: 'from-orange-400/40 to-orange-500/30',
        text: 'text-white',
        focus: 'focus-visible:ring-orange-400',
    },
    rose: {
        border: 'border-rose-400/60',
        bg: 'bg-rose-400/80',
        hover: 'from-rose-400/40 to-rose-500/30',
        text: 'text-white',
        focus: 'focus-visible:ring-rose-400',
    },
    teal: {
        border: 'border-teal-400/60',
        bg: 'bg-teal-500/80',
        hover: 'from-teal-400/40 to-teal-600/30',
        text: 'text-white',
        focus: 'focus-visible:ring-teal-400',
    },
    purple: {
        border: 'border-purple-400/60',
        bg: 'bg-purple-500/80',
        hover: 'from-purple-400/40 to-purple-600/30',
        text: 'text-white',
        focus: 'focus-visible:ring-purple-400',
    },
};

export const defaultProjectTheme: ProjectColorTheme = 'purple';

export function getProjectThemeClasses(project: ProjectItem): ProjectThemeClasses {
    const theme = project.colorTheme ?? defaultProjectTheme;
    return themeMap[theme] ?? themeMap[defaultProjectTheme];
}
