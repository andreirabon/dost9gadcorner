import type { UserRoleSlug } from '@/types';

interface RoleBadgeStyle {
    label: string;
    chipClass: string;
    avatarClass: string;
}

const STYLES: Record<UserRoleSlug, RoleBadgeStyle> = {
    administrator: {
        label: 'Administrator',
        chipClass: 'bg-blue-100 text-blue-800',
        avatarClass: 'bg-blue-600 text-white',
    },
    gad: {
        label: 'GAD',
        chipClass: 'bg-fuchsia-100 text-fuchsia-800',
        avatarClass: 'bg-fuchsia-600 text-white',
    },
    scholarship: {
        label: 'Scholarship',
        chipClass: 'bg-amber-100 text-amber-800',
        avatarClass: 'bg-amber-600 text-white',
    },
    hr: {
        label: 'HR',
        chipClass: 'bg-emerald-100 text-emerald-800',
        avatarClass: 'bg-emerald-600 text-white',
    },
    rstl: {
        label: 'RSTL',
        chipClass: 'bg-cyan-100 text-cyan-800',
        avatarClass: 'bg-cyan-600 text-white',
    },
    tos: {
        label: 'TOS',
        chipClass: 'bg-indigo-100 text-indigo-800',
        avatarClass: 'bg-indigo-600 text-white',
    },
    none: {
        label: 'None',
        chipClass: 'bg-slate-100 text-slate-700',
        avatarClass: 'bg-slate-500 text-white',
    },
};

const FALLBACK: RoleBadgeStyle = STYLES.none;

export function roleBadge(role: UserRoleSlug | string | null | undefined): RoleBadgeStyle {
    if (!role) {
        return FALLBACK;
    }

    return STYLES[role as UserRoleSlug] ?? { ...FALLBACK, label: role };
}
