---
paths:
  - "**/*.vue"
---

# Vue Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with Vue specific content.

## Options API Only

This project standardizes on the **Options API exclusively**. Never use `<script setup>`, the `setup()` component option, or free-function reactivity APIs (`ref`, `reactive`, `computed()`, `watch()`, `watchEffect()`, `onMounted()`, `provide()`/`inject()` as functions). Every component exports an options object — ideally wrapped in `defineComponent({...})` for TypeScript inference — using `data()`, `computed`, `methods`, `watch`, `props`, `emits`, and lifecycle hook keys (`created`, `mounted`, `beforeUnmount`, etc).

The only sanctioned exception is a narrowly-scoped `setup()` call to consume a third-party API that ships no Options API equivalent at all (e.g. certain Nuxt-only composables). Justify it with a comment, keep it to the minimum surface needed, and never use it to restructure the component's core logic.

## SFC Structure

- `<script lang="ts">` exporting `defineComponent({...})`. No `<script setup>`.
- Block order inside a `.vue` file: `<script>`, then `<template>`, then `<style scoped>`. One component per file.
- Naming: component files PascalCase (`AuctionCard.vue`), mixin files camelCase prefixed with what they do (`sortableMixin.ts`, not `useSortable.ts` — the `use` prefix signals a composable and is reserved for the Composition API convention this project doesn't use).
- Format with Prettier plus ESLint flat config using `eslint-plugin-vue` (`vue/vue3-recommended`). Type-check with `vue-tsc`.

## Reactivity Discipline (Options API)

- `data()` must always return a **new object** — never a shared module-level object literal, and never an arrow function that closes over external mutable state. Each component instance needs its own copy.
- Use regular `function`/method shorthand for every `methods`, `computed`, and `watch` entry that needs `this`. Arrow functions do not bind `this` to the component instance and will read `undefined`.
- `computed` getters must be pure: no side effects, no async, no DOM access. A computed needing both read and write (e.g. for `v-model`) uses the `{ get() {...}, set(value) {...} }` object form.
- `watch` entries are declarative (`watch: { propName(newVal, oldVal) {...} }`) or, for dynamic/nested paths, string-keyed (`watch: { 'form.address.city'(newVal) {...} }`). Prefer the declarative option over imperative `this.$watch(...)` calls in `created()` unless the watched source is only known at runtime.
- Reach for `deep: true` on a `watch` entry only when watching an object/array as a whole and caring about nested mutations — watching a specific nested path string already tracks that leaf without `deep`.

## Lifecycle and DOM

- All lifecycle logic lives in the corresponding Options API hook key: `created`, `mounted`, `beforeUnmount`, etc. — never `onMounted()`/`onUnmounted()` free functions.
- Clean up timers, listeners, and subscriptions in `beforeUnmount`.
- Read or measure the DOM only after `await this.$nextTick()`.

## Props, Emits, Two-Way Binding, and Templates

- Declare `props` as an object with `type` and `required`/`default` per key (avoid the bare-array `props: ['id']` form except for the simplest internal components). Declare `emits` as an array or validated object.
- There is no `defineModel` macro in the Options API. Two-way binding (`v-model`) is wired manually: accept a `modelValue` prop, declare `emits: ['update:modelValue']`, and expose a `computed` with `get`/`set` that reads the prop and emits `update:modelValue` on write.
- Put a `:key` on every `v-for`, a stable unique primitive. Never the array index, never an object.
- Never put `v-if` and `v-for` on the same element. Wrap with `<template v-for>` plus an inner `v-if`, or precompute a filtered list via a `computed`.

```vue
<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'CounterInput',
  props: {
    modelValue: { type: Number as PropType<number>, required: true },
  },
  emits: ['update:modelValue'],
  computed: {
    count: {
      get(): number {
        return this.modelValue
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      },
    },
  },
})
</script>

<template>
  <input type="number" v-model.number="count" />
</template>
```

## Reference

- ECC skills: `frontend-patterns`, `vite-patterns`.
- Docs: <https://vuejs.org/guide/typescript/options-api.html> · <https://vuejs.org/guide/essentials/reactivity-fundamentals.html> · <https://eslint.vuejs.org/>
