---
name: frontend-patterns
description: Vue-focused implementation patterns for maintainable, performant client-side code.
---

# Frontend Development Patterns

Vue-focused implementation patterns for maintainable, performant client-side code.

**Last Updated**: 2026-04-29

## Version Snapshot (Verified)

- Vue `3.5.33`
- `@inertiajs/vue3` `3.0.3`
- Tailwind CSS `4.2.4`
- Vite `8.0.9`
- TypeScript `5.9.3` (optional by file/module)

## Project Reality Overrides (Highest Priority)

- Follow touched-file/module conventions first.
- Vue Options API is the default for new page/feature work.
- Preserve existing `<script setup>` files when touching Composition API code.
- Frontend styling is Tailwind v4 with Reka UI, Lucide icons, and other utility-first libraries; keep legacy styling patterns where already established.
- Module interactions may use `axios` and can coexist with Inertia navigation.
- TypeScript examples are optional patterns, not mandatory for JS SFC files.

## Scope Boundaries

- This rule is for client-side Vue component architecture and behavior.
- For page-level Inertia request/response flows, see relevant rules.
- For frontend animation/CSS performance constraints, see relevant rules.
- For security hardening (XSS, authz boundaries, input trust), follow security rules.

## Documentation-First Workflow

1. Use Laravel Boost `search-docs` first for Inertia/Tailwind ecosystem behavior.
2. Use Context7 for Vue API/style-guide specifics.
3. If docs and touched-module conventions differ, keep local conventions and change incrementally.

## Vue 3 Options API: The SRP Approach

While the industry often pushes the Composition API, the Options API is still robust in 2026. To prevent bloated Vue components (the "God Component" problem), follow these three principles:

### Extract Logic to Actions

Do not put complex API calls or data transformation inside `methods`. Create a directory at `resources/js/helpers` and import them.

```js
// resources/js/helpers/formatCurrency.js
export function formatCurrency(amount, currency = 'PHP') {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency,
    }).format(amount);
}
```

```vue
<script>
import { formatCurrency } from '@/Actions/formatCurrency';

export default {
    name: 'PriceDisplay',
    props: {
        amount: { type: Number, required: true },
    },
    computed: {
        formattedPrice() {
            return formatCurrency(this.amount);
        },
    },
};
</script>
```

### Prop-Driven Design

Keep your `data()` minimal. If a component is getting too large, it's likely handling too much state. Split it into smaller child components that receive data via `props`.

### DefineModel for Simplified Two-Way Binding

If you find yourself struggling with the "bloat" of the Options API's `data`, `methods`, and `computed` for two-way binding, look into Vue 3 `defineModel`. It simplifies two-way data binding between Laravel/Inertia forms and Vue inputs, cutting down on boilerplate significantly.

## Component Structure (Options API Default)

Keep option ordering predictable:
`name`, `components`, `props`, `emits`, `data`, `computed`, `watch`, lifecycle hooks, `methods`.

```vue
<script>
import ChildCard from '@/components/ChildCard.vue';

export default {
    name: 'AccountList',

    components: {
        ChildCard,
    },

    props: {
        accounts: {
            type: Array,
            required: true,
        },
    },

    emits: ['refresh'],

    data() {
        return {
            filter: '',
        };
    },

    computed: {
        filteredAccounts() {
            return this.accounts.filter((account) => account.name.toLowerCase().includes(this.filter.toLowerCase()));
        },
    },

    methods: {
        requestRefresh() {
            this.$emit('refresh');
        },
    },
};
</script>
Props, Emits, and One-Way Data Flow
Prefer object-style prop definitions over array syntax for non-trivial components.

Declare emits explicitly for emitted events.

Do not mutate props directly; create local derived state if needed.

vue
<script>
export default {
    props: {
        status: {
            type: String,
            required: true,
        },
    },

    emits: ['update:status'],

    data() {
        return {
            localStatus: this.status,
        };
    },

    watch: {
        status(newValue) {
            this.localStatus = newValue;
        },
    },

    methods: {
        save() {
            this.$emit('update:status', this.localStatus);
        },
    },
};
</script>
Reactivity Patterns
Computed vs Methods
Use computed for derived/cached state.

Use methods for actions/side effects (submissions, router calls, API requests).

Keep complex branching out of templates.

Watchers
Use watchers for side effects, not for redundant derived state.

Clean up timers/subscriptions in beforeUnmount.

Avoid broad deep: true watchers unless truly required.

Async and Data Fetching
Use clear loading/error/data states.

Wrap async operations in try/catch/finally.

Standardize response/error handling with surrounding module conventions.

vue
<script>
import axios from 'axios';

export default {
    data() {
        return {
            rows: [],
            isLoading: false,
            errorMessage: '',
        };
    },

    async mounted() {
        await this.loadRows();
    },

    methods: {
        async loadRows() {
            this.isLoading = true;
            this.errorMessage = '';

            try {
                const response = await axios.get('/api/rows');
                this.rows = response.data;
            } catch (error) {
                this.errorMessage = 'Unable to load rows.';
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>
Inertia Integration Touchpoints
Use <Link> and router.* for navigation and stateful visits.

Prefer useForm or <Form> based on touched-module conventions.

Use partial reloads (only / except) when updating subset props.

If adopting deferred props UI, include a clear loading fallback/skeleton.

State Management
Prefer local component state for local concerns.

Extend existing shared store modules before introducing new ad-hoc stores.

Keep mutations explicit and predictable.

Avoid mutating shared/global state from deeply nested child components without clear action pathways.

Template and Rendering Rules
Keep a single root element in Vue components.

Use stable keys (id/uuid) for dynamic lists; avoid array index for mutable collections.

Keep templates declarative; move business logic into computed/methods.

Avoid v-html; if unavoidable, sanitize input before rendering.

Styling and UI Consistency
Follow existing Tailwind v4 and component conventions in touched files.

Use `@theme` in `app.css` for design tokens — never create `tailwind.config.js`.

Scoped Styling via Container Queries: Use `@sm:`, `@md:` instead of viewport `sm:`, `md:` for reusable components. This ensures the Vue component looks correct regardless of where it is placed in your layout.

Prefer `oklch()` for new color values; keep existing HSL tokens stable.

Prefer reusable UI components (Reka UI, Lucide icons, custom primitives) over repeated long utility strings.

Use `@apply` only for purely visual patterns repeated 3+ times; logic belongs in Vue components.

Keep imports at the top of file; avoid inline imports.

Do not introduce unrelated styling systems in a touched module.

See the `tailwindcss-development` skill for full VILT Tailwind v4 conventions.

Frontend Performance Guardrails
Avoid transition-all; use property-specific transitions.

Avoid repeated expensive blur effects on grid/list cards.

Avoid smooth-scroll on full content containers; use user-triggered smooth scrolling only.

Consider paint containment on repeated list/grid item roots where safe.

Accessibility Baseline
Use semantic interactive elements (button, a) instead of clickable divs.

Ensure keyboard support for menus/modals/dropdowns.

Ensure visible focus states and correct ARIA attributes where needed.

Restore focus after dialogs/overlays close.

Anti-Patterns to Avoid
Mixing Options API and Composition API patterns in one SFC.

Direct prop mutation or hidden parent-state mutation.

Silent async failures with empty catch blocks.

Overusing deep watchers for large objects.

Shipping debug console.log statements in finalized code.

Putting complex API calls or data transformations directly in `methods` instead of extracting to `resources/js/helpers`.

"God Components" — components with excessive `data()`, `methods`, and `computed` that should be split into smaller children.

Completion Checklist
Follows touched-file conventions and Options API default for new work.

Complex logic extracted to `resources/js/helpers` (not inline in `methods`).

Uses explicit props/emits and avoids direct prop mutation.

Handles loading/error states for async actions.

Keeps templates simple and keys stable.

Applies performance-safe transition/effect choices.

Preserves accessibility for interactive UI.

Container queries used for scoped component styling.
```
