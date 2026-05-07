---
name: build-fix
description: Incrementally fix build and integration errors with strict safety checks, fast feedback loops, and minimal diffs.
---

# Build and Fix

Incrementally fix build and integration errors with strict safety checks, fast feedback loops, and minimal diffs.

**Last Updated**: 2026-04-27

## Version Snapshot (Verified)

- Laravel `13.6.0`
- Inertia Laravel `3.0.6`
- `@inertiajs/vue3` `3.0.3`
- Vue `3.5.33`
- Vite `8.0.9`
- Tailwind CSS `4.2.4`
- `@tailwindcss/vite` `4.2.4`
- TypeScript `5.9.3`
- Pest `4.6.3`

## Documentation-First Validation (Required)

- Use **Laravel Boost `search-docs`** first for Laravel/Inertia/Tailwind behavior and command guidance.
- Use **Context7** for current Vite/Tailwind/Vue troubleshooting details when uncertain.
- Prefer version-specific guidance over memory.

## Repository Reality (Apply First)

- Primary frontend check is `npm run build`.
- Frontend entrypoint is `resources/js/app.ts`; SSR entrypoint is `resources/js/ssr.ts`.
- Inertia pages resolve via `./pages/**/*.vue` (lowercase).
- Vite alias `@` points to `resources/js`.
- Styling is Tailwind v4 in `resources/css/app.css` (`@import 'tailwindcss'`, `@theme`).
- Do not assume SCSS pipelines are active in this branch.
- Do not assume `tsc` is a mandatory gate unless TypeScript errors are part of the failing build.
- Vue preference: **Preserve the existing component style** (Options API or Composition API with `<script setup>`) when fixing build errors. Do not change the API style of a component as part of a build fix.

## Incremental Fix Workflow

### 1) Initial Diagnostics

Run only what is needed, in order:

```bash
# Primary build gate
npm run build

# Laravel health/integration checks (when relevant)
php artisan about
php artisan optimize:clear

# Composer checks for classmap/autoload issues
composer validate
composer dump-autoload
Notes:

Do not run npm install/npm ci unless dependency state is actually broken.

Avoid running npm run lint first because it auto-fixes and may create unrelated diff noise.

2) Parse and Prioritize
Group failures by:

Location: file(s) and line(s)

Severity:

Critical: build halts

High: compile/runtime-transform errors

Medium: warnings/deprecations

Type:

Vite module resolution/config

Vue SFC compile/reactivity

Tailwind v4 processing (@apply, @reference, theme variables)

Inertia page resolution

Laravel integration (manifest/cache/autoload)

3) Fix One Error at a Time
For each blocking error:

Capture exact failing message and file/line.

Apply smallest safe patch that addresses root cause.

Re-run npm run build.

Confirm:

original error is gone

no new blocking error from the change

4) Stop Conditions
Pause and reassess if:

Same error persists after 3 focused attempts

New critical errors appear repeatedly after each fix

Proposed fix requires architectural changes or dependency additions

User requests pause/redirection

Practical Fix Patterns
Pattern A: Vite Import Resolution
Symptoms:

Failed to resolve import "@/..."

Checks:

File exists under resources/js

Correct casing on import path

Alias usage matches vite.config.ts

Pattern B: Inertia Page Lookup
Symptoms:

Page component not found during resolve

Checks:

Page path matches lowercase ./pages/...

Component filename and route/render name align

Pattern C: Tailwind v4 in Vue <style>
Symptoms:

@apply or theme utility not recognized in SFC style block

Fix:

Prefer utility classes in template markup when possible.

If style block must use Tailwind utilities, use @reference to global CSS.

Do not reintroduce v3-only configuration patterns.

Pattern D: Laravel Vite Manifest Errors
Symptoms:

Unable to locate file in Vite manifest

Fix sequence:

npm run build

php artisan optimize:clear

Verify Vite entrypoints/config alignment

Use npm run dev / composer run dev for local dev flow when appropriate

Pattern E: Vue Reactivity
Symptoms:

Prop mutation, undefined instance properties, event mismatch

Fix:

Never mutate props directly

Emit updates or map prop to local state (in data() for Options API, or a local ref/reactive for Composition API)

Match the component's existing style when fixing

Minimal Diff Discipline
Do
Touch only files implicated by current errors.

Keep patches small and reversible.

Preserve behavior and existing public interfaces.

Keep imports at top of file.

Avoid
Refactors during build triage.

Bulk style/lint rewrites unrelated to the failing error.

New dependencies unless explicitly approved.

Renames/moves unless path correction requires it.

Verification Checklist
npm run build passes

No new unresolved imports

Inertia page resolution still works for touched pages

No Tailwind v4 misuse introduced

Laravel boots if backend/config was touched

Changes are limited to failing scope

Fix Summary Template
markdown
## Build Fix Summary

**Issue:** [short title]
**File(s):** [paths]
**Type:** [Vite/Vue/Tailwind/Inertia/Laravel]
**Status:** RESOLVED / PARTIAL / BLOCKED

### Root Cause

- [1-2 bullets]

### Minimal Change Applied

- [exact change summary]

### Verification

- npm run build: PASS/FAIL
- php artisan about (if run): PASS/FAIL
- php artisan optimize:clear (if run): PASS/FAIL

### Remaining Issues

- [if any]
Stack-Specific Context
Frontend: Vue 3.5 + Inertia v3 + Vite 8 + Tailwind 4

Backend: Laravel 13

Tests: Pest for backend behavior verification

Remember: Fix one blocker at a time, validate immediately, and keep the diff as small as possible.
```
