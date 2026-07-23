---
paths:
  - "**/*.vue"
---

# Vue Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Vue specific content.

This project is Options API only (see [coding-style.md](coding-style.md)). The patterns below are the Options API equivalents of the usual Composition API playbook — composables, `provide()`/`inject()` functions, Pinia setup stores, and Composition-shaped data-fetching libraries are all out of scope for new code.

## Mixins (the Options API reuse unit)

- The mixin is the reusable-logic unit — the direct Options API analog of a composable. It exports a plain options object (`data()`, `methods`, `computed`, lifecycle hooks) and is consumed via a component's `mixins: [...]` array.
- Keep mixin `data()` keys and method names namespaced or distinctive enough to avoid silent collisions with the consuming component — Vue resolves collisions by component-wins, mixin-loses, which is easy to misread.
- Lifecycle hooks defined in both a mixin and the component **both run** (mixin's hook first, then the component's) — they do not override each other the way `data()`/`methods` do.
- A mixin used by exactly one component is unnecessary indirection — inline the logic instead.
- Prefer local `mixins: [...]` per component over a global `app.mixin(...)`, which is invisible from any single component's file and affects every component in the app.

## Props, Emits, Two-Way Binding

- Declare `props` as an object with `type` and `required`/`default` per key. Declare `emits` as an array (or an object with runtime validators for critical events).
- There is no `defineModel` macro. Wire `v-model` manually: a `modelValue` prop, `emits: ['update:modelValue']`, and a `computed` with `get`/`set` that reads the prop and emits on write.

## Provide / Inject

- Options API components use the `provide` and `inject` **component options**, not the `provide()`/`inject()` free functions (those are Composition API and only callable inside `setup()`).
- `provide` as a function-returning-object form (`provide() { return { [myKey]: this.someValue } }`) is required whenever the provided value depends on component instance state — the plain-object form (`provide: { key: staticValue }`) only works for values that never change.
- Type-safe collision-free keys: `const key = Symbol() as InjectionKey<T>`, referenced identically in both the providing and injecting component's `provide`/`inject` options.
- The provider owns mutations. Provide a value plus an explicit method (also provided) that performs the update — never a raw mutable reference that any descendant can write to directly.

```ts
import { defineComponent, type InjectionKey } from 'vue'

interface ThemeContext {
  theme: string
  setTheme: (value: string) => void
}

export const themeKey = Symbol() as InjectionKey<ThemeContext>

export default defineComponent({
  data() {
    return { theme: 'light' }
  },
  provide() {
    return {
      [themeKey]: {
        get theme() {
          return this.theme
        },
        setTheme: (value: string) => {
          this.theme = value
        },
      },
    }
  },
})
```

## Pinia — Options Stores Only

- Define every store with `defineStore('id', { state: () => ({...}), getters: {...}, actions: {...} })`. Never the setup-store form (`defineStore('id', () => { const x = ref(0); return { x } })`) — that is Composition API syntax regardless of which kind of component consumes it.
- Consume stores via `mapState`/`mapGetters`/`mapActions` mapped into a component's `computed`/`methods` options, on a component wrapped in `defineComponent({...})` (required for correct type inference with the map helpers).
- Multi-field business mutations belong in `actions`, not scattered direct state writes from components.
- Never persist raw auth tokens to `localStorage`.

```ts
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/useUserStore'

export default defineComponent({
  computed: {
    ...mapState(useUserStore, ['user', 'isLoggedIn']),
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
  },
})
```

## vue-router

- Lazy-load route components with dynamic `import()` in the route config — this is router configuration, not component-level Composition API, and is unaffected by the Options-only rule.
- A global `beforeEach` auth gate keyed on `meta.requiresAuth`. Guards return `false` (cancel), a route location (redirect), or `undefined` / `true` (continue).
- Watch route params via the `watch` component option, not a composable: `watch: { '$route.params.id': 'loadRecord' }` (string handler name) or `watch: { '$route'(to) { this.loadRecord(to.params.id) } }`. Reading `this.$route.params.id` once in `created()` and caching it goes stale on in-place navigation to the same route component.

## Server-cache data fetching

- TanStack Vue Query (`useQuery`/`useMutation`) is Composition-API-shaped by design — it returns refs meant to be consumed where reactivity composition applies. Do not adopt it as the default data-fetching layer here.
- Default pattern: fetch in a lifecycle hook (`created()`/`mounted()`), store the result via a Pinia Options-store action, and let Pinia's `state` be the single server-cache source of truth. Invalidate/refetch by calling the action again after a mutation.
- If a specific screen has a hard requirement that only a Composition-shaped library satisfies (e.g. built-in request de-duplication and background refetch that would otherwise need reimplementing), that is the kind of case that justifies the narrow, documented `setup()` escape hatch described in [coding-style.md](coding-style.md) — not a reason to convert the surrounding component to Composition API.

## Reference

- ECC skills: `frontend-patterns`, `vite-patterns`.
- Docs: <https://vuejs.org/guide/typescript/options-api.html> · <https://vuejs.org/api/options-composition.html#provide> · <https://pinia.vuejs.org/core-concepts/#option-stores> · <https://router.vuejs.org/>
