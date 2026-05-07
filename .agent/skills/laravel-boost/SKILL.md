---
description: Laravel Boost Rules
alwaysApply: true
---

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are curated to keep implementation quality high and aligned with this repository's current stack reality.

## Foundational Context

This application is Laravel-based. Use these installed package versions as the source of truth:

- php - 8.3.x (^8.3)
- inertiajs/inertia-laravel (INERTIA) - v3.0.6
- laravel/framework (LARAVEL) - v13.6.0
- laravel/prompts (PROMPTS) - v0.3.17
- laravel/mcp (MCP) - v0.7.0
- laravel/pint (PINT) - v1.29.1
- laravel/sail (SAIL) - v1.57.0
- pestphp/pest (PEST) - v4.6.3
- phpunit/phpunit (PHPUNIT) - v12.5.23
- @inertiajs/vue3 (INERTIA_VUE) - v3.0.3
- vue (VUE) - v3.5.33
- tailwindcss (TAILWINDCSS) - v4.2.4
- vite (VITE) - v8.0.9
- eslint (ESLINT) - v9.39.4
- prettier (PRETTIER) - v3.8.3

## Project Reality Overrides (Highest Priority)

- Follow touched-file and touched-module conventions first, then apply framework defaults.
- Frontend stack is Inertia + Vue 3 + Tailwind v4 + Reka UI + Lucide icons, not BootstrapVue + SCSS-first.
- Vue style is mixed in the repo; for new feature/page work, default to Vue Options API as user preference. Preserve existing `<script setup lang="ts">` files when touched unless migration is requested.
- Inertia page resolution is configured in `resources/js/app.ts` and resolves from `resources/js/pages/**/*.vue` (lowercase `pages`).
- Backend runtime follows Laravel 13 bootstrap flow via `bootstrap/app.php` and service provider registration in `bootstrap/providers.php`.
- Do not assume legacy kernels are active in this repository (`app/Http/Kernel.php` and `app/Console/Kernel.php` are not present).
- Use server-side validation and authorization for all sensitive mutations; frontend checks are UX-only.
- Inertia is the default for page visits and form submissions; `axios` may be used in module-specific flows when already established.

## Conventions

- Follow existing naming, organization, and style in sibling files before introducing new patterns.
- Prefer descriptive names for methods/variables (for example, `isRegisteredForDiscounts` over `discount()`).
- Reuse existing components/utilities before creating new ones.

## Verification Scripts

- Do not create throwaway verification scripts when existing tests can validate behavior.
- Prefer focused Feature/Unit tests for verification.

## Application Structure & Architecture

- Keep current directory structure; do not create new top-level folders without approval.
- Do not change dependencies without explicit user approval.

## Frontend Bundling

- If UI changes are not visible, use or ask for: `npm run dev`, `npm run build`, or `composer run dev`.

## Replies

- Keep responses concise and practical; emphasize outcomes and actionable details.

## Documentation Files

- Create documentation files only when explicitly requested.

=== boost rules ===

## Laravel Boost

- Laravel Boost MCP tools are first-class for Laravel tasks. Use them.
- At task start (or when context is stale), prefer `application-info` to confirm runtime versions.

## Artisan

- Use `list-artisan-commands` before invoking Artisan commands when parameters are uncertain.

## URLs

- When sharing a project URL with the user, use `get-absolute-url` to produce the correct scheme/host/port.

## Tinker / Debugging

- Use `tinker` for framework-aware runtime checks.
- Use `database-query` for read-only SQL checks.
- Use `database-schema` (when available) before writing schema-changing migrations.

## Reading Browser Logs With `browser-logs`

- Use `browser-logs` to inspect frontend exceptions and runtime warnings.
- Prioritize recent logs and ignore stale entries.

## Searching Documentation (Critically Important)

- Use Boost `search-docs` before other approaches for Laravel ecosystem guidance.
- Search docs before implementing Laravel/Inertia/Tailwind/Pest changes.
- Start with simple, broad topic queries and iterate:
  - Example: `['form request validation', 'authorization middleware', 'inertia partial reloads']`
- Do not prepend package names in query text; package context is already provided.

### Available Search Syntax

1. Single-term stemming: `authentication`
2. Multi-word AND: `rate limit`
3. Exact phrase: `"partial reload"`
4. Mixed: `middleware "rate limit"`
5. Multi-query array: `["routing", "middleware"]`

=== php rules ===

## PHP

- Always use curly braces for control structures, including single-line bodies.

### Constructors

- Use constructor property promotion where appropriate.
- Avoid empty public constructors without parameters unless intentionally private/factory-based.

### Type Declarations

- Use explicit parameter and return types for methods/functions.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    // ...
}
</code-snippet>

## Comments

- Prefer clear code and PHPDoc over inline comments.
- Use inline comments only for non-obvious, high-complexity logic.

## PHPDoc Blocks

- Add useful array-shape docs when passing or returning structured arrays.

## Enums

- Use clear, consistent enum case naming (commonly TitleCase in this codebase).

=== inertia-laravel/core rules ===

## Inertia Core

- Use `Inertia::render()` / `inertia()` for server-driven page responses.
- In this repo, frontend pages resolve from `resources/js/pages` (see `resources/js/app.ts`).
- Use `search-docs` for behavior details before implementing advanced Inertia flows.

<code-snippet lang="php" name="Inertia::render Example">
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all(),
    ]);
});
</code-snippet>

=== inertia-laravel/v3 rules ===

## Inertia Version Notes

- Inertia v3 is installed and available. Use v3 capabilities when they fit the touched module.
- Prefer current module conventions for forms/navigation and avoid unnecessary rewrites.

### Inertia v3 Features Available

- Deferred props and `Deferred` client rendering
- Partial reloads (`only`, `except`, `reset`)
- Polling / prefetching / lazy loading patterns
- `WhenVisible` and merge-based infinite loading patterns

### Inertia Form Guidance

- Both `useForm` and `<Form>` are valid; follow touched-file conventions.
- Use top-level form props for submission behavior and `options` for visit behavior (`only`, `except`, `reset`, `preserve*`).
- In Vue Options API files, prefer `import { router, useForm } from '@inertiajs/vue3'` over introducing legacy global patterns.

=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:*` generators for framework files.
- For generic classes, use `php artisan make:class`.
- Pass `--no-interaction` to non-interactive Artisan workflows.

### Database

- Prefer Eloquent models/relationships and query builder over raw SQL.
- Avoid `DB::` when a model/query scope solves the same problem clearly.
- Prevent N+1 queries with eager loading.

### Model Creation

- When introducing new models, also consider factories/seeders for testability.

### APIs & Eloquent Resources

- For API responses, prefer Resources and explicit response shaping.
- Keep consistency with the existing route/API style in the touched area.

### Controllers & Validation

- Prefer Form Request classes for new or significantly changed mutation flows.
- Preserve local module style for small legacy touch-ups when full refactors are out of scope.
- Never use unvalidated `$request->all()` in mutation logic.

### Queues

- Use queued jobs (`ShouldQueue`) for expensive/background work.

### Authentication & Authorization

- Use Laravel auth/authorization primitives (middleware, gates/policies, Sanctum as needed).
- Enforce authorization on the server side for every protected action.

### URL Generation

- Prefer named routes via `route()` for internal links/redirects.

### Configuration

- Use `config()` outside config files; do not call `env()` directly in app logic.

### Testing

- Use factories for model-driven tests.
- Use Pest for new tests.
- Run focused tests first: `php artisan test --compact --filter=...` or `php artisan test --compact tests/Feature/...`.

### Vite Error

- For `Unable to locate file in Vite manifest` issues, run `npm run build` or `npm run dev`.

=== laravel/v13 rules ===

## Laravel 13

- Always verify Laravel behavior with `search-docs` before implementation when unsure.

### Laravel 13 Structure

- Configure routing/middleware/exception hooks in `bootstrap/app.php`.
- Register app service providers in `bootstrap/providers.php`.
- Custom middleware classes still live under `app/Http/Middleware`.
- Do not introduce or rely on legacy `app/Http/Kernel.php` / `app/Console/Kernel.php` patterns in this repo.
- Console command discovery is automatic for classes under `app/Console/Commands`.

### Database

- When altering columns, preserve all existing attributes in migrations to avoid accidental drops.
- Use native eager-load limits where useful (`->latest()->limit(10)` in relationship constraints).

### Models

- Prefer model `casts()` method when it matches local conventions in touched files.

=== pint/core rules ===

## Laravel Pint Code Formatter

- Run `vendor/bin/pint --dirty --format agent` before finalizing PHP edits.
- Do not run `--test` mode unless explicitly requested.

=== pest/core rules ===

## Pest

### Testing

- Verify behavior with tests for every change.

### Pest Tests

- All new tests should use Pest (`php artisan make:test --pest <name>`).
- Never remove existing tests without explicit approval.
- Cover happy path, failure path, and key edge cases for changed behavior.

### Running Tests

- Run the minimum relevant scope first using compact output:
  - `php artisan test --compact`
  - `php artisan test --compact tests/Feature/ExampleTest.php`
  - `php artisan test --compact --filter=testName`
- After focused tests pass, offer to run the full suite.

### Pest Assertions

- Use semantic assertions (`assertForbidden`, `assertNotFound`, `assertSuccessful`) instead of generic status assertions where possible.

### Mocking

- Use `Pest\Laravel\mock` (imported) or `$this->mock()` in line with local test style.

### Datasets

- Use datasets to reduce duplication for matrix-style scenarios (validation permutations, role checks, etc.).

=== inertia-vue/core rules ===

## Inertia + Vue

- Vue components must have a single root element.
- Use `<Link>` and `router.visit/router.get/router.post/...` for navigation and visits.
- For new feature/page work, prefer Vue Options API unless the touched module is already `<script setup>`.

<code-snippet name="Inertia Client Navigation" lang="vue">
import { Link } from '@inertiajs/vue3'

<Link href="/">Home</Link>
</code-snippet>

=== inertia-vue/v3/forms rules ===

## Inertia + Vue Forms

<code-snippet name="`<Form>` Component Example" lang="vue">
<Form
    action="/users"
    method="post"
    :options="{
        preserveScroll: true,
        only: ['users'],
    }"
>
    <input type="text" name="name" />

    <button type="submit">Create User</button>

</Form>
</code-snippet>

- `useForm` is equally valid where local code needs more programmatic control.

=== tailwindcss/core rules ===

## Tailwind Core

- This repository is Tailwind-first in active frontend paths.
- Keep class usage consistent with surrounding files/components before introducing new utility patterns.
- Use `search-docs` for exact utility or syntax behavior when uncertain.

### Spacing

- Prefer gap utilities for list/flex/grid spacing over ad-hoc margins.

<code-snippet name="Valid Flex Gap Spacing Example" lang="html">
<div class="flex gap-8">
    <div>Superior</div>
    <div>Michigan</div>
    <div>Erie</div>
</div>
</code-snippet>

### Dark Mode

- Maintain dark-mode support where existing pages/components already provide it.

=== tailwindcss/v4 rules ===

## Tailwind 4

- Use Tailwind CSS v4 syntax and utilities only.
- `corePlugins` is not supported in v4.
- Import via `@import "tailwindcss";`.
- Use `@theme` for design tokens that should generate utilities.

<code-snippet name="Tailwind v4 Import and Theme" lang="css">
@import "tailwindcss";

@theme {
--color-brand: oklch(0.72 0.11 178);
}
</code-snippet>

### Replaced Utilities

- Do not use deprecated v3-era utility names when v4 replacements exist.

| Deprecated              | Replacement            |
| ----------------------- | ---------------------- |
| `bg-opacity-*`          | `bg-black/*`           |
| `text-opacity-*`        | `text-black/*`         |
| `border-opacity-*`      | `border-black/*`       |
| `divide-opacity-*`      | `divide-black/*`       |
| `ring-opacity-*`        | `ring-black/*`         |
| `placeholder-opacity-*` | `placeholder-black/*`  |
| `flex-shrink-*`         | `shrink-*`             |
| `flex-grow-*`           | `grow-*`               |
| `overflow-ellipsis`     | `text-ellipsis`        |
| `decoration-slice`      | `box-decoration-slice` |
| `decoration-clone`      | `box-decoration-clone` |

=== tests rules ===

## Test Enforcement

- Every code change should be validated programmatically by running relevant tests.
- Prefer minimum-scope test runs for speed, then expand when needed:
  - `php artisan test --compact --filter=...`
  - `php artisan test --compact tests/Feature/...`

</laravel-boost-guidelines>
