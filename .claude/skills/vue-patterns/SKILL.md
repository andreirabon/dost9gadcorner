---
name: vue-patterns
description: Vue.js 3 Options API patterns, component architecture, reactivity best practices, Pinia state management, Vue Router navigation, and SSR patterns. Activates for Vue, Nuxt, Vite, or Pinia projects.
origin: ECC
---

# Vue.js Patterns and Best Practices

Comprehensive guide for Vue.js 3 development using the **Options API** (`export default defineComponent({ ... })`), covering component design, reactivity, state management, routing, testing, and SSR patterns.

> **House rule: Options API only.** New components use `<script>` with `defineComponent`. Do not use `<script setup>`, the `setup()` option, `ref`/`reactive`/`computed()` as standalone functions, or the `defineProps`/`defineEmits`/`defineModel` macros. The one sanctioned exception is a third-party library that ships composables with no imperative equivalent — see §10.

## When to Activate

Activate this skill when:
- The project uses Vue.js (any version), Nuxt, Vite + Vue, or Pinia.
- The user asks about Vue component architecture, shared logic, reactivity, or state management.
- Reviewing Vue Single-File Components (`.vue` files).
- Setting up Vue Router, Pinia stores, or Vite/Vitest configuration.
- Discussing Vue-specific performance, security, or SSR patterns.

---

## 1. Project Structure

### Recommended Layout (Feature-First)

```
src/
├── api/              # API client and endpoint definitions
├── assets/           # Static assets (images, fonts, icons)
├── components/       # Shared/reusable components
│   ├── base/         # Base UI primitives (Button, Input, Modal)
│   └── features/     # Feature-specific shared components
├── mixins/           # Shared Options API mixins
├── layouts/          # Page layouts (optional)
├── pages/            # Route-level page components
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
├── utils/            # Pure utility functions (preferred over mixins)
└── App.vue           # Root component
```

### File Naming

| Convention | When to Use |
|-----------|-------------|
| `PascalCase.vue` | All components (enforced by `vue/multi-word-component-names`) |
| `camelCaseMixin.ts` | Mixins |
| `camelCase.ts` | Utilities, API clients, types |
| `kebab-case` directories | Route segments, feature folders |

---

## 2. Component Architecture

### Single-File Component Order

```vue
<script lang="ts">
import { defineComponent } from 'vue'
// 1. Imports (vue → ecosystem → absolute → relative)

export default defineComponent({
  name: 'MyComponent',   // 2. name
  components: {},        // 3. components
  mixins: [],            // 4. mixins
  inheritAttrs: true,    // 5. inheritAttrs
  props: {},             // 6. props
  emits: {},             // 7. emits
  data() { return {} },  // 8. data
  computed: {},          // 9. computed
  watch: {},             // 10. watch
  created() {},          // 11. lifecycle, in call order
  mounted() {},
  beforeUnmount() {},
  methods: {},           // 12. methods
})
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
  /* Scoped styles */
</style>
```

`eslint-plugin-vue`'s `vue/order-in-components` enforces this order.

### Presentational vs Container

- **Container components**: Own data fetching, state, and side effects. Render presentational components.
- **Presentational components**: Receive props, emit events. No API calls, no store access. Pure rendering.

### Props Best Practices

```ts
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'ItemList',

  props: {
    label: { type: String, required: true },
    variant: {
      type: String as PropType<'primary' | 'secondary'>,
      default: 'primary',
      validator: (v: string) => ['primary', 'secondary'].includes(v),
    },
    disabled: { type: Boolean, default: false },
    items: { type: Array as PropType<Item[]>, default: () => [] },
  },
})
```

- Always provide `type`, plus `required`/`default` where appropriate.
- **Object and Array defaults must be factory functions** (`default: () => []`). A shared literal leaks mutations across every instance.
- Boolean props: `isXxx`, `hasXxx`, `canXxx`. A `Boolean` prop defaults to `false` — do not give it `default: true` without a good reason, it makes the shorthand `<Comp />` misleading.
- Never mutate props — emit events instead.
- For `v-model` binding, use the `modelValue` prop + `update:modelValue` emit.

### Events

```ts
emits: {
  submit: null,                                            // no validation
  'update:modelValue': (value: string) => typeof value === 'string',
  select: (id: string, index: number) => Boolean(id) && index >= 0,
},

methods: {
  onPick(id: string, index: number): void {
    this.$emit('select', id, index)
  },
},
```

- Declare every event in `emits`. Undeclared events fall through to the root element as native listeners.
- Use kebab-case in templates (`@update:model-value`), camelCase in script (`this.$emit('update:modelValue', val)`).

### v-model on a Custom Component

```ts
export default defineComponent({
  name: 'BaseInput',
  props: { modelValue: { type: String, default: '' } },
  emits: { 'update:modelValue': (v: string) => typeof v === 'string' },
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
})
```

```vue
<template>
  <input v-model="localValue" />
</template>
```

A `computed` bound to `v-model` **must** have both `get` and `set`, or writes vanish silently.

---

## 3. Reusable Logic

Pick the lowest option that works.

### 3a. Plain Module (preferred)

Pure functions with no component state. Zero merge risk, trivially testable, tree-shakable.

```ts
// utils/debounce.ts
export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  const wrapped = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  wrapped.cancel = () => { if (timer) clearTimeout(timer) }
  return wrapped
}
```

```ts
// component
import { debounce } from '@/utils/debounce'

export default defineComponent({
  created() {
    this.search = debounce(this.runSearch, 300)
  },
  beforeUnmount() {
    this.search.cancel()
  },
  methods: {
    runSearch(): void { /* ... */ },
  },
})
```

### 3b. Mixin

Only when the logic needs `data`, `computed`, `watch`, or lifecycle hooks.

```ts
// mixins/windowSizeMixin.ts
import { defineComponent } from 'vue'

export const windowSizeMixin = defineComponent({
  data() {
    return {
      windowSize_width: window.innerWidth,
      windowSize_height: window.innerHeight,
    }
  },
  computed: {
    windowSize_isMobile(): boolean {
      return this.windowSize_width < 768
    },
  },
  mounted() {
    window.addEventListener('resize', this.windowSize_onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.windowSize_onResize)
  },
  methods: {
    windowSize_onResize(): void {
      this.windowSize_width = window.innerWidth
      this.windowSize_height = window.innerHeight
    },
  },
})
```

**Merge rules — know these before writing a mixin:**

| Option | Merge behaviour on collision |
|--------|------------------------------|
| `data` | Shallow-merged; **component wins**, silently |
| `methods`, `computed`, `components`, `directives` | **Component wins**, silently |
| Lifecycle hooks | **Both run** — mixin first, then component |
| `watch` on the same key | **Both run** |
| `props`, `emits` | Merged; component wins on the same key |

**Mixin rules:**

- Namespace every key the mixin contributes (`windowSize_width`, not `width`), so a clash is a visible naming decision rather than a silent override.
- One mixin, one concern. Never a `commonMixin`.
- The mixin cleans up whatever it starts, in its own `beforeUnmount`.
- Document any property the mixin expects the host component to define.
- Keep the chain flat — mixins should not include mixins.
- Wrap in `defineComponent()` so TypeScript merges the `this` type into consuming components.

### 3c. `extends`

A single base component, same merge rules as a mixin. Use for "this component is a specialization of that one". One parent only.

---

## 4. State Management

### When to Use What

| Pattern | Use Case |
|---------|----------|
| `data()` | Local component state |
| `computed` | Anything derived from state or props |
| Props + Emits | Parent-child communication |
| Provide / Inject | Theme, config, plugin API |
| Pinia store | Global, shared, complex state |
| Plain API module + `data()` | Server data fetched in `created`/`mounted` |

### Pinia Option Store (Preferred)

```ts
// stores/useCartStore.ts
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isLoading: false,
  }),

  getters: {
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
  },

  actions: {
    async addItem(productId: string) {
      this.isLoading = true
      try {
        const item = await fetchProduct(productId)
        const existing = this.items.find(i => i.id === item.id)
        if (existing) {
          existing.quantity++
        } else {
          this.items.push({ ...item, quantity: 1 })
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
```

- Use **Option Store** syntax (not Setup Store). It mirrors Options API components and gets `$reset()` for free.
- A getter needing `this` must be a regular function with an explicit return type: `total(): number { return this.items.length }`. Arrow getters only get `state`.
- Prefer actions for business-level mutations and `$patch()` for grouped updates.
- Every async action: handle loading + success + error.

### Consuming a Store in a Component

```ts
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useCartStore } from '@/stores/useCartStore'

export default defineComponent({
  name: 'CartSummary',

  computed: {
    ...mapState(useCartStore, ['items', 'totalPrice', 'itemCount']),  // read-only
    ...mapWritableState(useCartStore, ['isLoading']),                 // assignable
  },

  methods: {
    ...mapActions(useCartStore, ['addItem']),
  },
})
```

- `mapState` covers state **and** getters, read-only. Assigning to a `mapState` key fails silently — use `mapWritableState`.
- Rename on collision: `...mapState(useCartStore, { cartItems: 'items' })`.

---

## 5. Vue Router

### Route Definitions

```ts
const routes = [
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/pages/UserDetail.vue'), // lazy
    props: true, // pass params as props — keeps the component decoupled from the router
    meta: { requiresAuth: true },
  },
]
```

`props: true` is the cleanest Options API pattern: the param arrives as a normal prop, so a `watch` on it works with no `$route` coupling.

### Navigation Guards

```ts
// global
router.beforeEach((to) => {
  const { isLoggedIn } = useAuthStore()
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

```ts
// in-component
export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // `this` does NOT exist yet — the component is not created
    next((vm) => {
      // `vm` is loosely typed here; cast to your component type if you need strictness
      (vm as unknown as { fetchItem(id: string): void }).fetchItem(to.params.id as string)
    })
  },

  beforeRouteUpdate(to) {
    // same component reused with new params — `this` IS available
    this.fetchItem(to.params.id as string)
  },

  beforeRouteLeave() {
    if (this.isDirty) return window.confirm('Discard unsaved changes?')
  },
})
```

### Reactive Route Params

When a component stays mounted but route params change:

```ts
export default defineComponent({
  computed: {
    id(): string {
      return this.$route.params.id as string
    },
  },
  watch: {
    id: { handler: 'fetchItem', immediate: true },
  },
  methods: {
    async fetchItem(id: string) { /* ... */ },
  },
})
```

Watch the specific path, never the whole `$route` object.

---

## 6. Template Patterns

```vue
<!-- v-if/v-else-if/v-else -->
<div v-if="isLoading">Loading...</div>
<div v-else-if="error">Error: {{ error }}</div>
<div v-else>{{ content }}</div>

<!-- v-show for frequent toggles -->
<div v-show="isOpen">Toggled content</div>

<!-- v-for with stable keys -->
<div v-for="item in items" :key="item.id">{{ item.name }}</div>

<!-- Computed filtered list (not v-if + v-for on same element) -->
<div v-for="item in activeItems" :key="item.id">{{ item.name }}</div>

<!-- Event handling -->
<form @submit.prevent="handleSubmit">
  <button type="submit">Save</button>
</form>

<!-- v-model -->
<input v-model="name" />
<CustomInput v-model="value" v-model:title="title" />

<!-- Template ref -->
<input ref="emailInput" />
```

```ts
mounted() {
  (this.$refs.emailInput as HTMLInputElement).focus()
}
```

`this.$refs` is empty until `mounted`, and stale after the element is `v-if`-ed away.

---

## 7. Performance

| Technique | When to Use |
|-----------|-------------|
| `computed` over a template-called method | Anything derived from state — methods have no cache |
| `v-memo` | List items that rarely change |
| `v-once` | Content rendered once and static forever |
| `markRaw()` in `data()` | Large read-only datasets, chart/map/client instances |
| `v-show` over `v-if` | Frequent visibility toggles |
| `<KeepAlive :max="10">` | Cache toggled views |
| Lazy routes | `() => import(...)` for non-critical routes |
| `Suspense` | Async component loading with fallback |
| `defineAsyncComponent` | Heavy components below the fold |

`data()` deep-proxies everything it returns. Non-reactive instances (Chart.js, Leaflet map, WebSocket client) belong on `this` assigned in `mounted`, or wrapped in `markRaw()`.

---

## 8. Testing

### Stack

- **Vitest** for unit and component tests
- **Vue Test Utils** for mounting and interaction
- **@pinia/testing** for store mocking
- **Playwright** for E2E

### Component Test Pattern

```ts
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import UserCard from './UserCard.vue'

it('renders and emits', async () => {
  const wrapper = mount(UserCard, {
    props: { user: { id: '1', name: 'Alice' } },
    global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
  })

  expect(wrapper.text()).toContain('Alice')
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('select')![0]).toEqual(['1'])
})
```

### Testing a Mixin

Mixins only exist merged. Mount a throwaway host:

```ts
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { windowSizeMixin } from '@/mixins/windowSizeMixin'

const Host = defineComponent({ mixins: [windowSizeMixin], template: '<div />' })

it('cleans up its resize listener on unmount', () => {
  const remove = vi.spyOn(window, 'removeEventListener')
  mount(Host).unmount()
  expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
})
```

Test the public interface — props, emitted events, slots, rendered output. Do not assert on private `data` fields, and do not rely solely on snapshots.

---

## 9. SSR Notes

- `mounted` never runs on the server. It is the natural guard for `window`, `document`, and `localStorage`.
- `created` **does** run on the server — no browser APIs there.
- Do not start timers or subscriptions in `created`; the server never calls `beforeUnmount`, so they leak.
- Keep secrets out of anything serialized into the client payload.

---

## 10. The `setup()` Escape Hatch

Some libraries ship composables with no imperative equivalent (`@tanstack/vue-query`, Nuxt's `useAsyncData`/`useFetch`, `@laravel/echo-vue`). An Options API component may declare a `setup()` option alongside its other options; whatever it returns is merged and reachable as `this.x`.

```ts
export default defineComponent({
  name: 'OrderFeed',

  props: { orderId: { type: Number, required: true } },

  // bridge only — everything else stays Options API
  setup(props) {
    useEcho(`orders.${props.orderId}`, 'OrderShipped', (e) => { /* ... */ })
    return {}
  },

  data() {
    return { events: [] as OrderEvent[] }
  },
})
```

Rules for using it:

- Only when the library has no imperative API. Check first — most do (Inertia has `router.poll()`, Echo has the `echo()` singleton).
- Keep it to one thin component and comment why it exists.
- `setup()` cannot access `this`. Props arrive as its first argument.
- Never use it as a backdoor to write Composition API components.

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | The Fix |
|-------------|---------------|---------|
| `<script setup>` / `setup()` in new code | Project standardizes on Options API | `export default defineComponent({ ... })` |
| `data: { count: 0 }` (object, not function) | State shared across all instances | `data() { return { count: 0 } }` |
| `this.x = []` for state never declared in `data()` | Not reactive, never re-renders | Declare it in `data()`, `null` if needed |
| Arrow function for `data`/`computed`/`methods`/hooks | `this` is not the component | Use regular function syntax |
| `default: []` / `default: {}` on a prop | One literal shared by every instance | Factory: `default: () => []` |
| `v-model` on a getter-only `computed` | Writes silently discarded | `{ get, set }` object form |
| `this.$emit` without an `emits` entry | Falls through as a native listener, skips validation | Declare in `emits` |
| Expensive derivation in a template-called method | No caching, runs every render | Move to `computed` |
| Chart/map/socket instance in `data()` | Deep-proxied; slow, often breaks the library | Assign in `mounted` or wrap in `markRaw()` |
| `this` inside `beforeRouteEnter` | Instance not created yet | `next(vm => ...)` |
| Grab-bag `commonMixin` | Unknowable merge order and ownership | One mixin per concern, namespaced keys |
| Un-namespaced mixin keys | Silent override on collision, no warning | Prefix with the mixin name |
| Mixin without `beforeUnmount` cleanup | Memory leak per host component | Tear down in the mixin itself |
| Stateless logic as a mixin | Merge risk for no benefit | Plain module imported into `methods` |
| `mapState` for a value the component writes | Assignment fails silently | `mapWritableState` or an action |
| Pinia setup store | Mismatch with Options API, loses `$reset` | Option store (`state`/`getters`/`actions`) |
| `v-if` + `v-for` on same element | Ambiguous execution order | Computed filtered array |
| `v-for` key = index | Broken state on reorder | Stable database IDs |
| Mutating props | Violates one-way data flow | Emit events or use `v-model` |
| `v-html` with user content | XSS vulnerability | Sanitize with DOMPurify in a `computed` |
| `this.$set` / `Vue.set` | Removed in Vue 3 | Direct assignment — Proxies handle it |
| `beforeDestroy` / `destroyed` | Vue 2 names, never fire in Vue 3 | `beforeUnmount` / `unmounted` |
| `$refs` read in `created` | Not populated until `mounted` | Read in `mounted` or after `$nextTick()` |

## Related Skills

- `accessibility` — ARIA, semantic HTML, focus management
- `frontend-patterns` — Cross-framework frontend architecture
- `typescript` — TypeScript best practices applied to Vue projects
- `coding-standards` — General code quality standards
