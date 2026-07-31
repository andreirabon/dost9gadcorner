---
paths:
  - "**/*.vue"
---

# Vue Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with Vue specific content.

## Stack reality

This project is Vue 3 + TypeScript + Inertia v2, built with Vite and styled with
Tailwind v4. There is **no vue-router** and **no Pinia** — routing is server-side
through Inertia, and page state lives in the component or in Inertia page props.
Do not introduce either without approval.

## SFC Structure

- Always `<script setup lang="ts">`. That is what all 162 components use; do not
  add `defineComponent` / Options API components to this codebase.
- Block order inside a `.vue` file: `<script setup>`, then `<template>`, then
  `<style scoped>`. One component per file, and a single root element in the
  template (Inertia requires it).
- Naming: component files PascalCase (`ReportMetricCard.vue`), shared logic
  modules camelCase (`reportPatch.ts`), composables `use*` (`useReportChartHeight.ts`).
- Format with Prettier, lint with `eslint-plugin-vue` flat config, type-check
  with `vue-tsc --noEmit`. `npm run lint` must exit 0.

## Reactivity Discipline

- `ref()` for values you reassign, `reactive()` sparingly for grouped state.
  Read and write refs through `.value` in script, unwrapped in template.
- `computed()` getters must be pure: no side effects, no async, no DOM access.
  Prefer `computed` over `watch` for anything derived.
- Writable computed uses `{ get, set }` — required for any `v-model` bound to a
  computed. See `deleteSnapshotDialogOpen` in `pages/reports/Edit.vue`.
- Reach for `watch` / `watchEffect` only for side effects (syncing props into
  local state, imperative DOM work). Clean up timers and listeners in
  `onBeforeUnmount`.
- Non-reactive helpers (chart instances, observers) belong in a plain `let` or a
  `shallowRef`, never a deep `reactive` — proxying them can break the library.

## Props, Emits, Templates

- Type props with `defineProps<Props>()` and a local `interface Props`. Use
  `withDefaults` for optional props.
- Declare emitted events with `defineEmits<{ ... }>()`.
- Two-way binding is `defineModel()`, or `modelValue` + `update:modelValue`.
- Put a `:key` on every `v-for` — a stable unique primitive, never the array
  index, never an object.
- Never put `v-if` and `v-for` on the same element. Wrap with `<template v-for>`
  plus an inner `v-if`, or precompute a filtered list in a `computed`.

## Inertia

- Navigate with `router.visit/patch/post/delete` or `<Link>`; never `window.location`.
- Prefer `useForm` for form state. For sparse PATCH payloads use the helpers in
  `helpers/reportPatch.ts` with `form.transform(...)`.
- Always pass `preserveScroll` on in-page saves so the view does not jump.
- Handle `onError` on every mutating request. A request with no error branch
  fails silently for the user.
- Server-derived permissions arrive as props (`abilities`, `editableFundingSlugs`).
  Treat them as presentation only — authorization is enforced on the server.

```vue
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

interface Props {
    reportYearId: number;
    isLocked: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ saved: [id: number] }>();

const femaleCount = ref(0);
const canSave = computed(() => !props.isLocked && femaleCount.value >= 0);

function save(): void {
    router.patch(
        route('report-years.gfps-membership.update', props.reportYearId),
        { female_count: femaleCount.value },
        {
            preserveScroll: true,
            onSuccess: () => emit('saved', props.reportYearId),
            onError: (errors) => showNotice(Object.values(errors)[0]),
        },
    );
}
</script>
```

## Reference

- ECC skills: `inertia-vue-development`, `frontend-patterns`, `vite-patterns`.
- Docs: <https://vuejs.org/api/sfc-script-setup.html> · <https://inertiajs.com/> · <https://eslint.vuejs.org/>
