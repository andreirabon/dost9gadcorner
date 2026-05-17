import { onMounted, ref } from 'vue';

type Appearance = 'light' | 'dark' | 'system';

export function updateTheme(value: Appearance) {
    if (typeof window === 'undefined') {
        return;
    }

    if (value === 'system') {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme = mediaQueryList.matches ? 'dark' : 'dark'; // Force dark

        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
        // We always want to enforce dark mode now that Bento 2.0 is the main theme
        document.documentElement.classList.toggle('dark', true);
    }
}

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;

    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const getStoredAppearance = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem('appearance') as Appearance | null;
};

const handleSystemThemeChange = () => {
    const currentAppearance = getStoredAppearance();

    updateTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    if (typeof window === 'undefined') {
        return;
    }

    // Force dark mode
    updateTheme('dark');
}

// Default reactive state now 'dark'
const appearance = ref<Appearance>('dark');

export function useAppearance() {
    onMounted(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;

        if (savedAppearance) {
            appearance.value = 'dark'; // Override any saved 'light' state
            localStorage.setItem('appearance', 'dark');
            setCookie('appearance', 'dark');
        } else {
            appearance.value = 'dark';
        }
    });

    function updateAppearance(value: Appearance) {
        appearance.value = 'dark'; // Always dark

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', 'dark');

        // Store in cookie for SSR...
        setCookie('appearance', 'dark');

        updateTheme('dark');
    }

    return {
        appearance,
        updateAppearance,
    };
}
