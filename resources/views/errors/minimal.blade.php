{{--
    Layout for every framework error view (errors::404, errors::503, ...).
    Overriding this one file restyles all of them at once.

    This is the pre-Inertia fallback: maintenance mode and failures that occur
    before the SPA can boot never reach pages/Error.vue, so this page carries no
    JS, no build assets, and no exception detail.
--}}
<!DOCTYPE html>
<html lang="en" class="scheme-dark">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>@yield('title') — {{ config('app.name') }}</title>
        <style>
            *,
            *::before,
            *::after {
                box-sizing: border-box;
            }
            body {
                margin: 0;
                min-height: 100dvh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
                color: #f8fafc;
                background:
                    radial-gradient(60rem 40rem at 10% 0%, rgba(59, 130, 246, 0.14), transparent 70%),
                    radial-gradient(60rem 40rem at 90% 100%, rgba(6, 182, 212, 0.12), transparent 70%),
                    linear-gradient(to bottom, #020617, #172554f2, #020617);
            }
            .panel {
                width: 100%;
                max-width: 34rem;
                padding: 2.5rem;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 1.5rem;
                background: rgba(15, 23, 42, 0.68);
                box-shadow: 0 18px 44px -22px rgba(2, 6, 23, 0.72);
            }
            .code {
                margin: 0;
                font-size: 3.5rem;
                font-weight: 600;
                letter-spacing: -0.025em;
                font-variant-numeric: tabular-nums;
                color: #f1f5f9;
            }
            h1 {
                margin: 1.25rem 0 0;
                font-size: 1.5rem;
                font-weight: 600;
                letter-spacing: -0.025em;
            }
            p {
                margin: 0.75rem 0 0;
                max-width: 60ch;
                font-size: 0.875rem;
                line-height: 1.65;
                color: #e2e8f0;
            }
            a {
                display: inline-flex;
                align-items: center;
                margin-top: 2rem;
                padding: 0 1.25rem;
                height: 2.75rem;
                border: 1px solid rgba(147, 197, 253, 0.35);
                border-radius: 0.75rem;
                background: #2563eb;
                color: #ffffff;
                font-size: 0.875rem;
                font-weight: 600;
                text-decoration: none;
            }
            a:hover {
                background: #3b82f6;
            }
            a:focus-visible {
                outline: 2px solid #93c5fd;
                outline-offset: 2px;
            }
        </style>
    </head>
    <body>
        <main class="panel">
            <p class="code">@yield('code')</p>
            <h1>@yield('title')</h1>
            <p>@yield('message')</p>

            @unless (app()->isDownForMaintenance())
                <a href="{{ url('/') }}">Return to public site</a>
            @endunless
        </main>
    </body>
</html>
