<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Trusted proxies are applied in AppServiceProvider::boot(), where the config
        // repository exists. Reading config (or env) here runs before config is bound
        // and before a cached config file is loaded.

        $middleware->redirectGuestsTo(fn (Request $request) => route('login'));

        $middleware->redirectUsersTo(fn () => route('index'));

        $middleware->encryptCookies(except: ['sidebar_state']);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->append(SecurityHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Render HTTP errors inside the Inertia shell so a 404 keeps the app's
        // look instead of dropping to Symfony's white page. Only the status code
        // crosses the boundary — exception messages stay server-side.
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            // Statuses that get the branded page. Anything else keeps Laravel's
            // default handling. Declared inline, not as a file-level const: the
            // test suite re-requires this file per test.
            $handled = [400, 401, 403, 404, 405, 419, 429, 500, 503];

            $status = $response->getStatusCode();

            if (! in_array($status, $handled, true) || $request->expectsJson()) {
                return $response;
            }

            // Keep Laravel's stack-trace page for server faults while debugging.
            if ($status >= 500 && config('app.debug')) {
                return $response;
            }

            if ($status === 419) {
                return back()->with('status', 'Your session expired. Please try again.');
            }

            return Inertia::render('Error', ['status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        });
    })->create();
