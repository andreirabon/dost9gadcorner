---
name: dev
description: Active implementation work - shipping changes quickly, safely, and with minimal diff.
---

# Development Mode

**Context**: Active implementation work.
**Focus**: Ship working changes quickly, safely, and with minimal diff.

**Last Updated**: 2026-04-27

## Version Snapshot (Verified)

- PHP `8.3.x` (^8.3)
- Laravel `13.6.0`
- Inertia Laravel `3.0.6`
- `@inertiajs/vue3` `3.0.3`
- Vue `3.5.33`
- Tailwind CSS `4.2.4`
- Vite `8.0.9`
- TypeScript `5.9.3`
- Pest `4.6.3`
- PHPUnit `12.5.23`

## Project Reality Overrides (Highest Priority)

- Follow touched-module conventions before introducing new patterns.
- Vue Options API is the default for new page/feature implementation.
- Preserve existing `<script setup>` files when touching Composition API code.
- Frontend stack is Inertia v3 + Tailwind v4 with Reka UI, Lucide icons, and other utility-first libraries.
- Backend is Laravel 13 with middleware/routing configured in `bootstrap/app.php`.
- Keep controllers thin and Form Request-first for new complex mutation flows.
- Enforce authorization server-side using middleware/policies/ownership checks.

## Development Mindset

- **Implement first**: ship a working change quickly.
- **Constrain scope**: avoid unrelated refactors while fixing a task.
- **Verify early**: run targeted tests/checks after each substantive edit.
- **Harden before done**: validation, authorization, and error handling are not optional.

## Documentation-First Rule

Before framework-sensitive implementation decisions:

1. Use Laravel Boost `search-docs` first for Laravel/Inertia/Pest/Tailwind.
2. Use Context7 for supplemental library-specific examples.
3. If docs conflict with local conventions in touched modules, follow local conventions.

## Command Playbook

### Backend (Laravel)

```bash
# Environment and app info
php artisan about

# Tests
php artisan test --compact
php artisan test --compact --filter=SomeTestName
php artisan test --compact tests/Feature/SomeFeatureTest.php

# Database
php artisan migrate
php artisan migrate:fresh --seed

# Cache cleanup (when config/container/view feels stale)
php artisan optimize:clear

# Formatting (PHP)
vendor/bin/pint --dirty --format agent
Frontend (Vite + Vue)
bash
# Development build/watch
npm run dev

# Production build verification
npm run build

# Optional checks (only if configured in branch)
npx tsc --noEmit
npx eslint . --ext .ts,.js,.vue
Scaffolding (Non-Interactive)
bash
php artisan make:controller ExampleController --no-interaction
php artisan make:request StoreExampleRequest --no-interaction
php artisan make:test --pest ExampleFeatureTest --no-interaction
php artisan make:migration create_examples_table --no-interaction
php artisan make:model Example -mf --no-interaction
Implementation Workflow
1) Feature Work
Read existing routes/controller/page patterns in the touched module.

Add/update a focused test first when practical (especially for mutations).

Implement minimal backend + frontend changes.

Validate authorization + input handling.

Run targeted tests and relevant build checks.

Run formatter/lint tools needed for touched files.

2) Bug Fixing
Reproduce with concrete steps.

Add a failing test (or a precise verification path when test is not feasible).

Apply the smallest safe fix.

Re-run targeted tests/checks.

Confirm no regression in adjacent behavior.

3) Build Break / Type Error Loop
Run npm run build (and php artisan test --compact when backend changed).

Fix one error cluster at a time.

Re-run the failing command after each fix.

Stop once build is clean; avoid opportunistic rewrites.

Vue + Inertia Development Notes
Default to Options API for new components in this repository.

Use object-style props with explicit validation metadata.

Declare emits; avoid direct prop mutation.

Keep derived values in computed; keep side effects in methods.

Use Inertia <Link>, router.*, useForm or <Form> based on local module style.

Use partial reloads (only / except) when reducing payloads is useful.

Backend Development Notes
Use Form Requests for new complex write flows.

Use $request->validated() for create/update payloads.

Avoid $request->all() mass-assignment writes.

Prefer Eloquent and relationships over raw SQL.

Use transactions for multi-step write operations.

Keep authorization checks explicit and fail closed.

Debugging Guidance
Backend
logger()->debug() / logger()->info() for traceable debugging.

dump() / dd() only for short local debugging loops; remove before finalizing.

Frontend
Temporary console.log/console.table is fine during diagnosis.

Remove temporary debug output before finalizing changes.

Use Vue DevTools + network panel for Inertia request/response flow checks.

Quality Gates Before Completion
Behavior works for intended path.

Validation + authorization are enforced server-side.

Relevant tests pass (php artisan test --compact ...).

Frontend build passes when frontend was changed (npm run build).

PHP formatting applied when PHP files were touched (vendor/bin/pint --dirty --format agent).

No unrelated architectural or style drift introduced.

Anti-Patterns to Avoid
Large refactors in the same change as a bug fix.

Mixing Options API and Composition API styles in one Vue file.

Introducing new architecture layers for trivial CRUD work.

Skipping test/build verification after substantive edits.

Leaving debug output in finalized code.

Remember: implement quickly, verify immediately, and keep changes minimal and secure.
```
