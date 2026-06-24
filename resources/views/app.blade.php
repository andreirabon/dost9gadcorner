<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#fafafa">
    <meta name="msapplication-TileColor" content="#fafafa">
    <meta property="csp-nonce" content="{{ $cspNonce }}">

    <script nonce="{{ $cspNonce }}">
        document.documentElement.classList.remove('dark');
    </script>

    <style nonce="{{ $cspNonce }}">
        html {
            background-color: #fafafa;
        }
    </style>

    <title inertia>{{ config('app.name') }}</title>

    <link rel="icon" href="/gadlogo.png" type="image/png">
    <link rel="apple-touch-icon" href="/gadlogo.png">

    {{-- Removed Google Fonts --}}

    @php
        $ziggyGroup = auth()->check()
            ? (request()->routeIs(['report-years.*', 'print-report', 'print-report.generate'])
                ? 'staff-reports'
                : (request()->routeIs('settings.*') ? 'staff-settings' : null))
            : 'guest';
    @endphp
    @routes($ziggyGroup, $cspNonce)
    @vite('resources/js/app.ts')
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
