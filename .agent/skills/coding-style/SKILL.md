---
name: coding-style
description: Apply when enforcing or checking PHP/Laravel and Vue/TypeScript style: types, naming, formatting, file structure, or style consistency.
---

# Coding Style Guide

Quick reference for style consistency in this repository.

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

- Match touched-file conventions before applying generic guidance.
- Vue Options API is the default for new page/feature work.
- Preserve existing `<script setup>` files when touching legacy Composition API code.
- Frontend is Inertia v3 + Tailwind v4, with Reka UI, Lucide icons, and other utility-first libraries.
- Backend should stay thin-controller, Form Request-first, Eloquent-first.
- **Single Responsibility Principle (SRP)**: Each class should have one reason to change. Prefer Single Action Controllers (`__invoke`) for new features.
- Avoid speculative architecture changes during style-only tasks.

## Documentation-First Workflow

1. Use Laravel Boost `search-docs` first for Laravel/Inertia/Pest/Pint/Tailwind behavior.
2. Use Context7 for supplemental examples when needed.
3. If docs and existing module patterns differ, follow local code conventions.

## PHP and Laravel Style

### 1) Types and Signatures (Required)

- Add explicit parameter and return types.
- Prefer nullable and union types over mixed values.
- Use constructor property promotion for injected dependencies.

```php
public function __construct(private UserService $userService) {}

public function show(int $id): ViewResponse
{
    $user = $this->userService->findById($id);

    abort_unless($user !== null, 404);

    return Inertia::render('Users/Show', ['user' => $user]);
}
2) Control Flow and Readability
Always use braces for control structures.

Prefer early returns to reduce nested conditionals.

Keep methods focused and small; extract repeated logic.

php
public function destroy(Project $project): RedirectResponse
{
    if (! auth()->user()?->can('delete', $project)) {
        abort(403);
    }

    $project->delete();

    return to_route('projects.index');
}
3) Validation and Input Safety
Use Form Requests for new or significantly changed mutation flows.

Use $request->validated() for write operations.

Do not introduce $request->all() for create/update payloads.

php
$validated = $request->validated();
$user->fill($validated)->save();
4) Authorization and Security Boundaries
Enforce authz server-side using middleware, policies, or ownership checks.

Treat all request input as untrusted.

Fail closed on authorization failures.

5) Eloquent and Database
Prefer Eloquent relationships/scopes over raw SQL.

Eager load relationships to avoid N+1 issues.

Use transactions for multi-write operations.

Do not concatenate untrusted input into queries.

Vue 3 Style (Options API Default)
1) Preferred Component Shape
Order component options consistently:
name, components, props, emits, data, computed, watch, lifecycle hooks, methods.

vue
<script>
export default {
    name: 'AccountCard',

    props: {
        account: {
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
        isActive() {
            return this.account.status === 'active';
        },
    },

    methods: {
        requestRefresh() {
            this.$emit('refresh');
        },
    },
};
</script>
2) Props, Emits, and Reactivity Rules
Use object-style prop declarations (type/default/required).

Never mutate props directly; derive local state when needed.

Use events (update:*, custom emits) for parent updates.

Keep derived state in computed properties, not template methods.

3) Template and Rendering Rules
Keep templates simple; move complex logic into computed/methods.

Avoid v-html; if unavoidable, sanitize first.

Use a single root element per component.

Use stable keys (id, UUID), never array index for mutable lists.

4) Inertia Client Conventions
Use <Link> and router.* for navigation/stateful visits.

Use useForm or <Form> based on touched-module conventions.

Use partial reloads (only / except) to reduce payloads.

Preserve scroll/state only when behavior requires it.

TypeScript and JavaScript Style
Keep imports at the top of the file; avoid inline imports.

Prefer const by default; use let only when reassignment is required.

Use async/await with try/catch for async side effects.

Prefer narrow types over any; make switch exhaustive for unions/enums.

Remove debug console.log statements before finalizing.

ts
type Status = 'draft' | 'published';

function labelFor(status: Status): string {
    switch (status) {
        case 'draft':
            return 'Draft';
        case 'published':
            return 'Published';
        default: {
            const unreachable: never = status;
            return unreachable;
        }
    }
}
Styling Conventions (Tailwind v4)
Use Tailwind v4 conventions (@import "tailwindcss";, @theme).

Keep utility classes grouped and readable.

Avoid transition-all; prefer property-specific transitions.

Avoid repeated expensive blur effects in card/list grids.

Respect existing dark mode patterns where present.

Do not introduce unrelated styling systems in touched modules.

For consistent UI primitives, leverage existing Reka UI components and Lucide icons where appropriate.

Testing and Formatting
Add or update tests for behavior changes (Pest feature/unit tests).

Run the smallest relevant test scope first.

Run Pint before finalizing PHP edits:

vendor/bin/pint --dirty --format agent

Run frontend lint/format checks only when touched files and scripts require it.

Anti-Patterns to Avoid
Large style-only rewrites that change runtime behavior.

Adding new architectural layers for simple CRUD flows.

Mixing Options API and Composition API styles within the same file.

Hidden side effects in computed properties.

Direct model writes from unvalidated request payloads.

**SRP Violations:**
- God controllers combining unrelated concerns.
- Fat controllers with business logic mixed into HTTP handling.
- Classes that accumulate unrelated responsibilities over time.

Completion Checklist
Matches touched-module conventions.

Uses Vue Options API for new work unless file already follows <script setup>.

Uses validated input for write operations.

Enforces server-side authorization for sensitive actions.

Keeps CSS changes performance-safe (no broad transitions/expensive effects).

Includes relevant tests and required formatting pass.
```
