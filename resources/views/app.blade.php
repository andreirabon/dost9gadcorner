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

    {{-- Downscaled from gadlogo.png (546 kB), which was being fetched on every page just to draw a 16px icon. --}}
    <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    {{-- Removed Google Fonts --}}

    @php
        $ziggyGroup = auth()->check() ? null : 'guest';
    @endphp
    @routes($ziggyGroup, $cspNonce)
    @vite('resources/js/app.ts')
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
