---
paths:
  - "**/*.vue"
---

# Vue Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Vue specific content.

> **Applicability to this project.** This repo uses `<script setup>` + Composition
> API with Inertia v2. It has **no Pinia and no vue-router installed**, so the
> Options API, mixin, Pinia and vue-router sections below do not apply here —
> see [coding-style.md](coding-style.md) for what this codebase actually does.
> Reuse logic through plain modules in `resources/js/helpers` and `lib`, or
> composables in `resources/js/composables`. Shared server state arrives as
> Inertia page props; do not mirror it into a client store.

## Reusable Logic

Options API has three reuse units. Pick the lowest one that works:

1. **Plain module** — pure functions with no component state (`formatBid`, `parseDuration`). Import and call from `methods` or `computed`. Always prefer this.
2. **Mixin** — when the logic needs `data`, `computed`, `watch`, or lifecycle hooks. Merge rules: `data` objects merge (component wins on key clash), hooks from all mixins run before the component's own, `methods`/`computed` clash silently in the component's favour.
3. **`extends`** — a single base component. Same merge rules as a mixin, one parent only.

Mixin discipline, because the collisions are real:

- Namespace everything a mixin contributes (`auctionTimer_remaining`, not `remaining`), so a clash is a visible naming decision instead of a silent override.
- One mixin, one concern. Never a `commonMixin`.
- A mixin must clean up whatever it starts, in its own `beforeUnmount`.
- Document every property a mixin expects the host component to define.
- In Feature-Sliced Design, mixins live in the slice `model` segment.

## Props, Emits, v-model

- `props` object syntax with `type` plus `required`/`default`; Object and Array defaults are factory functions. Use `PropType<T>` for typed shapes.
- Declare `emits` explicitly, object form with validators.
- `v-model` is `modelValue` + `update:modelValue`. Named models are `title` + `update:title`.
- Never mutate a prop. Copy into `data()` for a local draft, or emit up.

```ts
props: {
  modelValue: { type: String, default: '' },
},
emits: {
  'update:modelValue': (value: string) => typeof value === 'string',
},
computed: {
  localValue: {
    get(): string {
      return this.modelValue
    },
    set(value: string) {
      this.$emit('update:modelValue', value)
    },
  },
},
```

## Provide / Inject

- Use `provide` / `inject` for tree-scoped data without prop drilling.
- `provide` must be a **function** to reach `this`. Returning `this.theme` provides a snapshot; wrap in `computed(() => this.theme)` for a live value.
- `inject` object form takes `from` and `default`. A factory default needs `default: () => ({})`.
- The provider owns mutations. Provide a read-only value plus an explicit updater method, never a raw mutable object.

```ts
import { computed } from 'vue'

// provider
provide() {
  return {
    theme: computed(() => this.theme),
    setTheme: this.setTheme,
  }
},

// consumer
inject: {
  theme: { from: 'theme', default: null },
},
```

## Pinia (FSD model segment)

- Use **option stores**: `state` is a function, `getters` are `this`-aware functions, `actions` are methods. Option stores mirror Options API components and get `$reset` for free.
- Map into components with `mapState` (state + getters, read-only), `mapWritableState` (assignable state), and `mapActions`. Spread them into `computed` / `methods`.
- Prefer actions for business-level mutations and `$patch()` for grouped updates.
- Never persist raw auth tokens to `localStorage`.

```ts
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[], isLoading: false }),
  getters: {
    itemCount: (state) => state.items.reduce((n, i) => n + i.quantity, 0),
  },
  actions: {
    async addItem(productId: string) { /* ... */ },
  },
})

// component
computed: { ...mapState(useCartStore, ['items', 'itemCount']) },
methods: { ...mapActions(useCartStore, ['addItem']) },
```

## vue-router

- Lazy-load route components with dynamic `import()`.
- In components use `this.$route` and `this.$router`. In-component guards are the options `beforeRouteEnter` (no `this` yet — use the `next(vm => ...)` callback), `beforeRouteUpdate`, `beforeRouteLeave`.
- A global `beforeEach` auth gate keyed on `meta.requiresAuth`. Guards return `false` (cancel), a route location (redirect), or `undefined` / `true` (continue).
- Watch `'$route.params.id'`, not the whole `$route` object.

```ts
watch: {
  '$route.params.id': { handler: 'fetchItem', immediate: true },
},
```

## Server Cache

- `@tanstack/vue-query` is Composition API only — its hooks require a `setup` context. Do not try to call `useQuery` from `methods` or `created`.
- Default to plain fetch functions in the FSD `api` segment, called from `created`/`mounted` into `data()` fields, with explicit `isLoading` / `error` state.
- If a query library is genuinely required, isolate it in one thin component that declares a `setup()` option alongside its Options API options, and keep the rest of the tree Options API.

## Reference

- ECC skills: `frontend-patterns`, `vite-patterns`.
- Docs: <https://vuejs.org/api/options-composition.html> · <https://vuejs.org/guide/reusability/composables.html#option-api> · <https://pinia.vuejs.org/core-concepts/> · <https://router.vuejs.org/>
