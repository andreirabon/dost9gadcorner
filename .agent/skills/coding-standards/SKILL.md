---
name: coding-standards
description: Coding standards for this Laravel + Inertia + Vue codebase.
---

# Coding Standards & Best Practices

Coding standards for this Laravel + Inertia + Vue codebase.

**Last Updated**: 2026-04-29

## Version Snapshot (Verified)

- PHP `8.3.x` (project requires `^8.3`)
- Laravel `13.6.0`
- Inertia Laravel `3.0.6`
- `@inertiajs/vue3` `3.0.3`
- Vue `3.5.33`
- Tailwind CSS `4.2.4`
- Vite `8.0.9`
- TypeScript `5.9.3`
- Pest `4.6.3`
- PHPUnit `12.5.23`

## Documentation-First Validation (Required)

- Use **Laravel Boost `search-docs`** first for Laravel/Inertia/Tailwind/Pest guidance.
- Use **Context7** for current framework/library references and examples.
- Prefer version-specific documented behavior over memory.

## Project Reality Overrides (Highest Priority)

- Follow touched-file conventions first; do not force global pattern rewrites.
- Vue preference: **use Options API by default for new feature/page work**.
- Existing `<script setup>` components are valid; preserve local module style when editing them.
- Frontend uses Inertia v3 + Vue + Tailwind v4 (with Reka UI, Lucide icons, etc.), not BootstrapVue/SCSS-first.
- Routing/middleware/bootstrap config follows Laravel 13 streamlined setup in `bootstrap/app.php`.
- Avoid introducing speculative service/repository layers unless complexity justifies it.

## Core Code Quality Principles

### 1) Readability First

- Prefer clear names over short/clever names.
- Keep functions/components focused and easy to scan.
- Use comments for intent/why, not for obvious what/how.

### 2) Minimal Complexity

- Choose the simplest solution that satisfies current requirements.
- Avoid speculative abstractions.
- Add indirection only when duplication or complexity is real.

### 3) Consistency Over Preference

- Match existing module patterns before applying generic style ideals.
- Keep naming, error handling, response shape, and file structure consistent in touched areas.

## 2026 VILT Best Practice Comparison

| Feature               | The "Old" Way (2024)                    | The 2026 Standard (VILT)                           |
| --------------------- | --------------------------------------- | -------------------------------------------------- |
| Styling Config        | `tailwind.config.js`                    | CSS-First `@theme` in `app.css`                    |
| Component Logic       | Giant `methods` objects                 | Imported Action / Service JS files                 |
| Responsive UI         | Media Queries (`sm:`, `lg:`)            | Container Queries (`@sm:`, `@lg:`)                 |
| Controller Layout     | Massive `UserController.php`            | Directory-based Invokable Controllers              |
| Build Engine          | PostCSS / Vite                          | Vite + Lightning CSS (faster builds)               |

## Directory Organization (The "Lean" Stack)

To keep the project maintainable as it grows:

```
resources/js/
├── pages/        ← Large page-level Vue components
├── components/   ← Small, reusable UI pieces (buttons, inputs)
├── Actions/      ← Pure JavaScript logic (math, formatting, API calls)
└── ...
resources/css/
├── app.css       ← @theme tokens, @layer components, base styles
└── base/         ← Custom @layer styles for standard elements
```

- Extract complex logic from Vue `methods` into `resources/js/helpers` files.
- Keep page components lean by importing Actions and using prop-driven child components.
- See `frontend-patterns` skill for full Vue SRP approach.

## PHP / Laravel Standards

### Type Declarations and Signatures

- Use explicit parameter and return types on methods/functions.
- Use nullable types where needed (`?Type`).
- Use constructor property promotion when appropriate.
- Keep imports at top of file; avoid inline imports.

```php
public function update(ProfileUpdateRequest $request): RedirectResponse
{
    $request->user()->fill($request->validated())->save();

    return to_route('settings.profile.edit');
}
Validation
Prefer Form Requests for create/update and security-sensitive mutations.

Use $request->validated() (or safe()->only()/except()) before writes.

Keep inline validation only for narrow, local checks in existing flows.

php
public function store(StorePostRequest $request): RedirectResponse
{
    Post::create($request->validated());

    return to_route('posts.index');
}
Authorization
Enforce authorization on the backend (middleware + explicit checks as needed).

Never treat frontend visibility as security.

Fail closed on uncertain authorization (403 / 404 as appropriate).

Eloquent and Queries
Prefer Eloquent relationships and eager loading to prevent N+1.

Select only required columns on heavy lists.

Avoid raw SQL unless complexity/performance requires it.

Never use unfiltered $request->all() for create/update.

php
$users = User::query()
    ->select(['id', 'name', 'email'])
    ->with('roles:id,name')
    ->get();
Controllers and Responses
Apply the Single Responsibility Principle: each controller class should have one reason to change.

Prefer Single Action Controllers (`__invoke`) for new features — one controller = one action.

Keep controllers skinny and orchestration-focused (validate, authorize, delegate, respond).

Delegate business logic to Service classes, Action classes, or Model methods.

Use Inertia responses for pages and redirects for mutations.

Keep response shape stable for any consumed JSON endpoints.

Routing and Middleware
Register/adjust middleware in bootstrap/app.php.

Prefer named routes and route model binding.

Keep route grouping and naming conventions consistent.

Vue / JavaScript / TypeScript Standards
Vue Style Preference
Default for new work: Vue Options API.

In existing <script setup> files, stay consistent unless migration is requested.

Options API Component Shape (Default)
vue
<script>
export default {
    name: 'ProfileCard',
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    emits: ['refresh'],
    data() {
        return {
            isLoading: false,
        };
    },
    computed: {
        displayName() {
            return this.user.name ?? 'Unknown';
        },
    },
    methods: {
        async reload() {
            this.isLoading = true;
            this.$emit('refresh');
            this.isLoading = false;
        },
    },
};
</script>
Reactivity and Props
Do not mutate props directly.

Use local data() state or emit events (update:*) for parent-owned state.

Use computed properties for derived values; methods for actions/side effects.

JS/TS General Practices
Use descriptive names (marketSearchQuery, not q).

Use async/await with meaningful error handling for async flows.

Prefer immutable updates when transforming arrays/objects.

Keep imports grouped at top of file.

For TS unions/enums, prefer exhaustive switch handling where relevant.

Inertia Standards
Use Inertia::render(...) in controllers for page responses.

Use useForm / <Form> for form flows consistent with touched module.

Use visit options intentionally (preserveScroll, preserveState, only, except).

Prefer named routes and Ziggy route helpers where used in the module.

javascript
form.post(route('profile.update'), {
    preserveScroll: true,
    onSuccess: () => form.reset('password'),
});
Styling Standards
Tailwind v4 Conventions
Use Tailwind v4 CSS-first setup (`@import 'tailwindcss'`, `@theme`). Never create `tailwind.config.js` for new tokens.

Define all design tokens in `@theme` block of `resources/css/app.css`. Use `@theme inline` when referencing CSS custom properties.

Do not reintroduce Tailwind v3-only patterns (no `content` arrays, no JS-based config).

Prefer `oklch()` for new color definitions; do not bulk-convert existing HSL tokens.

Use container queries (`@sm:`, `@md:`) for reusable components; viewport media queries (`sm:`, `md:`) for page-level layout.

Use `@apply` only for purely visual patterns repeated 3+ times; logic-heavy UI belongs in Vue components.

In Vue style blocks using `@apply`, use `@reference` to the global stylesheet when required.

Tailwind v4 auto-detects `.blade.php`, `.vue`, and `.js` files — do not manually list content paths.

See the `tailwindcss-development` skill for full details.

Performance-Aware Styling
Avoid `transition-all`; prefer scoped transition properties.

Avoid repeated expensive visual effects on list/grid items.

Keep style changes local and predictable.

Error Handling Standards
Handle external/network failures explicitly.

Log actionable context server-side without leaking secrets.

Return user-safe messages; avoid exposing internals in flash/API payloads.

php
try {
    // ...
} catch (\Throwable $exception) {
    Log::error('Profile update failed', ['error' => $exception->getMessage()]);
    throw $exception;
}
Testing Standards
Backend tests use Pest.

Add/update focused tests for changed behavior (validation, authorization, mutation paths).

Run the smallest relevant test set first; expand if needed.

bash
php artisan test --compact tests/Feature/Settings/ProfileUpdateTest.php
Formatting and Tooling
For PHP changes, run Pint on changed files:

bash
vendor/bin/pint --dirty --format agent
Run ESLint/Prettier only when configured and relevant to touched frontend files.

Avoid broad auto-fix runs that create unrelated diffs.

Anti-Patterns to Avoid
Changing architecture during small feature/fix work.

**SRP Violations:**
- God controllers combining unrelated concerns in one class.
- Fat controllers with business logic mixed into HTTP handling.
- Service classes that handle every domain operation instead of being focused.

Introducing new dependencies without explicit approval.

Writing create/update flows with unvalidated mass assignment.

Mixing unrelated refactors into focused fixes.

Rewriting module style (Options API vs script setup) without need.

Remember: Prioritize correctness, security, and consistency with touched-module conventions. Default to Vue Options API for new work, and keep changes small, explicit, and testable.
```
