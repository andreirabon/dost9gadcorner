import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
    build: {
        // ApexCharts minifies to ~520 kB; default 500 kB warning is noisy for legitimate heavy vendors.
        chunkSizeWarningLimit: 640,
        rollupOptions: {
            onwarn(warning, defaultHandler) {
                // Ignore noisy warnings from dependencies
                if (warning.code === 'INVALID_ANNOTATION') return;
                if (warning.code === 'EMPTY_BUNDLE') return;
                defaultHandler(warning);
            },
            output: isSsrBuild
                ? undefined
                : {
                      manualChunks: {
                          'vendor-gsap': ['gsap', 'gsap/ScrollTrigger'],
                          'vendor-d3': ['d3-org-chart', 'd3-selection'],
                      },
                  },
        },
    },
    // d3-org-chart ships ESM from `src/`; skipping the pre-bundle avoids occasional broken/empty
    // `.vite/deps` responses over HTTPS dev servers (Herd), which surface as MIME/CORS errors in the browser.
    optimizeDeps: {
        exclude: ['d3-org-chart'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/app.ts', 'resources/css/pdf.css'],
            ssr: 'resources/js/ssr.ts',
            refresh: true,
            // Use Herd/Valet TLS so the dev server URL matches https://*.test:5173 (same as @vite scripts).
            detectTls: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
}));
