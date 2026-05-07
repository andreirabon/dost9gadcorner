---
name: refactor-clean
description: Safely identify and remove dead code with comprehensive test verification for Laravel + Vue 3 + Inertia.js applications.
---

# Refactor Clean

Safely identify and remove dead code with comprehensive test verification for Laravel + Vue 3 + Inertia.js applications.

**Last Updated**: 2026-04-27

## Version Snapshot (Source of Truth)

- PHP: 8.3.x (^8.3)
- Laravel: 13.6.0
- Inertia Laravel: 3.0.6
- @inertiajs/vue3: 3.0.3
- Vue: 3.5.33
- Tailwind CSS: 4.2.4
- Vite: 8.0.9
- Pest: 4.6.3
- PHPUnit: 12.5.23

## Project Reality Overrides (Highest Priority)

- Follow touched-module conventions first; avoid "ideal architecture" rewrites during cleanup.
- Backend commonly uses service classes under `app/Services/**` with `*Class` naming and controller `option` branching.
- Frontend is JS-first Vue Options API, with Inertia and axios both used depending on module.
- UI stack in this repository is Tailwind CSS v4 + Reka UI / Lucide icons; avoid assuming BootstrapVue/SCSS patterns in cleanup plans.
- Treat Laravel runtime structure as `bootstrap/app.php` + `bootstrap/providers.php`; do not assume legacy kernel registration paths.

## Documentation-First Validation (Required)

- Validate Laravel and Pest guidance with Laravel Boost `search-docs` before recommending structural cleanup steps.
- Use Context7 for non-Laravel package/tooling docs when needed (for example depcheck/knip ecosystem details).
- If docs conflict with touched-module conventions, preserve touched-module conventions and call out the trade-off in the report.

## Analysis Process

### Phase 1: Backend Analysis (Laravel/PHP)

#### 1.1 Unused Composer Dependencies

```bash
composer unused
# OR
composer global require icanhazstring/composer-unused
composer unused
1.2 Static Analysis (Optional if configured)
bash
./vendor/bin/phpstan analyse app --level=max
# Identify unused methods, properties, and classes
1.3 Manual Laravel-Specific Checks
Unused Routes:

bash
php artisan route:list
# Compare with actual usage in Vue components
# Look for routes with no corresponding frontend usage
Unused Controllers:

Check for controller methods not referenced in routes

Search codebase for controller usage

Verify no dynamic route generation using them

Unused Models:

Search for model usage across codebase

Check for models with no relationships or queries

Verify no dynamic model resolution

Unused Migrations:

Check if migration has been rolled back

Verify tables/columns are actually used

Be VERY careful - data loss risk

Unused Policies:

Check where policies are registered/discovered in current app structure

Search for authorize() calls referencing policy

Verify no implicit policy discovery usage

Unused Services/Repositories:

Check for service container bindings

Search for dependency injection usage

Verify no dynamic resolution

Unused Events/Listeners:

Check registration/discovery via bootstrap/app.php and any relevant provider wiring

Search for event() calls

Verify listener is actually triggered

Unused Jobs:

Search for dispatch calls

Check queue configuration

Verify job is actually queued

Unused Helpers:

Search for helper function calls

Check if autoloaded in composer.json

Unused Blade Views:

Search for view() calls (if any non-Inertia views exist)

Check email templates

Verify not used in notifications

Phase 2: Frontend Analysis (Vue 3 / JS-first)
2.1 Unused NPM Dependencies
bash
npx depcheck
2.2 Unused TypeScript Exports (Optional)
bash
npx ts-prune --project tsconfig.json
2.3 Unused Files and Exports (Optional)
bash
npx knip
2.4 Manual Vue-Specific Checks
Unused Components:

Search for component imports across Vue files

Check for components never used in templates

Verify not dynamically loaded

Unused Composables:

Search for composable imports (if any, since you use Options API)

Check TypeScript utilities

Unused Pages:

Cross-reference with Inertia::render() calls in controllers

Search for route references

Verify no dynamic page resolution

Unused Assets:

Check images, fonts, icons in public/

Verify CSS classes are actually used

Check for unused SVG files

Unused Types:

Run ts-prune on types/index.d.ts

Check for unused interfaces

Phase 3: Generate Comprehensive Report
Create .reports/dead-code-analysis.md with:

markdown
# Dead Code Analysis Report

Generated: [DATE]

## Summary

- Total Issues: X
- Safe to Remove: Y
- Requires Review: Z

## Backend (Laravel/PHP)

### 🟢 SAFE - Can be removed immediately

- [ ] Unused composer package: [package-name]
- [ ] Unused helper function: app/Helpers/[name].php
- [ ] Unused test factory: database/factories/[Name]Factory.php

### 🟡 CAUTION - Review before removal

- [ ] Unused controller method: App\Http\Controllers\[Name]Controller@method
- [ ] Unused route: GET /[route]
- [ ] Unused Vue component: resources/js/components/[Name].vue
- [ ] Unused service class: App\Services\[Domain]\[Action]Class
- [ ] Unused repository: App\Repositories\[Name]Repository

### 🔴 DANGER - Do NOT remove without careful review

- [ ] Unused migration: database/migrations/xxxx\_[name].php
- [ ] Unused model: App\Models\[Name]
- [ ] Unused policy: App\Policies\[Name]Policy
- [ ] Unused event: App\Events\[Name]Event
- [ ] Unused config file: config/[name].php

## Frontend (Vue 3 / JavaScript-first)

### 🟢 SAFE

- [ ] Unused npm package: [package-name]
- [ ] Unused TypeScript utility (if TS-enabled): resources/js/lib/[name].ts
- [ ] Unused icon: public/svg/[name].svg

### 🟡 CAUTION

- [ ] Unused Vue component: resources/js/components/[Name].vue
- [ ] Unused page: resources/js/pages/[domain]/[Name].vue
- [ ] Unused type: resources/js/types/[name].d.ts

### 🔴 DANGER

- [ ] Unused layout: resources/js/layouts/[Name].vue
- [ ] Unused global CSS/Tailwind file: resources/css/[name].css
- [ ] Unused Vite config: vite.config.js
Categorization Rules
🟢 SAFE (Low Risk)
Unused NPM packages (unless in production dependencies)

Unused Composer dev dependencies

Clearly unused utility functions

Unused test files (be careful with this)

Unused helper functions with no references

Unused TypeScript types/interfaces

Unused CSS classes (after thorough search)

Unused images/icons (verify not dynamically loaded)

🟡 CAUTION (Medium Risk)
Unused Vue components (check dynamic imports)

Unused routes (verify no external links)

Unused controller methods (check for API consumers)

Unused services/repositories (verify no dynamic resolution)

Unused Inertia pages (verify no dynamic rendering)

Unused form requests (check controller usage)

Unused policies (check registration/discovery and usage)

Unused middleware (check route definitions)

🔴 DANGER (High Risk - Manual Review Required)
Unused migrations (potential data loss)

Unused models (may break relationships)

Unused events (may break event listeners)

Unused jobs (may break queued tasks)

Unused config files (may break app behavior)

Unused .env variables (may break in production)

Unused database indexes (performance impact)

Unused Laravel service providers

Safe Deletion Workflow
For each item to be removed:

Backend (PHP) Deletion Process
bash
# 1. Run relevant tests BEFORE changes
php artisan test --compact --filter=[RelatedArea]
# Optional when configured:
# ./vendor/bin/phpstan analyse

# 2. Make note of passing test count
# Example: Tests: 145 passed

# 3. Remove the dead code
# [Make your deletion here]

# 4. Run tests again IMMEDIATELY
php artisan test --compact

# 5. Verify same test count and all pass
# If any test fails, restore only the affected file changes manually

# 6. Run static analysis
# Optional:
# ./vendor/bin/phpstan analyse

# 7. Run linter
./vendor/bin/pint --dirty --format agent

# 8. Commit changes
git add .
git commit -m "refactor: remove unused [description]"
Frontend (Vue/JS-first) Deletion Process
bash
# 1. Run available frontend checks BEFORE changes
# npm run test
# npm run type-check

# 2. Make note of passing test count

# 3. Remove the dead code
# [Make your deletion here]

# 4. Run tests again IMMEDIATELY
# npm run test

# 5. Check TypeScript compilation
# npm run type-check

# 6. Build to verify no runtime errors
npm run build

# 7. Run linter
# npm run lint

# 8. Commit changes
git add .
git commit -m "refactor: remove unused [description]"
Full Stack Deletion Process (Minimal Checks)
If removing code that touches both backend and frontend:

bash
# 1. Run ALL tests
php artisan test --compact --filter=[RelatedArea]
# npm run test

# 2. Remove code (backend first, then frontend)

# 3. Run ALL tests again
php artisan test --compact --filter=[RelatedArea]
# npm run test
npm run build

# 4. Verify app still works locally
php artisan serve
# Test in browser

# 5. Commit
git add .
git commit -m "refactor: remove unused [description]"
Red Flags - DO NOT DELETE
NEVER delete without extreme caution:

Backend Red Flags
❌ Anything in app/Providers/ (Service Providers)

❌ Anything in bootstrap/ (App initialization)

❌ Anything in config/ (unless 100% sure)

❌ Database migrations (unless just created and not deployed)

❌ Models with relationships (may break cascade deletes)

❌ Routes used by external APIs or webhooks

❌ Controllers used by mobile apps or external services

❌ Jobs that run on schedule (check routes/console.php and scheduler wiring)

❌ Events that may be fired dynamically

❌ Middleware aliases/groups wired in bootstrap/app.php

Frontend Red Flags
❌ Anything in resources/js/app.js (entry point)

❌ Core bootstrapping files like resources/js/bootstrap.js

❌ Layout components (unless replacing)

❌ Base components used globally

❌ TypeScript types used in multiple files

❌ Global CSS/Tailwind imports used in resources/css/app.css

Rollback Procedure
If tests fail after deletion:

bash
# 1) Revert only the specific file edits manually
# 2) Re-run related tests/build checks
php artisan test --compact --filter=[RelatedArea]
npm run build
# 3) If already committed, use:
git revert HEAD
Best Practices
Start Small: Remove one item at a time, not bulk deletions

Test After Each: Run the smallest relevant tests/build checks after every removal

Commit Frequently: Each removal should be its own commit

Check Git History: See when/why code was added before removing

Search Thoroughly: Use IDE's "Find in Files" to check usage

Check Production: Verify code isn't used in production environment

Ask Team: If unsure, ask other developers before removing

Document: Update related documentation when removing features

Monitor: After deployment, monitor for errors related to removals

Keep Backups: Ensure git commits are pushed before major cleanups

Analysis Commands Quick Reference
bash
# Backend Analysis
composer unused                           # Unused Composer packages
./vendor/bin/phpstan analyse             # Static analysis
php artisan route:list                   # List all routes

# Frontend Analysis
npx depcheck                             # Unused npm packages
# npx ts-prune                           # Optional TS export checks
# npx knip                               # Optional unused files/exports

# Testing
php artisan test --compact               # Run PHP tests (compact)
php artisan test --compact --coverage    # With coverage (compact output)
# npm run test                           # Run frontend tests (if configured)
# npm run type-check                     # TypeScript check (if configured)
npm run build                            # Production build

# Code Quality
./vendor/bin/pint --dirty --format agent # Format changed PHP files
# ./vendor/bin/phpstan analyse           # Analyze PHP (if configured)
# npm run lint                           # Lint frontend (if configured)
Summary Report Template
After cleanup, generate a summary:

markdown
# Cleanup Summary

Date: [DATE]

## Items Removed

- 5 unused Composer packages
- 3 unused NPM packages
- 2 unused controller methods
- 4 unused Vue components
- 1 unused service class

## Test Results

- ✅ All 145 backend tests passing
- ✅ All 67 frontend tests passing
- ✅ Frontend build successful
- ✅ Production build successful

## Lines of Code Removed

- PHP: -450 lines
- Vue/JavaScript: -320 lines
- Total: -770 lines

## Commits

- refactor: remove unused UserSubscriptionService
- refactor: remove unused AdminDashboard component
- refactor: remove unused composer packages (guzzle/oauth-subscriber)

## Next Steps

- Monitor production for 24 hours
- Review performance metrics
- Update documentation if needed
CRITICAL RULE: Never delete code without running tests before AND after. When in doubt, DON'T delete.

Stack: Laravel 13.6 + PHP 8.3 + Vue 3.5 Options API (JS-first) + Inertia.js 3 + axios + Tailwind CSS 4 + Reka UI / Lucide Icons + MySQL + Pest 4
```
