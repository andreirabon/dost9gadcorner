/**
 * App uses light theme only. Keeps cookie/localStorage in sync for SSR middleware compatibility.
 */
export function updateTheme(): void {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove('dark');
}

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;

    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem('appearance', 'light');
    setCookie('appearance', 'light');
    updateTheme();
}

export function useAppearance(): { appearance: { value: 'light' } } {
    return {
        appearance: { value: 'light' },
    };
}
