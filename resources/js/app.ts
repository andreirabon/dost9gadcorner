import '@fontsource/geist-sans';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { ZiggyVue } from 'ziggy-js';
import { initializeTheme } from './composables/useAppearance';
import { configureEcho } from '@laravel/echo-vue';
import Pusher from 'pusher-js';
(window as any).Pusher = Pusher; // ponytail: simple bypass for missing window type

const broadcaster = import.meta.env.VITE_BROADCAST_CONNECTION === 'reverb' ? 'reverb' : 'null';

configureEcho({
    broadcaster: broadcaster,
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.DEV ? window.location.hostname : import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.DEV ? 5173 : (import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: import.meta.env.DEV ? 5173 : (import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

const appName = import.meta.env.VITE_APP_NAME || 'DOST IX GAD CORNER';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// Ensures light theme on page load (removes any stale dark class).
initializeTheme();
